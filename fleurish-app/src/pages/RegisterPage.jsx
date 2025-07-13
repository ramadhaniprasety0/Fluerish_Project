import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaRegEyeSlash  } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi password
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registrasi gagal');
        return;
      }

      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6]">
      <div className="bg-[#fdf8e8] shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <img src="/logo-fleuris.svg" alt="Logo" className="mx-auto h-10 mb-3" />
        <h1 className="text-3xl font-bold text-[#4B5320]">Fleurish</h1>
        <p className="text-sm mt-2 text-gray-600">Daftar akun baru di Fleurish</p>

        {success ? (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
            <p>Registrasi berhasil! Silahkan <Link to="/login" className="font-bold underline">login</Link> untuk melanjutkan.</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 text-left space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
              <div className="flex items-center bg-[#e6d6a9] rounded px-3 py-2">
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder:text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="flex items-center bg-[#e6d6a9] rounded px-3 py-2">
                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder:text-gray-700 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="flex items-center bg-[#e6d6a9] rounded px-3 py-2">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Buat password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder:text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="ml-2 text-sm text-gray-600 focus:outline-none"
                >
                  {showPwd ? <FaEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
              <div className="flex items-center bg-[#e6d6a9] rounded px-3 py-2">
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-transparent w-full outline-none placeholder:text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="ml-2 text-sm text-gray-600 focus:outline-none"
                >
                  {showPwd ? <FaEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-[#4B5320] hover:bg-[#3a4215] text-white py-2 rounded-lg mt-4 shadow-md"
            >
              Daftar
            </button>

            <div className="text-center mt-4 text-sm text-gray-600">
              Sudah punya akun? <Link to="/login" className="text-[#4B5320] font-semibold">Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;