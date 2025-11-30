import { StreamingService, ServiceConfig } from './types';

export const DEFAULT_SERVICE = StreamingService.NETFLIX;

export const SERVICES: ServiceConfig[] = [
  { 
    id: StreamingService.NETFLIX, 
    name: 'Netflix', 
    color: 'from-red-600 to-red-900',
    icon: 'N' 
  },
  { 
    id: StreamingService.HBO_MAX, 
    name: 'HBO Max', 
    color: 'from-blue-600 to-purple-900',
    icon: 'HBO'
  },
  { 
    id: StreamingService.APPLE_TV, 
    name: 'Apple TV+', 
    color: 'from-slate-700 to-black',
    icon: ''
  },
  { 
    id: StreamingService.DISNEY_PLUS, 
    name: 'Disney+', 
    color: 'from-blue-500 to-blue-900',
    icon: 'D+'
  },
  { 
    id: StreamingService.HULU, 
    name: 'Hulu', 
    color: 'from-green-500 to-green-900',
    icon: 'H'
  },
  { 
    id: StreamingService.PRIME_VIDEO, 
    name: 'Prime', 
    color: 'from-sky-500 to-blue-800',
    icon: 'P'
  },
  { 
    id: StreamingService.ALL_SERVICES, 
    name: 'All Services', 
    color: 'from-violet-600 to-fuchsia-900',
    icon: '⊛' 
  },
];
