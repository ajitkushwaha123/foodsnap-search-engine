"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { StatusBadge } from "./StatusBadge";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

function SummaryCard({ title, value, iconPath }) {
  return (
    <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-md border border-zinc-200 dark:border-zinc-800/60 shadow-sm flex flex-col gap-3 relative overflow-hidden group hover:border-green-500/30 transition-all">
      <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest relative z-10">{title}</span>
      <span className="text-5xl font-black text-zinc-900 dark:text-white relative z-10 tracking-tight">{value}</span>
    </div>
  );
}

export function InfoPanel() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sagemakerInfo'],
    queryFn: async () => {
      const res = await axios.get(API_ENDPOINTS.SAGEMAKER_INFO);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white/50 dark:bg-zinc-900/20 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
        <svg className="w-8 h-8 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium animate-pulse text-sm uppercase tracking-widest">Loading Architecture...</p>
      </div>
    );
  }

  if (isError || !data || !data.success) {
    return (
      <div className="w-full p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-center font-medium shadow-sm">
        Failed to load architecture data. Please verify your AWS credentials and try again.
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 text-left">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Endpoints" 
          value={data.summary.endpoints} 
          iconPath="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" 
        />
        <SummaryCard 
          title="Active Models" 
          value={data.summary.models} 
          iconPath="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" 
        />
        <SummaryCard 
          title="Endpoint Configs" 
          value={data.summary.endpointConfigs} 
          iconPath="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Endpoints List */}
        <section className="space-y-5 bg-white/50 dark:bg-zinc-900/20 p-6 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Active Endpoints</h3>
          </div>
          
          <div className="space-y-4">
            {data.endpoints.length === 0 && <p className="text-zinc-500 text-sm">No endpoints provisioned.</p>}
            {data.endpoints.map((ep) => (
              <div key={ep.name} className="bg-white dark:bg-zinc-900 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-green-500/40 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{ep.name}</span>
                  {ep.status && <StatusBadge status={ep.status} />}
                </div>
                {ep.error ? (
                  <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-md border border-red-100 dark:border-red-500/20">{ep.error}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Configuration</span>
                      <span className="truncate bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-md font-medium font-mono text-xs border border-zinc-100 dark:border-zinc-700/50" title={ep.config}>{ep.config}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Launch Date</span>
                      <span className="truncate bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-md font-medium text-xs border border-zinc-100 dark:border-zinc-700/50">{ep.createdAt ? formatDate(ep.createdAt) : 'N/A'}</span>
                    </div>
                    {ep.failureReason && (
                      <div className="col-span-1 sm:col-span-2 mt-1 p-3 bg-red-50 dark:bg-red-500/10 rounded-md border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                        <span className="font-bold uppercase tracking-wider block mb-1">Failure Reason</span>
                        <span className="font-mono">{ep.failureReason}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-10">
          {/* Models List */}
          <section className="space-y-5 bg-white/50 dark:bg-zinc-900/20 p-6 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Available Models</h3>
            </div>
            <div className="space-y-3">
              {data.models.length === 0 && <p className="text-zinc-500 text-sm">No models found in registry.</p>}
              {data.models.map((model) => (
                <div key={model.ModelArn} className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 shadow-sm hover:border-green-500/40 transition-colors group">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{model.ModelName}</span>
                  <div className="flex justify-between items-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-md border border-zinc-100 dark:border-zinc-700/50">
                    <span className="truncate max-w-[65%] font-mono" title={model.ModelArn}>{model.ModelArn}</span>
                    <span className="font-medium">{formatDate(model.CreationTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Endpoint Configs List */}
          <section className="space-y-5 bg-white/50 dark:bg-zinc-900/20 p-6 rounded-md border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Endpoint Configurations</h3>
            </div>
            <div className="space-y-3">
              {data.endpointConfigs.length === 0 && <p className="text-zinc-500 text-sm">No configurations found.</p>}
              {data.endpointConfigs.map((config) => (
                <div key={config.EndpointConfigArn} className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 shadow-sm hover:border-green-500/40 transition-colors group">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{config.EndpointConfigName}</span>
                  <div className="flex justify-between items-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-md border border-zinc-100 dark:border-zinc-700/50">
                    <span className="truncate max-w-[65%] font-mono" title={config.EndpointConfigArn}>{config.EndpointConfigArn}</span>
                    <span className="font-medium">{formatDate(config.CreationTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
