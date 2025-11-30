import React, { useState, useEffect, useRef } from 'react';

export interface DebugLog {
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'cache';
  message: string;
}

interface DebugWindowProps {
  logs: DebugLog[];
}

export const DebugWindow: React.FC<DebugWindowProps> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-500 text-black px-4 py-2 rounded-lg font-mono text-sm font-bold hover:bg-green-400 transition-colors shadow-lg z-50"
      >
        DEBUG
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[600px] h-[400px] bg-black border-2 border-green-500 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-green-500 text-black px-3 py-2">
        <span className="font-mono text-sm font-bold">GEMINI API DEBUG LOG</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }}
            className="px-2 py-1 bg-black text-green-500 rounded text-xs font-mono hover:bg-gray-900"
          >
            ↓ BOTTOM
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 bg-black text-green-500 rounded text-xs font-mono hover:bg-gray-900"
          >
            X
          </button>
        </div>
      </div>

      {/* Log content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 font-mono text-xs text-green-500 leading-relaxed"
        style={{
          fontFamily: 'Monaco, "Courier New", monospace',
          backgroundColor: '#000000'
        }}
      >
        {logs.length === 0 ? (
          <div className="text-green-500/50">Waiting for API calls...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-2 break-words">
              <span className="text-green-400">[{log.timestamp}]</span>{' '}
              <span
                className={
                  log.type === 'request'
                    ? 'text-cyan-400'
                    : log.type === 'response'
                    ? 'text-green-500'
                    : log.type === 'cache'
                    ? 'text-yellow-400'
                    : 'text-red-500'
                }
              >
                [{log.type.toUpperCase()}]
              </span>{' '}
              <span className="text-green-500">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-green-500 text-black px-3 py-1 text-xs font-mono flex justify-between items-center">
        <span>{logs.length} log entries</span>
        <span>Buffer: {logs.length}/1000</span>
      </div>
    </div>
  );
};
