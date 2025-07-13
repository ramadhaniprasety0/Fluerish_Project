import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiRefreshCw, FiShoppingBag, FiPackage, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);


const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalProducts: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [salesTimeFilter, setSalesTimeFilter] = useState('week'); // 'week' or 'month'
  const [productSalesTimeFilter, setProductSalesTimeFilter] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  
  // Fungsi untuk mendapatkan data penjualan berdasarkan filter waktu
  const getSalesData = (filter) => {
    if (!orders.length) return { labels: [], datasets: [] };
    
    const today = new Date();
    let startDate;
    
    if (filter === 'week') {
      // Data 7 hari terakhir
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
    } else {
      // Data 30 hari terakhir
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
    }
    
    // Inisialisasi array untuk menyimpan data per hari
    const dateLabels = [];
    const salesData = [];
    
    // Buat array tanggal untuk label
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const dateString = currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      dateLabels.push(dateString);
      
      // Inisialisasi penjualan untuk tanggal ini
      salesData.push(0);
      
      // Pindah ke hari berikutnya
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Hitung penjualan per hari
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      // Pastikan tanggal order berada dalam rentang yang kita inginkan
      if (orderDate >= startDate && orderDate <= today) {
        // Hitung indeks dalam array
        const dayDiff = Math.floor((orderDate - startDate) / (24 * 60 * 60 * 1000));
        if (dayDiff >= 0 && dayDiff < salesData.length) {
          salesData[dayDiff] += order.totalAmount;
        }
      }
    });
    
    return {
      labels: dateLabels,
      datasets: [
        {
          label: 'Penjualan (Rp)',
          data: salesData,
          borderColor: '#4B7F52',
          backgroundColor: 'rgba(75, 127, 82, 0.5)',
          tension: 0.1,
        },
      ],
    };
  };
  
  // Fungsi untuk mendapatkan data penjualan produk berdasarkan filter waktu
  const getProductSalesData = (filter) => {
    if (!orders.length) return { labels: [], datasets: [] };
    
    const today = new Date();
    let startDate;
    
    if (filter === 'week') {
      // Data 7 hari terakhir
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
    } else {
      // Data 30 hari terakhir
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 29);
    }
    
    // Hitung penjualan per produk
    const productSales = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      // Pastikan tanggal order berada dalam rentang yang kita inginkan
      if (orderDate >= startDate && orderDate <= today) {
        // Hitung penjualan per produk
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = 0;
          }
          productSales[item.name] += item.price * item.quantity;
        });
      }
    });
    
    // Ambil 5 produk dengan penjualan tertinggi
    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const productLabels = sortedProducts.map(item => item[0]);
    const productData = sortedProducts.map(item => item[1]);
    
    return {
      labels: productLabels,
      datasets: [
        {
          label: 'Penjualan Produk (Rp)',
          data: productData,
          backgroundColor: [
            'rgba(75, 127, 82, 0.7)',
            'rgba(243, 230, 190, 0.7)',
            'rgba(96, 108, 56, 0.7)',
            'rgba(188, 161, 53, 0.7)',
            'rgba(162, 177, 138, 0.7)'
          ],
          borderColor: [
            'rgba(75, 127, 82, 1)',
            'rgba(243, 230, 190, 1)',
            'rgba(96, 108, 56, 1)',
            'rgba(188, 161, 53, 1)',
            'rgba(162, 177, 138, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersRes = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Fetch products
      const productsRes = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!ordersRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const ordersData = await ordersRes.json();
      const products = await productsRes.json();
      
      // Simpan data orders untuk digunakan di grafik
      setOrders(ordersData);
      
      // Calculate today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = ordersData.filter(order => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length;
      
      // Calculate monthly revenue
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthlyRevenue = ordersData.reduce((total, order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          return total + order.totalAmount;
        }
        return total;
      }, 0);
      
      setStats({
        todayOrders,
        totalProducts: products.length,
        monthlyRevenue
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  return (
    <>
     {/* Overview Cards */}
     <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#4B7F52]">Overview</h2>
              <button 
                onClick={fetchDashboardStats} 
                className="text-[#4B7F52] hover:underline flex items-center gap-1"
                disabled={loading}
              >
                <FiRefreshCw className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm">Today's Orders</h3>
                    <p className="text-2xl font-bold text-[#4B7F52]">
                      {loading ? '...' : stats.todayOrders}
                    </p>
                  </div>
                  <div className="bg-[#F3E6BE] p-3 rounded-lg">
                    <FiShoppingBag className="text-[#4B7F52] text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm">Total Products</h3>
                    <p className="text-2xl font-bold text-[#4B7F52]">
                      {loading ? '...' : stats.totalProducts}
                    </p>
                  </div>
                  <div className="bg-[#F3E6BE] p-3 rounded-lg">
                    <FiPackage className="text-[#4B7F52] text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm">Revenue (Monthly)</h3>
                    <p className="text-2xl font-bold text-[#4B7F52]">
                      {loading ? '...' : `Rp ${stats.monthlyRevenue.toLocaleString('id-ID')}`}
                    </p>
                  </div>
                  <div className="bg-[#F3E6BE] p-3 rounded-lg">
                    <FiDollarSign className="text-[#4B7F52] text-xl" />
                  </div>
                </div>
              </div>
            </div>
      </section>

          {/* Grafik Penjualan */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#4B7F52]">Grafik Penjualan</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSalesTimeFilter('week')} 
                  className={`px-3 py-1 rounded-md flex items-center ${salesTimeFilter === 'week' ? 'bg-[#4B7F52] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiCalendar className="mr-1" /> 1 Minggu
                </button>
                <button 
                  onClick={() => setSalesTimeFilter('month')} 
                  className={`px-3 py-1 rounded-md flex items-center ${salesTimeFilter === 'month' ? 'bg-[#4B7F52] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiCalendar className="mr-1" /> 1 Bulan
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Belum ada data penjualan</p>
                </div>
              ) : (
                <div className="h-64">
                  <Line 
                    data={getSalesData(salesTimeFilter)} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: salesTimeFilter === 'week' ? 'Penjualan 7 Hari Terakhir' : 'Penjualan 30 Hari Terakhir',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return 'Rp ' + value.toLocaleString('id-ID');
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Grafik Produk Terlaris */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#4B7F52]">Produk Terlaris</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setProductSalesTimeFilter('week')} 
                  className={`px-3 py-1 rounded-md flex items-center ${productSalesTimeFilter === 'week' ? 'bg-[#4B7F52] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiCalendar className="mr-1" /> 1 Minggu
                </button>
                <button 
                  onClick={() => setProductSalesTimeFilter('month')} 
                  className={`px-3 py-1 rounded-md flex items-center ${productSalesTimeFilter === 'month' ? 'bg-[#4B7F52] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <FiCalendar className="mr-1" /> 1 Bulan
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Belum ada data penjualan produk</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <Bar 
                      data={getProductSalesData(productSalesTimeFilter)} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          title: {
                            display: true,
                            text: productSalesTimeFilter === 'week' ? '5 Produk Terlaris (7 Hari)' : '5 Produk Terlaris (30 Hari)',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID');
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="h-64">
                    <Pie 
                      data={getProductSalesData(productSalesTimeFilter)} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          title: {
                            display: true,
                            text: productSalesTimeFilter === 'week' ? 'Distribusi Penjualan (7 Hari)' : 'Distribusi Penjualan (30 Hari)',
                          },
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
    </>
         
  );
};

export default DashboardAdmin;
