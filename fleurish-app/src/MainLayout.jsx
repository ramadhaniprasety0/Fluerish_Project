// File: /src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from './components/Sidebar';
import SlidebarAdmin from './components/SidebarAdmin'
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="bg-[#FFF8E7] min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
