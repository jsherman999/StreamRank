import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  initialQuery?: string;
  disabled?: boolean;
  serviceName: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onClear, 
  initialQuery = '', 
  disabled,
  serviceName 
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors ${disabled ? 'text-slate-600' : 'text-slate-400 group-focus-within:text-red-500'}`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder={`Search ${serviceName} library...`}
          className="block w-full pl-11 pr-12 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl 
                     text-white placeholder-slate-500 shadow-lg backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />

        {query && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-14 flex items-center pr-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className="absolute right-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium
                     hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:hover:bg-slate-800 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
};