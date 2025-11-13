import React, {useState} from 'react';
export default function Cart(){
  const cart = JSON.parse(localStorage.getItem('mens_cart')||'[]');
  const [form, setForm] = useState({customer_name:'', phone:'', area:'Kampala Central', address_note:''});
  const areas = ['Kampala Central','Kampala East','Kampala West','Entebbe'];
  const deliveryFees = {'Kampala Central':2000,'Kampala East':3000,'Kampala West':3000,'Entebbe':5000};
  const itemsTotal = cart.reduce((s,i)=> s + i.price*i.qty,0);
  const delivery_fee = deliveryFees[form.area] || 4000;
  const total = itemsTotal + delivery_fee;

  async function submit(){
    const resp = await fetch('/api/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, items:cart, delivery_fee, total})});
    const data = await resp.json();
    alert(data.message || 'Submitted');
    localStorage.removeItem('mens_cart');
    window.location.href = '/';
  }

  return (<div style={{padding:20}}>
    <h2>Checkout</h2>
    <div>
      {cart.map((it,idx)=> <div key={idx}>{it.name} - {it.qty} x UGX {it.price}</div>)}
    </div>
    <div style={{marginTop:10}}>
      <label>Name<input value={form.customer_name} onChange={e=>setForm({...form, customer_name:e.target.value})} /></label><br/>
      <label>Phone<input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /></label><br/>
      <label>Area<select value={form.area} onChange={e=>setForm({...form, area:e.target.value})}>{areas.map(a=> <option key={a} value={a}>{a}</option>)}</select></label><br/>
      <label>Address note<input value={form.address_note} onChange={e=>setForm({...form, address_note:e.target.value})} /></label>
      <div>Delivery fee: UGX {delivery_fee}</div>
      <div>Total: UGX {total}</div>
      <div>You will be contacted for verification.</div>
      <button onClick={submit}>Buy Now</button>
    </div>
  </div>);
}
