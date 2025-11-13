import React from 'react'
export default function Footer(){
  return (
   <footer style={{
      background: '#D936F2 ',
      color: 'white',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      textAlign: 'left',
    }}>
      <div>Follow our social media handles</div>
      <div style={{marginTop:8}}>
        <p>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a> ·
        <a href="https://x.com/MensDreamkla" target="_blank" rel="noreferrer"> X</a> ·
        <a href="https://tiktok.com" target="_blank" rel="noreferrer"> TikTok</a> ·
        <a href="https://instagram.com" target="_blank" rel="noreferrer"> IG</a>
        </p>
      </div>
    
      {/* About Column */}
      <div id="about" style={{ flex: '1 1 200px', margin: '10px' }}>
        <h3>About</h3>
        <p>
          Helps customers find perfectly fitting clothes by matching 
          personal measurements with vendor sizes.
          All men clothes at affordable price
        </p>
      </div>

      {/* Services Column */}
      <div id="services" style={{ flex: '1 1 200px', margin: '10px' }}>
        <h3>Services</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Custom size recommendations</li>
          <li>Fast and affordable delivery within Kampala</li>
          <li>Payment at delivery, Easy swaps and returns, </li>
          <li>Style advice and clothes for hire</li>
        </ul>
      </div>

      {/* Contact Column */}
      <div id="contact" style={{ flex: '1 1 200px', margin: '10px' }}>
        <h3>Contact</h3>
        <p>Email: mensdreamkampala@gmail.com</p>
        <p>Phone: +256 780 561 171</p>
        <p>Whats app us: +256 780 561 171</p>
      </div>

      {/* Location Column */}
      <div id="location" style={{ flex: '1 1 200px', margin: '10px' }}>
        <h3>Find us at Ham Shopping grounds Kampala
          opp Western Gate First floor Room NO.HO25 </h3>
        <p>Kampala, Uganda</p>
      </div>
    </footer>
  );
}