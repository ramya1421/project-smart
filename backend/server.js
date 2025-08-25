// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database("./faq.db", (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// API Route: /ask
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.status(400).json({ error: "Question is required" });
  }

  db.get(
    "SELECT answer FROM faq WHERE question LIKE ? LIMIT 1",
    [`%${question}%`],
    (err, row) => {
      if (err) {
        console.error("❌ Database error:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (row) {
        res.json({ answer: row.answer });
      } else {
        res.json({ answer: "❓ Sorry, no matching FAQ found." });
      }
    }
  );
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
