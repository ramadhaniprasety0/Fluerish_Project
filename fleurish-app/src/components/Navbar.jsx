import React from 'react';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center bg-[#FFF8E7] rounded-xl mx-4 mt-4">
      <h1 className="text-xl font-semibold text-[#4B7F52]">Dahboard Fluerish Bekasi</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="text-[#4B7F52] hover:text-green-700 relative">
            <FaBell className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
          </button>
        </div>
        <button className="flex items-center gap-2">
          <img src="https://ui-avatars.com/api/?name=Admin&background=4B7F52&color=fff" alt="User" className="w-8 h-8 rounded-full" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;