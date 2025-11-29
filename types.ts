export enum StreamingService {
  NETFLIX = 'Netflix',
  HBO_MAX = 'Max',
  APPLE_TV = 'Apple TV+',
  DISNEY_PLUS = 'Disney+',
  HULU = 'Hulu',
  PRIME_VIDEO = 'Prime Video',
}

export enum SortOption {
  CRITIC_SCORE = 'Critic Score',
  AUDIENCE_SCORE = 'Audience Score',
}

export interface ShowData {
  id: string;
  title: string;
  year: string;
  criticScore: number | null;
  audienceScore: number | null;
  summary: string;
  serviceLink: string | null;
  rtLink: string | null;
  genre: string;
}

export interface ServiceConfig {
  id: StreamingService;
  name: string;
  color: string;
  icon: string; // We'll use lucide-react names or similar identifiers
}