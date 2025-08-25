const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json()); // Middleware to parse JSON

// Connect to SQLite database
const db = new sqlite3.Database("./preferences.db", (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    food TEXT NOT NULL,
    spice TEXT NOT NULL,
    liked INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// POST → Add new preference
app.post("/preferences", (req, res) => {
  const { username, food, spice, liked } = req.body;

  db.run(
    `INSERT INTO preferences (username, food, spice, liked) VALUES (?, ?, ?, ?)`,
    [username, food, spice, liked],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "✅ Preference saved successfully!",
        id: this.lastID,
      });
    }
  );
});

// GET → All preferences
app.get("/preferences", (req, res) => {
  db.all(`SELECT * FROM preferences`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ✅ GET → Single preference by ID
app.get("/preferences/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM preferences WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Preference not found" });
    res.json(row);
  });
});

// ✅ PUT → Update preference
app.put("/preferences/:id", (req, res) => {
  const { id } = req.params;
  const { username, food, spice, liked } = req.body;

  db.run(
    `UPDATE preferences SET username = ?, food = ?, spice = ?, liked = ? WHERE id = ?`,
    [username, food, spice, liked, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Preference not found" });
      res.json({ message: "✅ Preference updated successfully!" });
    }
  );
});

// ✅ DELETE → Remove preference
app.delete("/preferences/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM preferences WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Preference not found" });
    res.json({ message: "🗑️ Preference deleted successfully!" });
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
