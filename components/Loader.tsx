import React from 'react';

interface LoaderProps {
    serviceName: string;
}

export const Loader: React.FC<LoaderProps> = ({ serviceName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">Scanning {serviceName} Library</h3>
        <p className="text-sm text-slate-400 mt-1">Cross-referencing Rotten Tomatoes scores via Google Search...</p>
      </div>
    </div>
  );
};