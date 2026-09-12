import React, { useState } from "react";

const SearchBar = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
    >
      <label htmlFor="faq-search" className="sr-only">
        Ask a question
      </label>
      <input
        id="faq-search"
        data-testid="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about floods, shelters, kits, or account access..."
        className="min-w-0 flex-1 bg-transparent px-4 py-4 text-slate-100 placeholder:text-slate-400 outline-none"
      />
      <button
        type="submit"
        data-testid="search-submit"
        disabled={loading || !query.trim()}
        className="bg-amber-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
      >
        {loading ? "Searching" : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
