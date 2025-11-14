import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import jwt from 'jsonwebtoken';


import { pool } from './db.js';   // 🔥 Use the SSL-enabled pool

dotenv.config();


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Admin login (simple)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const correctUser = process.env.ADMIN_USER || 'admin';
  const correctPass = process.env.ADMIN_PASS || 'adminpass';
  if (username === correctUser && password === correctPass) {
    const token = jwt.sign({ type: 'admin', user: username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'invalid credentials' });
});

// Create product (admin)
app.post('/api/admin/products', async (req, res) => {
  const { name, category, comment, sizes, price, images } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO products (name, category, comment, sizes, price, images) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [name, category, comment, sizes, price, JSON.stringify(images || [])]
    );
    res.json({ id: r.rows[0].id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

// List products
app.get('/api/products', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM products ORDER BY id DESC');
    const rows = r.rows.map(row => ({ ...row, images: JSON.parse(row.images || '[]'), price: Number(row.price) }));
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

// Get single product
app.get('/api/product/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'not found' });
    const row = r.rows[0];
    row.images = JSON.parse(row.images || '[]');
    row.price = Number(row.price);
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

// Upload images (multipart) - returns array of paths
app.post('/api/admin/upload', upload.array('images', 20), (req, res) => {
  const files = (req.files || []).map(f => '/uploads/' + f.filename);
  res.json({ files });
});

// Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, phone, area, address_note, items, delivery_fee, total } = req.body;
    const r = await pool.query('INSERT INTO orders (customer_name, phone, area, address_note, items, delivery_fee, total) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [customer_name, phone, area, address_note, JSON.stringify(items), delivery_fee, total]);
    res.json({ id: r.rows[0].id, message: 'You will be contacted for verification' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on', PORT));
