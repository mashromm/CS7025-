import express from 'express';
import axios from 'axios';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Get DART time (proxy to Irish Rail API)
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

// Get feedback (all or filtered by station)
app.get('/feedback', async (req, res) => {
  try {
    const station = req.query.station;
    if (station) {
      const { rows } = await pool.query(
        'SELECT * FROM feedback WHERE station_name = $1 ORDER BY created_at DESC',
        [station]
      );
      res.json(rows);
    } else {
      const { rows } = await pool.query(
        'SELECT * FROM feedback ORDER BY created_at DESC'
      );
      res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit feedback
app.post('/feedback', async (req, res) => {
  const { station_name, category, description } = req.body;

  if (!station_name || !category || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO feedback (station_name, category, description, status, created_at)
       VALUES ($1, $2, $3, 'Pending', NOW())`,
      [station_name, category, description]
    );
    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update feedback status
app.put('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      'UPDATE feedback SET status = $1 WHERE id = $2',
      [status, id]
    );
    res.json({ id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
