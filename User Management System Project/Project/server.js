const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "DELETE", "PUT", "SORT"],
  credentials: true
}));

const port = process.env.PORT || 5000;

// MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "usersdb",
  port: 3306
}).promise();

// Login
app.post('/login', async (req, res) => {
  const { name, pwd } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM data WHERE uname = ? AND pwd = ?",
      [name, pwd]
    );
    if (rows.length > 0) {
      res.send({ success: true });
      console.log("Success");
    } else {
      res.send({ success: false });
      console.log("Failed");
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send({ success: false, error: "Database error" });
  }
});

// Get all data
app.get("/data", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM data");
    res.json(rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Database error");
  }
});

// Add new user
app.post("/add-data", async (req, res) => {
  const { id, name, pwd, gen, role } = req.body;
  try {
    await db.query(
      "INSERT INTO data (id, uname, pwd, gender, role) VALUES (?, ?, ?, ?, ?)",
      [id, name, pwd, gen, role]
    );
    res.json({ success: true, message: "User added successfully." });
    console.log("Data Stored...");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Remove user by ID
app.delete("/remove-data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM data WHERE id = ?", [id]);
    res.json({ success: true, message: "Data removed successfully." });
    console.log("Data removed...");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Update user
app.put("/update-data/:id", async (req, res) => {
  const { id } = req.params;
  const { name, pwd, gen, role } = req.body;
  try {
    await db.query(
      "UPDATE data SET uname = ?, pwd = ?, gender = ?, role = ? WHERE id = ?",
      [name, pwd, gen, role, id]
    );
    res.status(200).json({ success: true, message: "Data updated successfully." });
    console.log("Data updated successfully...");
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Get user by ID
app.get("/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM data WHERE id = ?", [id]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
