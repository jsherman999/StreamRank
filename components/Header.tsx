import React from 'react';
import { Tv, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 rounded-full p-2 border border-slate-700">
              <Tv className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            StreamRank<span className="text-red-500">.AI</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-slate-400">
          <Sparkles className="w-3 h-3 text-yellow-500" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};