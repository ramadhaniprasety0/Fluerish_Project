import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaRegEyeSlash  } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);
      window.location.href = data.user.role === 'admin' ? '/dashboard' : '/';
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6]">
      <div className="bg-[#fdf8e8] shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <img src="/logo-fleuris.svg" alt="Logo" className="mx-auto h-10 mb-3" />

        <h1 className="text-3xl font-bold text-[#4B5320]">Fleurish</h1>
        <p className="text-sm mt-2 text-gray-600">Hello, welcome back to Fleurish</p>

        <form onSubmit={handleLogin} className="mt-6 text-left space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <div className="flex items-center bg-[#e6d6a9] rounded px-3 py-2">
              <input
                type="email"
                placeholder="Masukan Email Anda"
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
                placeholder="Masukan password"
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-l font-medium text-white bg-[#4B7F52] hover:bg-[#3a6240] rounded-md"
          >
            Login
          </button>
          
          <div className="text-center mt-4 text-sm text-gray-600">
            Belum punya akun? <Link to="/register" className="text-[#4B5320] font-semibold">Daftar</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
