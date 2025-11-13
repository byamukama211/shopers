import React from 'react';
import Shop from './Shop'; // 👈 Import your shop page

export default function Home() {
  return (
    <main>
      {/* 🖼️ Hero section */}
      <section
        className="hero"
        style={{
          position: 'relative',
          height: '70vh',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/hero.jpg"
          alt="hero"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>
            Mens – Your Online Cloth Store
          </h1>
          <p style={{ fontSize: '1.2rem' }}>Delivery country wide call/whats app 0780561171</p>
          <p>Delivery @kampala 4k</p>
          <p>order Now Recieve Today</p>
        </div>
      </section>

      {/* 🛍️ Products (Shop component) */}
      <section style={{ padding: '2rem 1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Shop Now</h2>
        <Shop /> {/* 👈 Displays product categories + products */}
      </section>
    </main>
  );
}
