const faqs = [
  {
    question: "How to reset my password?",
    answer: "Click on 'Forgot password' and follow the steps.",
  },
  {
    question: "How to access internal tools?",
    answer: "Login with employee ID and visit the tools portal.",
  },
  {
    question: "Who to contact for tech issues?",
    answer: "Reach out to the IT support team.",
  },
];

function findAnswer(question) {
  const q = String(question || "").trim().toLowerCase();
  if (!q) return null;
  const match = faqs.find(
    (faq) =>
      faq.question.toLowerCase().includes(q) ||
      q.includes(faq.question.toLowerCase())
  );
  return match ? match.answer : "❓ Sorry, no matching FAQ found.";
}

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  const question = req.body && req.body.question;
  if (!question || String(question).trim() === "") {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Question is required" }));
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ answer: findAnswer(question) }));
};
