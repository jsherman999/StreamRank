import React, { useState } from 'react';
import { ShowData, SortOption } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { ShowModal } from './ShowModal';

interface ShowCardProps {
  show: ShowData;
  sortOption: SortOption;
  rank: number;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, sortOption, rank }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1 flex flex-col cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
      {/* Rank Badge with Title */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-slate-950/80 backdrop-blur rounded-full border border-slate-700 text-white font-bold text-sm shadow-lg">
          #{rank}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 pt-12">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
        
        <div className="relative z-10">
           <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-2">{show.title}</h3>
           <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
             {show.genre} • {show.year}
           </div>
           {show.service && (
             <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mt-2">
               ▶ Streaming on {show.service}
             </div>
           )}
        </div>
      </div>

      <div className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex gap-3 items-center">
            <div className={`flex items-center gap-1 ${sortOption === SortOption.CRITIC_SCORE ? '' : 'opacity-60'}`}>
                <span className="text-[9px] uppercase text-slate-500 font-bold">Critics</span>
                <ScoreBadge score={show.criticScore} type="critic" />
            </div>
            <div className={`flex items-center gap-1 ${sortOption === SortOption.AUDIENCE_SCORE ? '' : 'opacity-60'}`}>
                <span className="text-[9px] uppercase text-slate-500 font-bold">Audience</span>
                <ScoreBadge score={show.audienceScore} type="audience" />
            </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2">
          {show.summary}
        </p>

        <div className="flex gap-2">
            {show.serviceLink ? (
                <a 
                    href={show.serviceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 text-xs font-bold py-2 rounded-lg hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <PlayCircle size={14} /> Watch Now
                </a>
            ) : (
                <span className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-slate-500 text-xs font-bold py-2 rounded-lg cursor-not-allowed">
                    Not Available
                </span>
            )}
            
            {show.rtLink && (
                <a 
                    href={show.rtLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 flex items-center justify-center bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="View on Rotten Tomatoes"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink size={16} />
                </a>
            )}
        </div>
      </div>
    </div>

      {isModalOpen && (
        <ShowModal 
          show={show} 
          sortOption={sortOption} 
          rank={rank} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};