import React from 'react';

interface ScoreBadgeProps {
  score: number | null;
  type: 'critic' | 'audience';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, type }) => {
  if (score === null) {
    return (
      <div className="flex items-center gap-1 opacity-50" title={`No ${type} score`}>
        <span className="text-xs text-slate-400 font-medium">N/A</span>
      </div>
    );
  }

  // Rotten Tomatoes Logic approx
  const isFresh = score >= 60;
  
  let icon = '';
  if (type === 'critic') {
    icon = isFresh ? '🍅' : '🦠';
  } else {
    icon = isFresh ? '🍿' : '🥤';
  }

  const scoreColor = isFresh ? 'text-red-500' : 'text-green-500'; // RT colors: Fresh is Red (good), Rotten is Green splat (bad) - Wait, RT uses Red Fresh, Green Splat. Popcorn is Red (full) Green (spilled).
  // Actually, let's keep it simple with standard colors to avoid confusion if we get the icon wrong.
  // High score = Green/Red brand colors? Let's use Tailwind colors indicating 'good' vs 'bad' generally.
  
  const visualColor = score >= 60 ? 'text-red-500' : 'text-green-600'; // RT branding: Fresh(Red), Rotten(Green)

  return (
    <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
      <span className="text-sm leading-none">{icon}</span>
      <span className={`text-sm font-bold ${visualColor}`}>
        {score}%
      </span>
    </div>
  );
};