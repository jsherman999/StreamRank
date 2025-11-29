import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 text-center max-w-md mx-auto">
      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
      <p className="text-red-200/80 mb-6 text-sm">{message}</p>
      <button 
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
};