import express from 'express';
import axios from 'axios';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// MySQL Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'dart.cbs4skg46h4c.eu-north-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Dart123_',
  database: process.env.DB_NAME || 'dart_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/dart-time', async (req, res) => {
    try {
        const stationName = req.query.station;
        if (!stationName) {
            return res.status(400).json({ error: "Missing station name" });
        }

        const encodedStation = encodeURIComponent(stationName);
        const apiUrl = `http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=${encodedStation}`;

        // 用 axios 代理请求，避免 CORS 限制
        const response = await axios.get(apiUrl, { responseType: 'text' });

        res.set("Access-Control-Allow-Origin", "*"); // 允许 CORS
        res.send(response.data); // 直接返回 XML 数据
    } catch (error) {
        console.error("Error fetching DART time:", error.message);
        res.status(500).json({ error: "Failed to fetch DART time" });
    }
});


app.get('/feedback', async (req, res) => {
    try {
        const station = req.query.station; // 获取 URL 参数 ?station=
        if (station) {
            const [rows] = await pool.query('SELECT * FROM feedback WHERE station_name = ? ORDER BY created_at DESC', [station]);
            res.json(rows);
        } else {
            const [rows] = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
            res.json(rows);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Submit passenger feedback
app.post("/feedback", async (req, res) => {
    const { station_name, category, description } = req.body;

    console.log("Received feedback on server:", req.body);

    if (!station_name || !category || !description) {
        console.error(" Missing fields!", { station_name, category, description });
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        console.log(" SQL Query:", "INSERT INTO feedback (station_name, category, description, status, created_at) VALUES (?, ?, ?, 'Pending', NOW())");
        console.log(" SQL Parameters:", [station_name, category, description]);

        const [result] = await pool.query(
            "INSERT INTO feedback (station_name, category, description, status, created_at) VALUES (?, ?, ?, 'Pending', NOW())",
            [station_name, category, description]
        );

        console.log("Data inserted into database:", result);

        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error(" Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Update feedback status (Admin Panel)
app.put('/feedback/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE feedback SET status = ? WHERE id = ?',
            [status, id]
        );
        res.json({ id, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

