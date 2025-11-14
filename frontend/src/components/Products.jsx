import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      {products.length === 0 && <p>No products found.</p>}

      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <h2>{p.name}</h2>
          <p><strong>Category:</strong> {p.category}</p>
          <p><strong>Price:</strong> {p.price}</p>

          {p.images?.map((img, i) => (
            <img
              key={i}
              src={`${import.meta.env.VITE_API_URL}${img}`}
              alt=""
              width="120"
              style={{ marginRight: "10px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Products;
