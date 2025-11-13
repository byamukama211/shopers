CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  comment TEXT,
  sizes TEXT,
  price NUMERIC,
  images TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  area TEXT,
  address_note TEXT,
  items TEXT,
  delivery_fee NUMERIC,
  total NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
