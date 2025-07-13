import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavFooterComponentHome/Navbar';
import Footer from '../components/NavFooterComponentHome/Footer';
import { isAuthenticated } from '../utils/auth';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave } from 'react-icons/fi';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Redirect ke halaman login jika pengguna belum login
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data profil');
        }

        const data = await response.json();
        setUserData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengambil data profil' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil');
      }

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Terjadi kesalahan saat memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi password tidak cocok' });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui password');
      }

      // Reset form password
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({ type: 'success', text: 'Password berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: error.message || 'Terjadi kesalahan saat memperbarui password' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6] text-gray-600 work-sans leading-normal text-base tracking-normal">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Pengaturan Profil</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-4xl mb-3">
                    <FiUser />
                  </div>
                  <h3 className="text-lg font-semibold">{userData.name}</h3>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-1">Bergabung sejak</p>
                  <p className="font-medium">Januari 2023</p>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              
              {/* Profile Form */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-4">Informasi Pribadi</h3>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <FiUser />
                        </div>
                        <input 
                          type="text" 
                          name="name" 
                          value={userData.name} 
                          onChange={handleProfileChange} 
                          className="w-full pl-10 p-2 border border-gray-300 rounded" 
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <FiMail />
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          value={userData.email} 
                          onChange={handleProfileChange} 
                          className="w-full pl-10 p-2 border border-gray-300 rounded" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FiPhone />
                      </div>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={userData.phone} 
                        onChange={handleProfileChange} 
                        className="w-full pl-10 p-2 border border-gray-300 rounded" 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Alamat</label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-gray-500">
                        <FiMapPin />
                      </div>
                      <textarea 
                        name="address" 
                        value={userData.address} 
                        onChange={handleProfileChange} 
                        className="w-full pl-10 p-2 border border-gray-300 rounded" 
                        rows="3" 
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kota</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={userData.city} 
                        onChange={handleProfileChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kode Pos</label>
                      <input 
                        type="text" 
                        name="postalCode" 
                        value={userData.postalCode} 
                        onChange={handleProfileChange} 
                        className="w-full p-2 border border-gray-300 rounded" 
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={saving}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    {saving ? 'Menyimpan...' : (
                      <>
                        <FiSave />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* Password Form */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Ubah Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password Saat Ini</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FiLock />
                      </div>
                      <input 
                        type="password" 
                        name="currentPassword" 
                        value={passwordData.currentPassword} 
                        onChange={handlePasswordChange} 
                        className="w-full pl-10 p-2 border border-gray-300 rounded" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Password Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FiLock />
                      </div>
                      <input 
                        type="password" 
                        name="newPassword" 
                        value={passwordData.newPassword} 
                        onChange={handlePasswordChange} 
                        className="w-full pl-10 p-2 border border-gray-300 rounded" 
                        required 
                        minLength="6"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FiLock />
                      </div>
                      <input 
                        type="password" 
                        name="confirmPassword" 
                        value={passwordData.confirmPassword} 
                        onChange={handlePasswordChange} 
                        className="w-full pl-10 p-2 border border-gray-300 rounded" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={saving}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    {saving ? 'Menyimpan...' : (
                      <>
                        <FiSave />
                        Perbarui Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;