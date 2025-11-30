import React from 'react';
import { ShowData, SortOption } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ExternalLink, PlayCircle, X } from 'lucide-react';

interface ShowModalProps {
  show: ShowData;
  sortOption: SortOption;
  rank: number;
  onClose: () => void;
}

export const ShowModal: React.FC<ShowModalProps> = ({ show, sortOption, rank, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-slate-950 backdrop-blur rounded-full border border-slate-700 text-white font-bold text-sm shadow-lg">
              #{rank}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{show.title}</h2>
              <div className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                {show.genre} • {show.year}
                {show.service && <span className="ml-2 text-violet-400">• Streaming on {show.service}</span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Scores */}
          <div className="flex gap-6 justify-center">
            <div className={`flex flex-col items-center ${sortOption === SortOption.CRITIC_SCORE ? '' : 'opacity-70'}`}>
              <span className="text-xs uppercase text-slate-500 font-bold mb-2">Critics Score</span>
              <ScoreBadge score={show.criticScore} type="critic" />
            </div>
            <div className="w-px bg-slate-800"></div>
            <div className={`flex flex-col items-center ${sortOption === SortOption.AUDIENCE_SCORE ? '' : 'opacity-70'}`}>
              <span className="text-xs uppercase text-slate-500 font-bold mb-2">Audience Score</span>
              <ScoreBadge score={show.audienceScore} type="audience" />
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Summary</h3>
            <p className="text-base text-slate-300 leading-relaxed">
              {show.summary}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-slate-800 pt-6">
            {show.serviceLink ? (
              <a 
                href={show.serviceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white text-sm font-bold py-3 rounded-lg hover:bg-red-500 transition-colors"
              >
                <PlayCircle size={18} /> Watch Now{show.service && ` on ${show.service}`}
              </a>
            ) : (
              <span className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-slate-500 text-sm font-bold py-3 rounded-lg cursor-not-allowed">
                Not Available
              </span>
            )}
            
            {show.rtLink && (
              <a 
                href={show.rtLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 flex items-center justify-center gap-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                title="View on Rotten Tomatoes"
              >
                <ExternalLink size={18} /> Rotten Tomatoes
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
