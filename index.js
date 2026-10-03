require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Health check
app.get('/health-check', (req, res) => {
  res.json({ status: "ok" });
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, campus_id } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "name and email are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, campus_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, campus_id`,
      [name, email, campus_id ?? null]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});