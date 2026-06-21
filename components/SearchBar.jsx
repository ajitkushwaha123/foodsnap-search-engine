"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['searchFood', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return { data: [] };
      const res = await axios.get(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      return res.data;
    },
    enabled: debouncedQuery.length > 0,
    retry: false
  });

  const results = data?.data || [];

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 backdrop-blur-md text-lg"
          placeholder="Search for Kadai Paneer, spicy biryani, combos..."
        />
        {isLoading && query.length > 0 && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <svg className="w-5 h-5 animate-spin text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
          {isLoading && !results.length && (
            <div className="p-4 flex flex-col gap-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex gap-3 animate-pulse">
                   <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                   <div className="flex-1 space-y-2 py-1">
                     <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                     <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                   </div>
                 </div>
               ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-6 text-center text-red-500 text-sm font-medium bg-red-50 dark:bg-red-500/10">
              Atlas Search index missing or connection failed. Please ensure the index is configured in MongoDB Atlas.
            </div>
          )}

          {!isLoading && !isError && results.length === 0 && debouncedQuery && (
            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              No exact or fuzzy matches found for "{debouncedQuery}".
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto p-2">
              {results.map((item) => (
                <li key={item._id} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors flex gap-4 items-center group">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-md object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {item.enrichment?.normalized_name && item.enrichment.normalized_name !== item.title && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          AKA: {item.enrichment.normalized_name}
                        </span>
                      )}
                      {item.is_combo && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 rounded border border-indigo-200 dark:border-indigo-500/30">
                          Combo Meal
                        </span>
                      )}
                      {item.score && (
                        <span className="text-[10px] text-zinc-400 ml-auto font-mono">
                          Score: {item.score.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 -z-10 bg-transparent" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
