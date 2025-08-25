import React from "react";

const AnswerBox = ({ answer, loading, error }) => {
  return (
    <div className="mt-6 p-6 w-full max-w-xl bg-gray-50 border rounded-xl shadow-inner min-h-[100px]">
      {loading ? (
        <p className="text-gray-500 animate-pulse">🤔 Thinking...</p>
      ) : error ? (
        <p className="text-red-500 font-medium">{error}</p>
      ) : answer ? (
        <p className="text-gray-800 leading-relaxed">{answer}</p>
      ) : (
        <p className="text-gray-400">❓ Ask something to see an answer...</p>
      )}
    </div>
  );
};

export default AnswerBox;
