import React, { useEffect, useState } from 'react';
const DEFAULT_SIZES = ['S','M','L','XL','2XL'];


  export default function Shop(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All','Shirts','T-Shirts','Jeans','Trousers','Sweaters','2Piece','Suits','design shirts','Others']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uiState, setUiState] = useState({});
  const [cart, setCart] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('mens_cart')||'[]'); }catch{ return []; }});
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(()=>{ async function load(){ try{ setLoading(true); const res = await fetch('/api/products'); const data = await res.json(); const normalized = data.map(normalizeProduct); setProducts(normalized); const cats = new Set(categories); normalized.forEach(p=> cats.add(capitalize(p.category||'Others'))); setCategories(Array.from(cats)); }catch(err){ console.error(err);} finally{ setLoading(false);} } load(); },[]);

  useEffect(()=> localStorage.setItem('mens_cart', JSON.stringify(cart)), [cart]);

  function normalizeProduct(p){
    let imgs = p.images || [];
    if(typeof imgs === 'string'){
      try{ imgs = JSON.parse(p.images); }catch{ imgs = p.images.includes(',') ? p.images.split(',').map(s=>s.trim()) : [p.images]; }
    }
    imgs = imgs.map(normalizeImagePath);
    let sizes = p.sizes || p.size || '';
    if(Array.isArray(sizes)){}
    else if(typeof sizes === 'string'){
      if(sizes.includes(',')) sizes = sizes.split(',').map(s=>s.trim());
      else if(sizes.trim()==='') sizes = DEFAULT_SIZES;
      else sizes = [sizes.trim()];
    } else sizes = DEFAULT_SIZES;
    return {...p, images: imgs, sizes, price: Number(p.price||0)};
  }

  function normalizeImagePath(img) {
  if (!img) return '/placeholder.png';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  // ✅ Always return full backend URL
  const baseUrl = 'http://localhost:4000';
  if (img.startsWith('/uploads/')) return `${baseUrl}${img}`;
  if (img.includes('/uploads/')) {
    const idx = img.indexOf('/uploads/');
    return `${baseUrl}${img.slice(idx)}`;
  }
  return `${baseUrl}/uploads/${img}`;
}


  function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase()+s.slice(1); }

  function getUi(pId){ return uiState[pId] || { imgIdx: 0, qty: 1, size: '' }; }
  function setUi(pId, patch){ setUiState(prev=> ({...prev, [pId]: {...(prev[pId]||{}), ...patch}})); }

  function changeQty(pId, delta){ const cur = getUi(pId).qty || 1; const next = Math.max(1, cur+delta); setUi(pId, {qty: next}); }

  function handleAddToCart(product){
    const u = getUi(product.id);
    const size = u.size || product.sizes[0] || DEFAULT_SIZES[0];
    if(!size){ alert('Please select a size.'); return; }
    const colorIdx = u.imgIdx || 0;
    const qty = u.qty || 1;
    const image = product.images[colorIdx] || product.images[0] || '/placeholder.png';
    setCart(prev=>{
      const copy = [...prev];
      const matchIndex = copy.findIndex(it => it.productId===product.id && it.size===size && it.colorIdx===colorIdx);
      if(matchIndex>=0) copy[matchIndex].qty += qty;
      else copy.push({ productId: product.id, name: product.name, price: Number(product.price), size, colorIdx, qty, image });
      return copy;
    });
    alert(`${product.name} added to cart (${qty} x, size ${size})`);
  }

  function toggleOverlay(){ setOverlayOpen(s=>!s); }
  function updateCartQty(index, delta){ setCart(prev=>{ const c=[...prev]; c[index].qty = Math.max(0, (c[index].qty||1)+delta); if(c[index].qty===0) c.splice(index,1); return c; }); }
  function removeCartItem(index){ setCart(prev=> prev.filter((_,i)=>i!==index)); }
  function computeSubtotal(){ return cart.reduce((s,it)=> s + it.price*it.qty, 0); }

  const visibleProducts = products.filter(p=> selectedCategory==='All' ? true : p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="shop-page" style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Shop</h1>
      <div className="categories-bar" style={{ display:'flex', gap:12, overflowX:'auto', padding:'8px 0', whiteSpace:'nowrap', borderBottom:'1px solid #eee', marginBottom:18 }}>
        {categories.map(cat=>(
          <button key={cat} onClick={()=>setSelectedCategory(cat)} style={{ border:'none', background: selectedCategory===cat ? '#0b6ef6' : '#f2f2f2', color: selectedCategory===cat ? 'white' : '#333', padding:'8px 14px', borderRadius:20, cursor:'pointer', flex:'0 0 auto' }}>{cat}</button>
        ))}
      </div>

      {loading ? <div>Loading products...</div> : (
        <div className="product-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:18, marginTop:10 }}>
          {visibleProducts.map(p=>{
            const ui = getUi(p.id);
            const mainImg = p.images[ui.imgIdx||0] || '/placeholder.png';
            return (
              <div key={p.id} className="product-card" style={{ background:'white', borderRadius:10, padding:12, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', alignItems:'stretch' }}>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <img src={mainImg} alt={p.name} style={{ width:'100%', height:200, objectFit:'cover', borderRadius:8 }} />
                </div>
                <div style={{ display:'flex', gap:8, marginTop:8, justifyContent:'center' }}>
                  {p.images.map((img,idx)=>(
                    <img key={idx} src={img} alt={`${p.name}-${idx}`} onClick={()=>setUi(p.id, {imgIdx:idx})} style={{ width:44, height:44, objectFit:'cover', borderRadius:6, cursor:'pointer', border: ui.imgIdx===idx ? '2px solid #0b6ef6' : '1px solid #ddd' }} />
                  ))}
                </div>
                <div style={{ padding:'8px 6px', flexGrow:1 }}>
                  <h3 style={{ margin:'8px 0 4px 0', fontSize:16 }}>{p.name}</h3>
                  <p style={{ margin:0, color:'#666', fontSize:13 }}>{p.comment}</p>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontWeight:700, color:'#0b6ef6' }}>UGX {p.price}</div>
                  <div style={{ fontSize:12, color:'#777' }}>{p.category}</div>
                </div>
                <div style={{ marginTop:10 }}>
                  <select value={ui.size||''} onChange={e=>setUi(p.id,{size:e.target.value})} style={{ width:'100%', padding:8, borderRadius:6, border:'1px solid #ddd' }}>
                    <option value="">Select size</option>
                    {p.sizes.map(s=> <option value={s} key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button onClick={()=>changeQty(p.id,-1)} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #ddd', cursor:'pointer', background:'#fff' }}>−</button>
                    <div style={{ minWidth:28, textAlign:'center' }}>{ui.qty||1}</div>
                    <button onClick={()=>changeQty(p.id,1)} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #ddd', cursor:'pointer', background:'#fff' }}>+</button>
                  </div>
                  <button onClick={()=>handleAddToCart(p)} style={{ background:'#0b6ef6', color:'white', border:'none', flex:1, padding:'8px 10px', borderRadius:6, cursor:'pointer' }}>Add to cart</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ position:'fixed', right:18, bottom:18, zIndex:2000 }}>
        <button onClick={toggleOverlay} style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', borderRadius:999, border:'none', background:'#0b6ef6', color:'white', cursor:'pointer', boxShadow:'0 6px 18px rgba(11,110,246,0.18)' }} title="Open cart">
          🛒
          <div style={{ background:'white', color:'#0b6ef6', padding:'2px 8px', borderRadius:20, fontWeight:700 }}>{cart.reduce((s,it)=>s+it.qty,0)}</div>
        </button>
      </div>

      {overlayOpen && (
        <div style={{ position:'fixed', right:18, bottom:72, width:360, maxHeight:'70vh', overflowY:'auto', background:'white', borderRadius:10, boxShadow:'0 12px 36px rgba(0,0,0,0.18)', zIndex:3000, padding:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <strong>Your Cart</strong>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>{ setCart([]); }} style={{ cursor:'pointer' }}>Clear</button>
              <button onClick={toggleOverlay} style={{ cursor:'pointer' }}>Close</button>
            </div>
          </div>
          <div style={{ marginTop:10 }}>
            {cart.length===0 && <div style={{ padding:20 }}>Your cart is empty.</div>}
            {cart.map((it,idx)=>(
              <div key={idx} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'center' }}>
                <img src={it.image} alt={it.name} style={{ width:64, height:64, objectFit:'cover', borderRadius:6 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700 }}>{it.name}</div>
                  <div style={{ fontSize:13, color:'#666' }}>Size: {it.size}</div>
                  <div style={{ marginTop:6, display:'flex', gap:8, alignItems:'center' }}>
                    <button onClick={()=>updateCartQty(idx,-1)} style={{ padding:'4px 8px' }}>−</button>
                    <div>{it.qty}</div>
                    <button onClick={()=>updateCartQty(idx,1)} style={{ padding:'4px 8px' }}>+</button>
                    <div style={{ marginLeft:'auto', fontWeight:700 }}>UGX {it.price * it.qty}</div>
                    <button onClick={()=>removeCartItem(idx)} style={{ marginLeft:8, color:'#a00' }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length>0 && (
            <div style={{ borderTop:'1px solid #eee', paddingTop:8, marginTop:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700 }}><div>Subtotal</div><div>UGX {computeSubtotal()}</div></div>
              <div style={{ marginTop:10 }}>
                <button onClick={()=>{ window.location.href='/cart'; }} style={{ width:'100%', padding:10, borderRadius:6, background:'#0b6ef6', color:'white', border:'none', cursor:'pointer' }}>Checkout</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
