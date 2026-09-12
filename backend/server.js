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

const SEED_FAQS = [
  ["How to reset my password?", "Click on 'Forgot password' and follow the steps."],
  ["How to access internal tools?", "Login with employee ID and visit the tools portal."],
  ["Who to contact for tech issues?", "Reach out to the IT support team."],
];

// Connect to SQLite database
const db = new sqlite3.Database("./faq.db", (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
    db.run(
      "CREATE TABLE IF NOT EXISTS faq (id INTEGER PRIMARY KEY, question TEXT, answer TEXT)",
      (createErr) => {
        if (createErr) {
          console.error("❌ Failed to create FAQ table:", createErr.message);
          return;
        }
        db.get("SELECT COUNT(*) AS count FROM faq", (countErr, row) => {
          if (countErr || (row && row.count > 0)) return;
          const stmt = db.prepare("INSERT INTO faq (question, answer) VALUES (?, ?)");
          SEED_FAQS.forEach((faq) => stmt.run(faq));
          stmt.finalize();
          console.log("✅ Seeded FAQ data");
        });
      }
    );
  }
});

function handleAsk(req, res) {
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
}

app.post("/ask", handleAsk);
app.post("/api/ask", handleAsk);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
