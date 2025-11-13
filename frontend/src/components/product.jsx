import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 && <p>No products found</p>}
      {products.map((p) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>Category: {p.category}</p>
          <p>Price: {p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;

