"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS, SAGEMAKER_STATUS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

export function Header() {
  const queryClient = useQueryClient();

  const { data: status = "Loading...", isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['sagemakerStatus'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.SAGEMAKER_STATUS);
      return res.data.status;
    },
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(API_ENDPOINTS.SAGEMAKER_START);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sagemakerStatus'] });
      queryClient.invalidateQueries({ queryKey: ['sagemakerInfo'] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(API_ENDPOINTS.SAGEMAKER_STOP);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sagemakerStatus'] });
      queryClient.invalidateQueries({ queryKey: ['sagemakerInfo'] });
    },
  });

  const loading = startMutation.isPending || stopMutation.isPending;
  const displayStatus = isError ? SAGEMAKER_STATUS.ERROR : status;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-black/50 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
          Nexus
        </h1>
        
        <div className="ml-8 hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Dashboard
          </a>
          <a href="/search" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Explore Images
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 bg-zinc-100/50 dark:bg-zinc-900/50 p-1.5 pl-4 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
          <StatusBadge status={displayStatus} />
          <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700"></div>
          <button 
            onClick={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ['sagemakerInfo'] });
            }}
            disabled={isFetching}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-white dark:bg-zinc-800 text-zinc-600 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-400 transition-all hover:shadow-sm disabled:opacity-50"
            title="Refresh Status"
          >
            <svg className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startMutation.mutate()}
            disabled={loading || displayStatus === SAGEMAKER_STATUS.IN_SERVICE || displayStatus === SAGEMAKER_STATUS.CREATING}
            className="relative overflow-hidden group px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-900/10 dark:shadow-green-500/10"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{startMutation.isPending ? "Starting..." : "Start Engine"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={() => stopMutation.mutate()}
            disabled={loading || displayStatus === SAGEMAKER_STATUS.STOPPED || displayStatus === SAGEMAKER_STATUS.DELETING}
            className="px-6 py-2.5 bg-transparent text-red-600 dark:text-red-400 font-semibold rounded-md border border-red-200 dark:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-red-50 dark:hover:bg-red-500/10 hover:scale-[1.02] active:scale-95"
          >
            {stopMutation.isPending ? "Stopping..." : "Stop Engine"}
          </button>
        </div>
      </div>
    </header>
  );
}
