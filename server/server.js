
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "10mb" }));

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Get all reservations
app.get("/api/reservations", async (req, res) => {
  const result = await pool.query("SELECT id, name FROM reservations ORDER BY date DESC");
  res.json(result.rows);
});

// Get single reservation
app.get("/api/reservations/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [req.params.id]);
  const reservation = result.rows[0];

  // Si slip existe, le convertir en base64
  if (reservation.slip) {
    reservation.slip = reservation.slip.toString('base64');
  }

  res.json(reservation);
});



// Get reserved dates
app.get("/api/reserved-dates", async (req, res) => {
  const result = await pool.query("SELECT DISTINCT date FROM reservations");
  res.json(result.rows.map(r => r.date));
});


app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
