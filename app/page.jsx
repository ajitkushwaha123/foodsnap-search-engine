"use client"
import { Header } from "@/components/Header";
import { InfoPanel } from "@/components/InfoPanel";
import { ModelsPanel } from "@/components/ModelsPanel";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-green-500/30 font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-green-500/10 via-emerald-600/5 to-transparent blur-[140px] rounded-full pointer-events-none z-0"></div>
        <div className="max-w-6xl w-full relative z-10 space-y-16 pb-16">
          <section className="text-center space-y-8 pt-8 pb-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-md bg-green-50/80 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold tracking-wide uppercase mb-2 ring-1 ring-green-500/20 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Online
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
              Nexus Architecture
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Seamlessly monitor and orchestrate your SageMaker instances. Access real-time endpoint metrics, visualize cost projections, and govern your machine learning infrastructure.
            </p>
            <div className="mt-8 pt-4">
               <SearchBar />
            </div>
          </section>

          <div className="space-y-16">
            <InfoPanel />
            <ModelsPanel />
          </div>

        </div>
      </main>
    </div>
  );
}
