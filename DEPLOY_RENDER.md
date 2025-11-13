Render deployment:
1. Create Postgres on Render and copy DATABASE_URL to backend env.
2. Run SQL in backend/sql/schema.sql and backend/sql/seed.sql.
3. Create backend Web Service with start command `npm start`.
4. Create Static Site for frontend with build command `npm install && npm run build`, publish `dist`.
5. Replace uploads with cloud storage for production if needed.
