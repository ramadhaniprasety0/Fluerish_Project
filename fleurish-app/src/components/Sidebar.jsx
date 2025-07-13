import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaBox, FaShoppingCart, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../utils/auth';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: <FaChartLine />, path: '/dashboard' },
    { label: 'Products', icon: <FaBox />, path: '/product' },
    { label: 'Order Confirmation', icon: <FaShoppingCart />, path: '/order-confirmation' },
    // { label: 'Customers', icon: <FaUsers />, path: '/customers' },
  ];

  return (
    <div className="w-64 bg-white p-6 fixed left-0 h-full border-r border-[#E1E9D5]">
      <div className="flex items-center gap-2 mb-12">
        <img src="/logo-fleuris.svg" alt="Fleurish Logo" className="h-8" />
        <span className="text-2xl font-semibold text-[#4B7F52]">Fleurish Admin</span>
      </div>

      <ul className="space-y-2 mb-8">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg ${
                  isActive || location.pathname === item.path
                    ? 'bg-[#FFF8E7] text-[#4B7F52]'
                    : 'text-gray-600 hover:bg-[#FFF8E7] hover:text-[#4B7F52]' 
                }`
              }
              end={item.path === '/'}
            >
              {item.icon} <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition duration-200"
        >
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
