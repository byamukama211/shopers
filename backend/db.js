import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }   // 🔥 REQUIRED for Render PostgreSQL
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));
