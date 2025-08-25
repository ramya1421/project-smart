const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./faq.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS faq (id INTEGER PRIMARY KEY, question TEXT, answer TEXT)");
  db.run("INSERT INTO faq (question, answer) VALUES (?, ?)", ["How to reset my password?", "Click on 'Forgot password' and follow the steps."]);
  db.run("INSERT INTO faq (question, answer) VALUES (?, ?)", ["How to access internal tools?", "Login with employee ID and visit the tools portal."]);
  db.run("INSERT INTO faq (question, answer) VALUES (?, ?)", ["Who to contact for tech issues?", "Reach out to the IT support team."]);
});

db.close();
