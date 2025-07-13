import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Coba ambil data cart dari localStorage saat inisialisasi
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCartPopup, setShowCartPopup] = useState(false);

  // Simpan cart ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // Cek apakah produk memiliki stok
    if (product.stock <= 0) {
      // Gunakan toast jika tersedia, atau alert jika tidak
      if (typeof toast !== 'undefined') {
        toast.error("Stok produk habis!");
      } else {
        alert("Stok produk habis!");
      }
      return;
    }
    
    // Cek apakah produk sudah ada di keranjang
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Jika produk sudah ada, tambahkan quantity jika stok mencukupi
      const currentItem = cartItems[existingItemIndex];
      const newQuantity = (currentItem.quantity || 1) + 1;
      
      // Cek apakah quantity baru melebihi stok yang tersedia
      if (newQuantity > product.stock) {
        if (typeof toast !== 'undefined') {
          toast.warning(`Stok produk hanya tersisa ${product.stock}`);
        } else {
          alert(`Stok produk hanya tersisa ${product.stock}`);
        }
        return;
      }
      
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity
      };
      setCartItems(updatedItems);
    } else {
      // Jika produk belum ada, tambahkan dengan quantity 1
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Cari produk di keranjang
    const cartItem = cartItems.find(item => item._id === productId);
    if (!cartItem) return;
    
    // Cek stok produk dari API
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(product => {
        if (quantity > product.stock) {
          toast.warning(`Stok produk hanya tersisa ${product.stock}`);
          // Update quantity ke maksimum stok yang tersedia
          setCartItems(prev => 
            prev.map(item => 
              item._id === productId ? { ...item, quantity: product.stock } : item
            )
          );
        } else {
          // Update quantity jika stok mencukupi
          setCartItems(prev => 
            prev.map(item => 
              item._id === productId ? { ...item, quantity } : item
            )
          );
        }
      })
      .catch(err => {
        console.error("Error checking product stock:", err);
        // Jika gagal mengecek stok, tetap update quantity
        setCartItems(prev => 
          prev.map(item => 
            item._id === productId ? { ...item, quantity } : item
          )
        );
      });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCartPopup = () => {
    setShowCartPopup((prev) => !prev);
  };

  // Hitung total item dengan mempertimbangkan quantity
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Hitung total harga
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * (item.quantity || 1), 
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        showCartPopup,
        toggleCartPopup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;