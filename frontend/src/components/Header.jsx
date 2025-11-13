import React from 'react';
import { Link } from 'react-router-dom';
export default function Header(){
  return (
    <header className="site-header">
      <div className="logo"><Link to="/">Mens</Link></div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        <a href="#about">About Us</a>
        <a href="#location">Location</a>
        <Link to="/">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}
