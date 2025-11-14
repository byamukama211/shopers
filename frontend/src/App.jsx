import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import Home from './pages/Home';
import Cart from './pages/Cart';

import { useLocation } from "react-router-dom";
export default function App() {const location = useLocation();
  console.log("ROUTER WORKING:", location);
  return (
    
    <>
      <Header />
      <Routes>
        {/* 👇 Home should be the default route */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </>
  );
}
