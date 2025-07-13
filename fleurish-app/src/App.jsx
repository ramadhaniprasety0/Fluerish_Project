// File: /src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardAdmin from './pages/DashboardAdmin';
import CatalogProduct from './components/ProductComponents/CatalogProduct';
import HomePage from './pages/Homepage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderConfirmationAdmin from './pages/OrderConfirmationAdmin';
import { CartProvider } from "./components/HomeComponent/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './Routes/PrivateRoute';
import AdminRoute from './Routes/AdminRoute';
import UserRoute from './Routes/UserRoute';
import PublicRoute from './Routes/PublicRoute';



function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          {/* 🔓 Public for Guest */}
          {/* <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
            } /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-orders" element={
            <UserRoute>
              <MyOrdersPage />
            </UserRoute>
          } />
          <Route path="/profile" element={
            <UserRoute>
              <UserProfilePage />
            </UserRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/product" element={<CatalogProduct />} />
            <Route path="/order-confirmation" element={
              <AdminRoute>
                <OrderConfirmationAdmin />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
