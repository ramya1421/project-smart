import React, { useState } from "react";
import SearchBar from "./components/SearchBar";

function App() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (question) => {
    setLoading(true);
    setAnswer(""); // reset
    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("❌ Error connecting to backend");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Smart FAQ Assistant
      </h1>

      <SearchBar onSearch={handleSearch} />

      <div className="mt-6 w-full max-w-xl">
        {loading ? (
          <p className="text-gray-600 text-center animate-pulse">
            ⏳ Searching...
          </p>
        ) : answer ? (
          <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">Answer:</h2>
            <p className="mt-2 text-gray-700">{answer}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            Type a question above to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
