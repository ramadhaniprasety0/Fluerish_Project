import React from 'react';
import { FaBell } from 'react-icons/fa';
import Navbar from '../components/NavFooterComponentHome/Navbar';
import Footer from '../components/NavFooterComponentHome/Footer';
import Carausel from '../components/HomeComponent/CarauselComponents';
import StoreContent from '../components/HomeComponent/HomeContent';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-[#cbd9b4] to-[#d3cba6] text-gray-600 work-sans leading-normal text-base tracking-normal">
    <Navbar />
    <Carausel />
    <StoreContent />
    <Footer />
    </div>
  );
};

export default HomePage;