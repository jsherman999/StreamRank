import React, { useState, useEffect } from 'react';

interface LoaderProps {
    serviceName: string;
}

export const Loader: React.FC<LoaderProps> = ({ serviceName }) => {
  const [count, setCount] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Simulate counting movies being discovered
    const countInterval = setInterval(() => {
      setCount(prev => {
        if (prev >= 50) return 50;
        // Random increment between 1-3 for more natural feel
        return Math.min(prev + Math.floor(Math.random() * 3) + 1, 50);
      });
    }, 300);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => {
      clearInterval(countInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">Scanning {serviceName} Library</h3>
        <p className="text-sm text-slate-400 mt-1">Cross-referencing Rotten Tomatoes scores via Google Search{dots}</p>
        <div className="mt-3 text-xl font-bold text-red-500">
          {count} movies discovered
        </div>
      </div>
    </div>
  );
};