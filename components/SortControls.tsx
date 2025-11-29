import React from 'react';
import { SortOption } from '../types';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
  disabled: boolean;
}

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange, disabled }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
      <span className="text-xs text-slate-500 px-2 font-medium hidden sm:inline">Sort by:</span>
      {(Object.values(SortOption) as SortOption[]).map((option) => (
        <button
          key={option}
          onClick={() => onSortChange(option)}
          disabled={disabled}
          className={`
            px-3 py-1.5 text-xs font-semibold rounded-md transition-all
            ${currentSort === option 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};