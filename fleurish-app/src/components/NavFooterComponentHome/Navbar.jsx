import React, { useEffect, useRef, useState } from "react";
import { FiUser, FiShoppingCart, FiSettings, FiPackage, FiLogOut } from "react-icons/fi";
import { useCart } from "../../components/HomeComponent/CartContext";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const Navbar = () => {
  const { cartItems, cartCount, cartTotal, toggleCartPopup, showCartPopup } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const popupRef = useRef();
  const userMenuRef = useRef();
  const navigate = useNavigate();
  
  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();

  // Tutup popup jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        if (showCartPopup) toggleCartPopup();
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        if (showUserMenu) setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCartPopup, toggleCartPopup, showUserMenu]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="w-full bg-[#FEFAE0] shadow-sm fixed z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Kiri */}
        <div className="flex gap-6 text-sm font-medium text-gray-800">
          <a 
            href="#store" 
            className="hover:text-green-700 transition"
            onClick={(e) => {
              e.preventDefault();
              const storeSection = document.getElementById('store');
              if (storeSection) {
                storeSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Shop
          </a>
          <a 
            href="#aboult" 
            className="hover:text-green-700 transition"
            onClick={(e) => {
              e.preventDefault();
              const aboutSection = document.getElementById('aboult');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            About
          </a>
        </div>

        {/* Tengah */}
        <a
          href="/"
          className="flex items-center gap-2 font-bold text-gray-900 text-xl"
        >
          <img
            src="/logo-fleuris.svg"
            alt="fleurish"
            style={{ width: "30px", height: "30px" }}
          />
          Fleurish
        </a>

        {/* Kanan */}
        <div className="flex gap-4 text-gray-800 text-xl relative">
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hover:text-green-700 transition flex items-center"
            >
              <FiUser />
            </button>
            
            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div 
                ref={userMenuRef}
                className="absolute right-0 top-8 mt-2 w-48 bg-[#FEFAE0]  shadow-lg rounded-lg border border-gray-200 z-50"
              >
                {isLoggedIn ? (
                  <>
                    <div className="p-3 font-semibold border-b text-sm">
                      {userRole === 'admin' ? 'Admin' : 'Pengguna'}
                    </div>
                    <ul className="py-1">
                      {userRole === 'admin' && (
                        <li>
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/dashboard');
                            }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fefae0c9] "
                          >
                            <FiSettings className="text-gray-500" />
                            Dashboard Admin
                          </button>
                        </li>
                      )}
                      <li>
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/profile');
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#cec9ac]"
                        >
                          <FiSettings className="text-gray-500" />
                          Pengaturan Profil
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/my-orders');
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#cec9ac]"
                        >
                          <FiPackage className="text-gray-500" />
                          Pesanan Saya
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#cec9ac]"
                        >
                          <FiLogOut className="text-gray-500" />
                          Keluar
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <ul className="py-1">
                    <li>
                      <button 
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/login');
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="text-gray-500" />
                        Masuk
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={toggleCartPopup}
            className="hover:text-green-700 transition relative"
          >
            <FiShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Cart Popup */}
          {showCartPopup && (
            <div
              ref={popupRef}
              className="absolute right-0 top-12 mt-2 w-80 bg-[#FEFAE0] shadow-lg rounded-lg border border-gray-200 z-50"
            >
              <div className="p-3 font-semibold border-b">
                Keranjang Belanja
              </div>
              <div className="max-h-72 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="p-3 text-sm text-gray-600 text-center">
                    Keranjang kosong
                  </p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 border-b last:border-b-0"
                    >
                      <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm font-semibold text-red-500">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-red-500">
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    toggleCartPopup();
                    navigate("/checkout");
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#4B7F52] hover:bg-[#3a6240] rounded-md"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
