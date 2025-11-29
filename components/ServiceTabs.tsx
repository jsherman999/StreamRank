import React from 'react';
import { StreamingService } from '../types';
import { SERVICES } from '../constants';

interface ServiceTabsProps {
  selectedService: StreamingService;
  onSelect: (service: StreamingService) => void;
  disabled: boolean;
}

export const ServiceTabs: React.FC<ServiceTabsProps> = ({ selectedService, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {SERVICES.map((service) => {
        const isSelected = selectedService === service.id;
        
        return (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            disabled={disabled}
            className={`
              relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}
              ${isSelected 
                ? `bg-gradient-to-br ${service.color} text-white shadow-lg ring-1 ring-white/20` 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}
            `}
          >
            <span className={`text-lg ${isSelected ? 'opacity-100' : 'opacity-70'}`}>
              {service.icon}
            </span>
            <span>{service.name}</span>
            {isSelected && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};