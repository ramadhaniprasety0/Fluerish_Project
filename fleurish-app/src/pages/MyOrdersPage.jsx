import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavFooterComponentHome/Navbar';
import Footer from '../components/NavFooterComponentHome/Footer';
import { isAuthenticated } from '../utils/auth';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect ke halaman login jika pengguna belum login
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Debugging: Log userId dari localStorage
        const userId = localStorage.getItem('userId');
        console.log('User ID dari localStorage:', userId);
        
        // Debugging: Decode token untuk melihat isinya
        if (token) {
          try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            console.log('Token decoded:', decoded);
          } catch (e) {
            console.error('Error parsing JWT token:', e);
          }
        }
        
        console.log('Mengambil pesanan dari API...');
        const response = await fetch('http://localhost:5000/api/orders/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Gagal mengambil data pesanan');
        }

        const data = await response.json();
        console.log('Pesanan diterima dari API:', data.length);
        
        // Backend sudah memfilter pesanan berdasarkan userId dari token
        // Tidak perlu filter tambahan di frontend
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Terjadi kesalahan saat mengambil data pesanan. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Mendapatkan status pesanan dalam bahasa Indonesia
  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'Menunggu Konfirmasi',
      'processing': 'Diproses',
      'shipped': 'Dikirim',
      'delivered': 'Terkirim',
      'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  // Mendapatkan kelas warna untuk status
  const getStatusColorClass = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6] text-gray-600 work-sans leading-normal text-base tracking-normal">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        <h2 className="text-2xl font-bold mb-8">Riwayat Pesanan Saya</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki pesanan. Mulai belanja sekarang!</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="bg-[#FEFAE0] rounded-lg shadow-lg overflow-hidden">
            {orders.map((order) => (
              <div key={order._id} className="border-b last:border-b-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Pesanan #{order._id.substring(0, 8)}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Informasi Pengiriman</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Nama:</span> {order.name}</p>
                        <p><span className="font-medium">Email:</span> {order.email}</p>
                        <p><span className="font-medium">Telepon:</span> {order.phone}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Alamat:</span> {order.address}</p>
                        <p><span className="font-medium">Kota:</span> {order.city}</p>
                        <p><span className="font-medium">Kode Pos:</span> {order.postalCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Item Pesanan</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
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
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm"><span className="font-medium">Metode Pembayaran:</span> {order.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat (COD)'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Total Pesanan</p>
                      <p className="text-lg font-bold text-red-500">Rp {Number(order.totalAmount).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;