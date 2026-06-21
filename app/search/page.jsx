"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Header } from "@/components/Header";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['fullSearch', debouncedQuery, page],
    queryFn: async () => {
      if (!debouncedQuery) return { data: [] };
      const res = await axios.get(`/api/search?q=${encodeURIComponent(debouncedQuery)}&page=${page}&limit=${limit}`);
      return res.data;
    },
    enabled: debouncedQuery.length > 0,
    retry: false
  });

  const results = data?.data || [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-green-500/30 font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col p-6 md:p-12 relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-green-500/10 via-emerald-600/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
            Image Explorer
          </h2>
          
          <div className="w-full max-w-3xl mb-12 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-zinc-400 focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-4 py-5 text-lg bg-white/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 backdrop-blur-md"
              placeholder="Search images, cuisines, ingredients, or dietary tags..."
            />
            {isLoading && query.length > 0 && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg className="w-6 h-6 animate-spin text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
          </div>

          {!isLoading && isError && (
             <div className="p-6 text-center text-red-500 font-medium bg-red-50 dark:bg-red-500/10 rounded-xl w-full max-w-3xl">
              Atlas Search index missing or connection failed. Please ensure the index is configured in MongoDB Atlas.
            </div>
          )}

          {!isLoading && !isError && results.length === 0 && debouncedQuery && (
             <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-lg font-medium w-full max-w-3xl">
              No results found for "{debouncedQuery}". Try a broader term.
            </div>
          )}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((item) => (
              <div key={item._id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="w-full h-56 bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <svg className="w-12 h-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="w-full flex items-center justify-center gap-6 mt-12 mb-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="px-6 py-2.5 rounded-lg font-bold text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                Page {page}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={results.length < limit || isFetching}
                className="px-6 py-2.5 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-500/20"
              >
                Next Page
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
