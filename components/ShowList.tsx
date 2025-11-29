import React from 'react';
import { ShowData, SortOption } from '../types';
import { ShowCard } from './ShowCard';

interface ShowListProps {
  shows: ShowData[];
  sortOption: SortOption;
}

export const ShowList: React.FC<ShowListProps> = ({ shows, sortOption }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {shows.map((show, index) => (
        <ShowCard 
          key={show.id} 
          show={show} 
          sortOption={sortOption} 
          rank={index + 1}
        />
      ))}
    </div>
  );
};