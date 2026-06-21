"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await axios.post('/api/auth', { password });
      router.push('/');
      router.refresh(); // Ensure layout respects the new cookie immediately
    } catch (err) {
      setError(true);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a] text-black dark:text-white font-sans overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-green-500/10 via-emerald-600/5 to-transparent blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md px-8 py-12 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20 mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 mb-2">
          Nexus Locked
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-8 text-center">
          Enter the master password to access your SageMaker controls and architecture.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(error) setError(false);
              }}
              className={`w-full px-5 py-4 text-center text-lg font-bold tracking-widest bg-zinc-100 dark:bg-black/50 border ${error ? 'border-red-500/50 shadow-red-500/10 animate-shake' : 'border-zinc-200 dark:border-zinc-800'} rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all`}
              placeholder="••••••••"
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-center text-xs font-bold text-red-500">
                Incorrect password.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-4 px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-green-900/20 dark:hover:shadow-green-500/20"
          >
            {loading ? "Verifying..." : "Unlock System"}
          </button>
        </form>
      </div>
      
      {error && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }
        `}} />
      )}
    </div>
  );
}
