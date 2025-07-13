import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/HomeComponent/CartContext';
import Navbar from '../components/NavFooterComponentHome/Navbar';
import Footer from '../components/NavFooterComponentHome/Footer';
import AlertSuccess from '../components/AlertSuccess';
import { FiUpload } from 'react-icons/fi';
import { isAuthenticated } from '../utils/auth';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'transfer',
    paymentProof: null
  });
  
  const [paymentProofName, setPaymentProofName] = useState('');
  const fileInputRef = useRef(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Menghitung total harga
  const totalPrice = cartItems.reduce((total, item) => total + Number(item.price), 0);
  
  // Fetch user profile data if authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          setLoadingProfile(true);
          const token = localStorage.getItem('token');
          
          const response = await fetch('http://localhost:5000/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      if (files.length > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
        setPaymentProofName(files[0].name);
      }
    } else if (type === 'checkbox' && name === 'useProfileAddress') {
      setUseProfileAddress(checked);
      
      // If checked, fill form with profile data
      if (checked && profileData) {
        setFormData(prev => ({
          ...prev,
          name: profileData.name || prev.name,
          email: profileData.email || prev.email,
          phone: profileData.phone || prev.phone,
          address: profileData.address || prev.address,
          city: profileData.city || prev.city,
          postalCode: profileData.postalCode || prev.postalCode
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasi bukti pembayaran jika metode pembayaran adalah transfer
    if (formData.paymentMethod === 'transfer' && !formData.paymentProof) {
      setError('Silakan upload bukti pembayaran untuk metode transfer bank');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Membuat FormData untuk mengirim data termasuk file
      const orderData = new FormData();
      orderData.append('name', formData.name);
      orderData.append('email', formData.email);
      orderData.append('address', formData.address);
      orderData.append('city', formData.city);
      orderData.append('postalCode', formData.postalCode);
      orderData.append('phone', formData.phone);
      orderData.append('paymentMethod', formData.paymentMethod);
      orderData.append('totalAmount', totalPrice + 10000);
      
      // Menambahkan items dari cart
      orderData.append('items', JSON.stringify(cartItems));
      
      // Menambahkan bukti pembayaran jika ada
      if (formData.paymentProof) {
        orderData.append('paymentProof', formData.paymentProof);
      }
      
      // Mendapatkan token dan userId dari user yang login
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      // Menambahkan userId ke data pesanan
      orderData.append('userId', userId);
      
      // Mengirim data ke backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // Menambahkan token untuk autentikasi
        },
        body: orderData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat membuat pesanan');
      }
      
      // Jika berhasil, bersihkan keranjang
      clearCart();
      
      // Tampilkan pesan sukses dengan komponen AlertSuccess
      setShowSuccessAlert(true);
      navigate('/my-orders');
      // Redirect ke halaman riwayat pesanan pengguna setelah beberapa detik
      // Navigasi akan dilakukan oleh komponen AlertSuccess melalui onClose callback
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'Terjadi kesalahan saat membuat pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6] text-gray-600 work-sans leading-normal text-base tracking-normal">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h2>
          <p className="mb-6">Anda belum menambahkan produk ke keranjang.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Kembali Berbelanja
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6] text-gray-600 work-sans leading-normal text-base tracking-normal">
      {showSuccessAlert && (
        <AlertSuccess 
          message="Pesanan berhasil dibuat! Terima kasih telah berbelanja." 
          onClose={() => {
            setShowSuccessAlert(false);
            navigate('/my-orders');
          }}
        />
      )}
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Checkout</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Pengiriman */}
          <div className="md:w-2/3">
            <div className="bg-[#FEFAE0] p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Informasi Pengiriman</h3>
              <form onSubmit={handleSubmit}>
                {profileData && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="useProfileAddress"
                        checked={useProfileAddress}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span>Gunakan alamat dari profil saya</span>
                    </label>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Alamat</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded" 
                    rows="3" 
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kota</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kode Pos</label>
                    <input 
                      type="text" 
                      name="postalCode" 
                      value={formData.postalCode} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No. Telepon</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-300 rounded" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                  <p className="text-sm text-gray-500">Pembayaran dapat dilakukan melalui transfer bank. An Fleusri 852193211</p>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="transfer" 
                        checked={formData.paymentMethod === 'transfer'} 
                        onChange={handleChange} 
                        className="mr-2" 
                      />
                      Transfer Bank
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={formData.paymentMethod === 'cod'} 
                        onChange={handleChange} 
                        className="mr-2" 
                      />
                      Bayar di Tempat (COD)
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'transfer' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Upload Bukti Pembayaran</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        name="paymentProof"
                        ref={fileInputRef}
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="inline-flex items-center px-4 py-2 border border-[#4B5320] rounded-md shadow-sm text-sm font-medium text-white bg-[#4B5320] hover:bg-[#4b5320c2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiUpload className="mr-2 h-5 w-5 text-white" />
                        Pilih File
                      </button>
                      <span className="ml-3 text-sm text-gray-500">
                        {paymentProofName || 'Belum ada file dipilih'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Format yang didukung: JPG, PNG, atau PDF. Maksimal 2MB.
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Ringkasan Pesanan */}
          <div className="md:w-1/3 sticky">
            <div className="bg-[#FEFAE0] p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 mb-3 pb-3 border-b last:border-b-0">
                    <img 
                      src={`http://localhost:5000${item.imageUrl}`} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-red-500">Rp {Number(item.price).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Ongkos Kirim</span>
                  <span>Rp 10.000</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>Rp {(totalPrice + 10000).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;