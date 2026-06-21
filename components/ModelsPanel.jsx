"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

function ModelCard({ endpoint }) {
  const { data: metricsData, isLoading, isError } = useQuery({
    queryKey: ['modelMetrics', endpoint.name],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.SAGEMAKER_MODEL_METRICS(endpoint.name));
      return res.data;
    },
    enabled: !!endpoint.name,
    refetchInterval: 15000, 
  });

  const totalInvocations = metricsData?.Datapoints?.reduce((acc, pt) => acc + (pt.Sum || 0), 0) || 0;
  
  const HOURLY_UPTIME_COST = endpoint.status === 'InService' ? 1.20 : 0;
  const INVOCATION_COST = totalInvocations * 0.005;
  const estimatedCost = HOURLY_UPTIME_COST + INVOCATION_COST;

  return (
    <div className="bg-white dark:bg-zinc-900/60 p-6 rounded-md border border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-5 shadow-sm hover:border-green-500/40 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div>
          <h4 className="font-bold text-xl text-zinc-900 dark:text-white break-all pr-4 tracking-tight">{endpoint.name}</h4>
          <p className="text-xs text-zinc-500 mt-1 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(endpoint.createdAt).toLocaleString(undefined, {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <StatusBadge status={endpoint.status} />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 text-zinc-500 py-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800/50">
          <svg className="w-5 h-5 animate-spin text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span className="text-sm font-medium tracking-wide animate-pulse">Calculating Live Metrics...</span>
        </div>
      ) : isError ? (
        <div className="text-red-500 text-sm py-6 text-center font-medium bg-red-50 dark:bg-red-500/10 rounded-md border border-red-100 dark:border-red-500/20">
          Unable to synchronize CloudWatch metrics.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div className="flex flex-col bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-md border border-zinc-100 dark:border-zinc-700/50 group hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Invocations (1H)
            </span>
            <span className="text-3xl font-black text-zinc-800 dark:text-zinc-200 tracking-tight">{totalInvocations.toLocaleString()}</span>
          </div>
          <div className="flex flex-col bg-green-50/80 dark:bg-green-500/10 p-4 rounded-md border border-green-200 dark:border-green-500/20 group hover:border-green-300 dark:hover:border-green-400/40 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            </div>
            <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-green-700 dark:text-green-400 mb-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Burn Rate / Hour
            </span>
            <span className="relative z-10 text-3xl font-black text-green-700 dark:text-green-400 tracking-tight">${estimatedCost.toFixed(3)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ModelsPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sagemakerModelsList'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.SAGEMAKER_MODELS);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col justify-center items-center gap-4 bg-white/50 dark:bg-zinc-900/20 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
        <div className="animate-pulse flex items-center gap-2 text-green-500">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-widest uppercase">Connecting to SageMaker...</span>
      </div>
    );
  }

  if (isError || !data?.endpoints) {
    return (
      <div className="w-full p-8 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-center font-medium shadow-sm">
        Failed to load active model endpoints. Please check AWS connectivity.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-left bg-zinc-50/50 dark:bg-zinc-900/10 rounded-xl p-0 lg:p-4 border border-transparent dark:border-zinc-800/30">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5 px-2">
        <div className="p-2.5 bg-green-100 dark:bg-green-500/20 rounded-md shadow-sm border border-green-200 dark:border-green-500/20">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Usage & Cost Economics</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Real-time metrics and estimated pricing over the last hour</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.endpoints.length === 0 && (
          <div className="col-span-1 md:col-span-2 p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
            <p className="text-zinc-500 font-medium">No active endpoints to estimate costs for.</p>
          </div>
        )}
        {data.endpoints.map((endpoint, idx) => (
          <ModelCard key={idx} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
}
