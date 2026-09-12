import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import AnswerBox from "./components/AnswerBox";
import { faqs, findAnswer, testCases } from "./faqMatcher";

function App() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [found, setFound] = useState(false);

  const handleSearch = async (nextQuestion) => {
    setLoading(true);
    setAnswer("");
    setError("");
    setFound(false);
    setQuestion(nextQuestion);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "/api/ask";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      const matched =
        typeof data.found === "boolean"
          ? data.found
          : !/no matching faq/i.test(String(data.answer || ""));
      setAnswer(data.answer);
      setFound(matched);
    } catch (err) {
      const fallback = findAnswer(nextQuestion);
      setAnswer(fallback.answer);
      setFound(fallback.found);
      if (!fallback.found && err && err.message === "Failed to fetch") {
        setError("");
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_42%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Operations desk
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Smart Disaster Response
            </h1>
            <p className="mt-2 max-w-xl text-slate-400">
              Fast answers for field teams, shelters, and residents during an incident.
            </p>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            System online
          </span>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-7">
            <h2 className="text-xl font-semibold">FAQ assistant</h2>
            <p className="mt-1 mb-5 text-sm text-slate-400">
              Search the knowledge base or tap a suggested question.
            </p>
            <SearchBar onSearch={handleSearch} loading={loading} />
            <div className="mt-4 flex flex-wrap gap-2">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  data-testid={`chip-${faq.id}`}
                  onClick={() => handleSearch(faq.question)}
                  className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-left text-xs text-slate-200 transition hover:border-amber-300/50 hover:text-amber-200"
                >
                  {faq.question}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <AnswerBox
                answer={answer}
                loading={loading}
                error={error}
                found={found}
                question={question}
              />
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sample test cases
            </h2>
            <p className="mt-2 mb-4 text-sm text-slate-400">
              Use these inputs to confirm matching, unknown questions, and empty search.
            </p>
            <ul className="space-y-3" data-testid="test-cases">
              {testCases.map((testCase) => (
                <li
                  key={testCase.name}
                  className="rounded-xl border border-white/8 bg-slate-950/70 p-3"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => testCase.input.trim() && handleSearch(testCase.input)}
                    disabled={!testCase.input.trim()}
                  >
                    <p className="text-sm font-medium text-slate-100">{testCase.name}</p>
                    <p className="mt-1 font-mono text-xs text-amber-200/90">
                      {testCase.input.trim() ? `"${testCase.input}"` : "(empty / whitespace)"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Expect {testCase.shouldMatch ? "a match" : "no match"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;
