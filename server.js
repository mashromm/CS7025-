const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.PGHOST || 'postgres.railway.internal',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE || 'railway',
  port: process.env.PGPORT || 5432,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

// GET train time from Irish Rail API
app.get('/dart-time', async (req, res) => {
  try {
    const stationName = req.query.station;
    if (!stationName) {
      return res.status(400).json({ error: "Missing station name" });
    }

    const encodedStation = encodeURIComponent(stationName);
    const apiUrl = `http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${encodedStation}`;

    const response = await axios.get(apiUrl, { responseType: 'text' });
    res.set("Access-Control-Allow-Origin", "*");
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching DART time:", error.message);
    res.status(500).json({ error: "Failed to fetch DART time" });
  }
});

// GET feedback (optionally filter by station)
app.get('/feedback', async (req, res) => {
  try {
    const station = req.query.station;
    let query = 'SELECT * FROM feedback ORDER BY created_at DESC';
    let values = [];

    if (station) {
      query = 'SELECT * FROM feedback WHERE station_name = $1 ORDER BY created_at DESC';
      values = [station];
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST feedback submission
app.post('/feedback', async (req, res) => {
  const { station_name, category, description } = req.body;

  if (!station_name || !category || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO feedback (station_name, category, description, status, created_at) VALUES ($1, $2, $3, 'Pending', NOW()) RETURNING *",
      [station_name, category, description]
    );

    res.json({ message: "Feedback submitted successfully", feedback: result.rows[0] });
  } catch (err) {
    console.error("Error inserting feedback:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT feedback status update
app.put('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE feedback SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
