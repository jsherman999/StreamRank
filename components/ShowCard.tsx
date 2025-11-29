import React from 'react';
import { ShowData, SortOption } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { ExternalLink, PlayCircle } from 'lucide-react';

interface ShowCardProps {
  show: ShowData;
  sortOption: SortOption;
  rank: number;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, sortOption, rank }) => {
  // Generate a consistent placeholder image based on title and year to ensure uniqueness and consistency.
  // We strip special characters to create a clean seed for Picsum.
  // Defensive coding: Ensure properties are strings before calling replace
  const titleStr = show.title ? String(show.title) : "Unknown";
  const yearStr = show.year ? String(show.year) : "";

  const cleanTitle = titleStr.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const cleanYear = yearStr.replace(/[^0-9]/g, '');
  const seed = `${cleanTitle}-${cleanYear}`;
  const imageUrl = `https://picsum.photos/seed/${seed}/400/600`;

  return (
    <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-1 flex flex-col h-full">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center bg-slate-950/80 backdrop-blur rounded-full border border-slate-700 text-white font-bold text-sm shadow-lg">
        #{rank}
      </div>

      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        <img 
          src={imageUrl} 
          alt={show.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {show.serviceLink && (
            <a 
              href={show.serviceLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="transform scale-90 group-hover:scale-100 transition-transform duration-300 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-500"
            >
              <PlayCircle size={32} fill="currentColor" />
            </a>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
           <div className="text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">{show.genre} • {show.year}</div>
           <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{show.title}</h3>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow gap-4">
        <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${sortOption === SortOption.CRITIC_SCORE ? 'scale-110 origin-left' : 'opacity-70'}`}>
                <span className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Tomatometer</span>
                <ScoreBadge score={show.criticScore} type="critic" />
            </div>
            <div className={`w-px h-8 bg-slate-800 mx-2`}></div>
            <div className={`flex flex-col items-center ${sortOption === SortOption.AUDIENCE_SCORE ? 'scale-110 origin-right' : 'opacity-70'}`}>
                <span className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">Audience</span>
                <ScoreBadge score={show.audienceScore} type="audience" />
            </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 flex-grow border-t border-slate-800/50 pt-3">
          {show.summary}
        </p>

        <div className="flex gap-2 mt-auto pt-2">
            {show.serviceLink ? (
                <a 
                    href={show.serviceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 text-xs font-bold py-2 rounded-lg hover:bg-white transition-colors"
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
                >
                    <ExternalLink size={16} />
                </a>
            )}
        </div>
      </div>
    </div>
  );
};