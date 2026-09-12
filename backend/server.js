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
  [
    "How to reset my password?",
    "Open the login page, choose Forgot password, and follow the email reset steps. Use a new password that is at least 12 characters.",
  ],
  [
    "How to access internal tools?",
    "Sign in with your employee ID, then open the tools portal from the Operations menu. Request access from your supervisor if a tool is missing.",
  ],
  [
    "Who to contact for tech issues?",
    "Contact the IT support team at it-help@smart-disaster.org or call the 24/7 desk at 1800-555-0142.",
  ],
  [
    "What should I do during a flood?",
    "Move to higher ground immediately, avoid walking or driving through flood water, and follow official evacuation orders. Call emergency services only if you are trapped.",
  ],
  [
    "Where is the nearest shelter?",
    "Check the live shelter map in the Relief tab or text SHELTER to 999-333. Bring ID, medications, and a 24-hour supply of water if you can.",
  ],
  [
    "What should I pack in an emergency kit?",
    "Pack water, non-perishable food, a flashlight, batteries, a first-aid kit, copies of IDs, necessary medicines, and a battery power bank.",
  ],
  [
    "How do I report an emergency?",
    "Call 112 for life-threatening emergencies. For non-urgent damage reports, use Report incident in this app and include your location and photos.",
  ],
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
