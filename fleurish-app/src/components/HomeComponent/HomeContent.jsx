import { useEffect, useState } from "react";
import { BiCartAdd, BiMinus, BiPlus, BiSearch } from "react-icons/bi";
import { FiShoppingCart, FiFilter } from "react-icons/fi";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";


const StoreContent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
    const [selectedStatus, setSelectedStatus] = useState("all");
    const { cartItems, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    // Ambil data dari backend
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);
  
  // Filter dan search products
  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter(product => product.status === selectedStatus);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, products, priceRange, selectedStatus]);

  return (
    <>
      <section className="bg-grey-100 py-8" id="store">
        <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
          <nav id="store" className="w-full z-30 top-0 px-6 py-1">
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
              <a
                className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-3xl"
                href="#"
              >
                Product
              </a>
              
              {/* Search and Filter */}
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center mt-4 md:mt-0">
                <div className="relative w-full md:w-64 mb-4 md:mb-0 md:mr-4">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="w-full px-4 py-2 border border-[#4B7F52] rounded-md focus:outline-none focus:ring-2 focus:ring-green-700/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <BiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4B7F52] text-white rounded-md hover:bg-[#3a6240] transition"
                >
                  <FiFilter />
                  Filter
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {showFilters && (
              <div className="w-full bg-[#FEFAE0] p-4 rounded-md shadow-md mt-2 mb-4 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Harga</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600/50"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600/50"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600/50"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">Semua</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>
                  
                  {/* Reset Button */}
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setPriceRange({ min: 0, max: 1000000 });
                        setSelectedStatus("all");
                      }}
                      className="px-4 py-2 bg-[#4B7F52] text-white rounded-md hover:bg-[#3a6240] transition"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {filteredProducts.length === 0 ? (
            <div className="w-full text-center py-8">
              <p className="text-gray-600">Tidak ada produk yang ditemukan.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
            <div
              key={product._id}
              className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
            >
              <a href="#">
                <img
                  className="hover:grow hover:shadow-lg w-full h-60 object-cover rounded-tl-lg rounded-tr-lg"
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt="Product"
                />
              </a>
              <div className="bg-[#FFF8E7] p-6 rounded-bl-lg rounded-br-lg">
                <p className="font-medium truncate text-lg">{product.name}</p>
                <div className="pt-1 flex items-center justify-between">
                  <p className="pt-1 text-gray-900">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
                  
                  {/* Cek stok produk */}
                  {product.stock <= 0 ? (
                    <span className="text-red-500 font-medium text-sm">Stock Habis</span>
                  ) : cartItems.find(item => item._id === product._id) ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const item = cartItems.find(item => item._id === product._id);
                          if (item) {
                            updateQuantity(product._id, (item.quantity || 1) - 1);
                          }
                        }}
                        className="rounded-full bg-gray-100 w-6 h-6 flex items-center justify-center hover:bg-gray-200"
                      >
                        <BiMinus className="text-[#606C38]" />
                      </button>
                      
                      <span className="text-sm font-medium">
                        {cartItems.find(item => item._id === product._id)?.quantity || 0}
                      </span>
                      
                      <button
                        onClick={() => {
                          const item = cartItems.find(item => item._id === product._id);
                          if (item) {
                            updateQuantity(product._id, (item.quantity || 1) + 1);
                          }
                        }}
                        className="rounded-full bg-gray-100 w-6 h-6 flex items-center justify-center hover:bg-gray-200"
                      >
                        <BiPlus className="text-[#606C38]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="rounded-md bg-[#4B7F52]-100 px-2 py-1 text-lg font-medium text-[#4B7F52] ring-1 ring-[#606C38] ring-inset hover:bg-[#606C38] hover:text-white focus:outline-none focus:ring-2 focus:ring-green-600/50 w-8 h-8 flex items-center justify-center"
                    >
                      <BiCartAdd />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )))
          }
        </div>
      </section>

      <section className="bg-[#FEFAE0] py-8" id="aboult">
        <div className="container py-8 px-6 mx-auto">
          <a
            className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-3xl mb-8"
            href="#"
          >
            About
          </a>
          <p className="mt-8 mb-8 text-2xl">
          Fleurish is a local florist based in Bekasi, offering a wide variety of fresh and creatively designed flower arrangements for every special occasion. Embracing unique designs and fast service, Fleurish now provides an online shopping experience that allows customers to easily order bouquets, decorations, and instant gifts without visiting the store. With an integrated digital system, we are committed to delivering a practical, secure, and delightful flower shopping experience in the modern era.
            <br />
            <a
              className="text-gray-800 underline hover:text-gray-900"
              href="http://savoy.nordicmade.com/"
              target="_blank"
              rel="noreferrer"
            >
              Web Development
            </a>{" "}
            created by {" "} 
            <a
              className="text-gray-800 underline hover:text-gray-900"
              href="#"
            >
              Farah Tri Mahardini,
            </a>{" "}
            <a
              className="text-gray-800 underline hover:text-gray-900"
              href="#"
              target="_blank"
              rel="noreferrer"
            >
              Nadia Ayu Rahmawati,
            </a>
            {" "}
            and
            {" "}
            <a
              className="text-gray-800 underline hover:text-gray-900"
              href="#"
              target="_blank"
              rel="noreferrer"
            >
              Ramadhani Prasetyo
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default StoreContent;
