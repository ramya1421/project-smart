import React from "react";

const AnswerBox = ({ answer, loading, error, found, question }) => {
  let body;
  let tone = "idle";

  if (loading) {
    tone = "loading";
    body = (
      <p data-testid="answer-status" className="animate-pulse text-slate-300">
        Checking verified guidance...
      </p>
    );
  } else if (error) {
    tone = "error";
    body = (
      <p data-testid="answer-status" className="font-medium text-rose-300">
        {error}
      </p>
    );
  } else if (answer) {
    tone = found ? "success" : "empty";
    body = (
      <>
        {question ? (
          <p className="mb-3 text-sm text-slate-400">You asked: {question}</p>
        ) : null}
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          {found ? "Verified answer" : "No match"}
        </h2>
        <p data-testid="answer-status" className="mt-2 text-lg leading-relaxed text-slate-100">
          {answer}
        </p>
      </>
    );
  } else {
    body = (
      <p data-testid="answer-status" className="text-slate-400">
        Ask a question or pick a sample case to see an answer.
      </p>
    );
  }

  const toneClass = {
    idle: "border-white/10",
    loading: "border-amber-400/30",
    success: "border-emerald-400/40",
    empty: "border-amber-400/40",
    error: "border-rose-400/40",
  }[tone];

  return (
    <section
      data-testid="answer-box"
      className={`min-h-[140px] rounded-2xl border bg-slate-900/80 p-6 shadow-inner ${toneClass}`}
    >
      {body}
    </section>
  );
};

export default AnswerBox;
