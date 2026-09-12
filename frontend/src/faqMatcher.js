const NO_MATCH = "Sorry, no matching FAQ found.";

const faqs = [
  {
    id: "password",
    category: "Account",
    question: "How to reset my password?",
    answer:
      "Open the login page, choose Forgot password, and follow the email reset steps. Use a new password that is at least 12 characters.",
  },
  {
    id: "tools",
    category: "Access",
    question: "How to access internal tools?",
    answer:
      "Sign in with your employee ID, then open the tools portal from the Operations menu. Request access from your supervisor if a tool is missing.",
  },
  {
    id: "tech",
    category: "Support",
    question: "Who to contact for tech issues?",
    answer:
      "Contact the IT support team at it-help@smart-disaster.org or call the 24/7 desk at 1800-555-0142.",
  },
  {
    id: "flood",
    category: "Safety",
    question: "What should I do during a flood?",
    answer:
      "Move to higher ground immediately, avoid walking or driving through flood water, and follow official evacuation orders. Call emergency services only if you are trapped.",
  },
  {
    id: "shelter",
    category: "Relief",
    question: "Where is the nearest shelter?",
    answer:
      "Check the live shelter map in the Relief tab or text SHELTER to 999-333. Bring ID, medications, and a 24-hour supply of water if you can.",
  },
  {
    id: "kit",
    category: "Preparedness",
    question: "What should I pack in an emergency kit?",
    answer:
      "Pack water, non-perishable food, a flashlight, batteries, a first-aid kit, copies of IDs, necessary medicines, and a battery power bank.",
  },
  {
    id: "report",
    category: "Emergency",
    question: "How do I report an emergency?",
    answer:
      "Call 112 for life-threatening emergencies. For non-urgent damage reports, use Report incident in this app and include your location and photos.",
  },
];

const testCases = [
  {
    name: "partial password keyword",
    input: "password",
    shouldMatch: true,
    faqId: "password",
  },
  {
    name: "exact password question",
    input: "How to reset my password?",
    shouldMatch: true,
    faqId: "password",
  },
  {
    name: "case-insensitive password reset",
    input: "HOW TO RESET MY PASSWORD?",
    shouldMatch: true,
    faqId: "password",
  },
  {
    name: "internal tools access",
    input: "access internal tools",
    shouldMatch: true,
    faqId: "tools",
  },
  {
    name: "tech support contact",
    input: "tech issues",
    shouldMatch: true,
    faqId: "tech",
  },
  {
    name: "flood safety",
    input: "What should I do during a flood?",
    shouldMatch: true,
    faqId: "flood",
  },
  {
    name: "nearest shelter",
    input: "nearest shelter",
    shouldMatch: true,
    faqId: "shelter",
  },
  {
    name: "emergency kit packing",
    input: "emergency kit",
    shouldMatch: true,
    faqId: "kit",
  },
  {
    name: "report emergency",
    input: "report an emergency",
    shouldMatch: true,
    faqId: "report",
  },
  {
    name: "unknown question",
    input: "what is the weather on mars",
    shouldMatch: false,
    faqId: null,
  },
  {
    name: "empty question",
    input: "   ",
    shouldMatch: false,
    faqId: null,
  },
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findAnswer(question) {
  const q = normalize(question);
  if (!q) {
    return { found: false, answer: NO_MATCH, faq: null };
  }

  const match = faqs.find((faq) => {
    const questionText = normalize(faq.question);
    return questionText.includes(q) || q.includes(questionText);
  });

  if (match) {
    return { found: true, answer: match.answer, faq: match };
  }

  return { found: false, answer: NO_MATCH, faq: null };
}

function createAskHandler() {
  return (req, res) => {
    const send = (statusCode, payload) => {
      res.statusCode = statusCode;
      if (typeof res.setHeader === "function") {
        res.setHeader("Content-Type", "application/json");
      }
      const body = JSON.stringify(payload);
      if (typeof res.end === "function") {
        res.end(body);
      }
      return body;
    };

    if (req.method !== "POST") {
      return send(405, { error: "Method not allowed" });
    }

    const question = req.body && req.body.question;
    if (!question || String(question).trim() === "") {
      return send(400, { error: "Question is required" });
    }

    const result = findAnswer(question);
    return send(200, { answer: result.answer, found: result.found });
  };
}

module.exports = {
  NO_MATCH,
  faqs,
  testCases,
  findAnswer,
  createAskHandler,
};
