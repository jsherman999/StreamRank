import React, { useState, useEffect, useCallback } from 'react';
import { StreamingService, SortOption, ShowData } from './types';
import { fetchShows, searchShows, searchAllServices, addDebugListener, removeDebugListener } from './services/geminiService';
import { Header } from './components/Header';
import { ServiceTabs } from './components/ServiceTabs';
import { ShowList } from './components/ShowList';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { SortControls } from './components/SortControls';
import { SearchBar } from './components/SearchBar';
import { DebugWindow, DebugLog } from './components/DebugWindow';
import { DEFAULT_SERVICE } from './constants';

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<StreamingService>(DEFAULT_SERVICE);
  const [shows, setShows] = useState<ShowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.CRITIC_SCORE);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);

  // Setup debug listener
  useEffect(() => {
    const listener = (type: 'request' | 'response' | 'error' | 'cache', message: string) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setDebugLogs(prev => {
        const newLogs = [...prev, { timestamp, type, message }];
        // Keep only last 1000 entries
        return newLogs.slice(-1000);
      });
    };
    
    addDebugListener(listener);
    return () => removeDebugListener(listener);
  }, []);

  const loadData = useCallback(async (service: StreamingService, query?: string) => {
    setLoading(true);
    setError(null);
    setShows([]); 
    
    try {
      let data: ShowData[];
      if (query && query.trim().length > 0) {
        setIsSearching(true);
        if (service === StreamingService.ALL_SERVICES) {
          data = await searchAllServices(query);
        } else {
          data = await searchShows(service, query);
        }
      } else {
        setIsSearching(false);
        if (service === StreamingService.ALL_SERVICES) {
          // For "All Services" without search, aggregate trending from all services
          const allServices = [
            StreamingService.NETFLIX,
            StreamingService.HBO_MAX,
            StreamingService.APPLE_TV,
            StreamingService.DISNEY_PLUS,
            StreamingService.HULU,
            StreamingService.PRIME_VIDEO
          ];
          
          // Fetch from each service and add service field to each show
          const results = await Promise.allSettled(
            allServices.map(s => fetchShows(s))
          );
          
          data = results
            .map((result, index) => {
              if (result.status === 'fulfilled') {
                // Add service field to each show
                return result.value.map(show => ({
                  ...show,
                  service: allServices[index]
                }));
              }
              console.warn(`Failed to fetch from ${allServices[index]}:`, result.reason);
              return [];
            })
            .flat();
            
          if (data.length === 0) {
            throw new Error('Could not load content from any streaming service. Please try again.');
          }
        } else {
          data = await fetchShows(service);
        }
      }
      setShows(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Only load initial trending if we aren't maintaining a search state across services
    // If user switches service, we usually want to reset search unless we want to "Search Matrix on Hulu" after "Search Matrix on Netflix"
    // Let's reset search on service change for cleaner UX
    setSearchQuery('');
    loadData(selectedService);
  }, [selectedService, loadData]);

  const handleServiceChange = (service: StreamingService) => {
    if (service === selectedService) return;
    setSelectedService(service);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadData(selectedService, query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadData(selectedService, '');
  };

  const handleRetry = () => {
    loadData(selectedService, searchQuery);
  };

  const sortedShows = React.useMemo(() => {
    return [...shows].sort((a, b) => {
      const scoreA = sortOption === SortOption.CRITIC_SCORE ? (a.criticScore || 0) : (a.audienceScore || 0);
      const scoreB = sortOption === SortOption.CRITIC_SCORE ? (b.criticScore || 0) : (b.audienceScore || 0);
      return scoreB - scoreA; // Descending
    });
  }, [shows, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
              {isSearching ? 'Deep Catalog Search' : "What's Streaming Now?"}
            </h2>
            <p className="text-slate-400 text-lg">
              {isSearching 
                ? `Searching specifically on ${selectedService}` 
                : "Top rated shows on your favorite platforms, ranked by Rotten Tomatoes."}
            </p>
          </div>

          <ServiceTabs 
            selectedService={selectedService} 
            onSelect={handleServiceChange} 
            disabled={loading}
          />

          <SearchBar 
            onSearch={handleSearch} 
            onClear={handleClearSearch}
            serviceName={selectedService}
            disabled={loading}
            initialQuery={searchQuery}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-4 gap-4">
             <div className="text-sm font-medium text-slate-400">
                {loading 
                  ? 'Searching...' 
                  : isSearching 
                    ? `Found ${shows.length} results for "${searchQuery}"`
                    : `Trending Now (${shows.length} shows)`
                }
             </div>
             <SortControls currentSort={sortOption} onSortChange={setSortOption} disabled={loading || shows.length === 0} />
          </div>
        </div>

        {error && (
          <div className="my-12">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {loading && (
          <div className="my-20">
            <Loader serviceName={selectedService} />
          </div>
        )}

        {!loading && !error && (
          <ShowList shows={sortedShows} sortOption={sortOption} />
        )}
        
        {!loading && !error && shows.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-500 text-lg mb-2">No results found.</p>
            <p className="text-slate-600 text-sm">Try adjusting your search terms or switch to another service.</p>
            {isSearching && (
               <button onClick={handleClearSearch} className="mt-4 text-red-500 hover:text-red-400 text-sm font-medium underline">
                  Back to Trending
               </button>
            )}
          </div>
        )}
      </main>

      <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm bg-slate-950">
        <p>
          Data sourced via AI search grounding. Rotten Tomatoes scores are approximations based on search results.
          <br />
          iRankThee &copy; {new Date().getFullYear()}
        </p>
      </footer>
      
      <DebugWindow logs={debugLogs} />
    </div>
  );
};

export default App;