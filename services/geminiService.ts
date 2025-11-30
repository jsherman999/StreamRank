import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { StreamingService, ShowData } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Cache interface
interface CacheEntry {
  data: ShowData[];
  timestamp: number;
}

// Cache store (24 hour expiry)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const cache = new Map<string, CacheEntry>();

// Helper to check if cache is valid
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_DURATION;
};

// Helper to get from cache
const getFromCache = (key: string): ShowData[] | null => {
  const entry = cache.get(key);
  if (entry && isCacheValid(entry)) {
    console.log(`Cache hit for: ${key}`);
    return entry.data;
  }
  if (entry) {
    cache.delete(key); // Remove expired entry
  }
  return null;
};

// Helper to save to cache
const saveToCache = (key: string, data: ShowData[]): void => {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`Cached data for: ${key}`);
};

const SYSTEM_INSTRUCTION = `
You are a specialized streaming content assistant. 
Your goal is to find content on a specific streaming service using the provided tools.
You must prioritize accurate availability on the requested service and valid Rotten Tomatoes scores.
`;

// Helper to parse JSON from potentially messy AI output
const parseGeminiResponse = (text: string | undefined): any => {
    if (!text) {
      throw new Error("No data received from AI. The model response was empty.");
    }

    let cleanJson = text.trim();

    // Strategy 1: Look for markdown code blocks (most reliable)
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = cleanJson.match(jsonBlockRegex);
    
    if (match && match[1]) {
        cleanJson = match[1].trim();
    } else {
        // Strategy 2: Look for the first '[' and last ']'
        const firstBracket = cleanJson.indexOf('[');
        const lastBracket = cleanJson.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
        }
    }

    try {
        const parsed = JSON.parse(cleanJson);
        if (!Array.isArray(parsed)) {
            // Handle { "shows": [...] } wrapper
            const values = Object.values(parsed);
            const foundArray = values.find(v => Array.isArray(v));
            if (foundArray) {
                return foundArray;
            }
            throw new Error("Response JSON was not an array.");
        }
        return parsed;
    } catch (e) {
        console.error("Failed to parse JSON. Raw text snippet:", cleanJson.substring(0, 100) + "...");
        throw new Error("Invalid JSON received from AI model.");
    }
};

// Helper to map raw data to ShowData type
const mapToShowData = (parsedData: any[], service: StreamingService): ShowData[] => {
    return parsedData.map((item: any, index: number) => ({
      id: `${service}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: item.title ? String(item.title) : "Unknown Title",
      year: item.year ? String(item.year) : "N/A",
      criticScore: typeof item.criticScore === 'number' ? item.criticScore : null,
      audienceScore: typeof item.audienceScore === 'number' ? item.audienceScore : null,
      summary: item.summary || "No summary available.",
      serviceLink: item.serviceLink || null,
      rtLink: item.rtLink || null,
      genre: item.genre || "N/A"
    }));
};

const commonConfig = {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ googleSearch: {} }],
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ]
};

export const fetchShows = async (service: StreamingService): Promise<ShowData[]> => {
  const cacheKey = `trending-${service}`;
  
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = `
    Find 30 currently trending or highly-rated TV shows or movies available on ${service}.
    
    Step 1: Use the search tool to verify availability and get current Rotten Tomatoes scores.
    Step 2: Write a brief summary of what you found.
    Step 3: Output the data in a strict JSON array format inside a markdown code block.

    For each item, include:
    - title
    - criticScore (number 0-100)
    - audienceScore (number 0-100)
    - year
    - summary (one sentence)
    - serviceLink (URL to watch on ${service})
    - rtLink (URL to Rotten Tomatoes)
    - genre

    Example format:
    Here are the shows I found... [Summary text]...
    \`\`\`json
    [
      { "title": "Show Name", "criticScore": 95, ... }
    ]
    \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: commonConfig,
    });

    const parsedData = parseGeminiResponse(response.text);
    const data = mapToShowData(parsedData, service);
    
    // Cache the results
    saveToCache(cacheKey, data);
    
    return data;

  } catch (error: any) {
    console.error("Gemini API Error (Trending):", error);
    // Provide more context about the error
    if (error?.message?.includes('timeout') || error?.message?.includes('DEADLINE_EXCEEDED')) {
      throw new Error(`Request timed out for ${service}. The service may be experiencing high load. Please try again.`);
    }
    throw new Error(`Could not fetch ${service} data. Please try again later.`);
  }
};

export const searchShows = async (service: StreamingService, query: string): Promise<ShowData[]> => {
  const cacheKey = `search-${service}-${query.toLowerCase().trim()}`;
  
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = `
    Search for "${query}" on ${service}. Find up to 30 matches.
    If exact matches aren't found, list best available alternatives on ${service}.

    Step 1: Search for the titles and their scores.
    Step 2: Briefly summarize your findings.
    Step 3: Output the data in a strict JSON array format inside a markdown code block.

    Required fields per item: title, criticScore, audienceScore, year, summary, serviceLink, rtLink, genre.

    Example format:
    Found these results...
    \`\`\`json
    [
      { "title": "Matrix", ... }
    ]
    \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: commonConfig,
    });

    const parsedData = parseGeminiResponse(response.text);
    const data = mapToShowData(parsedData, service);
    
    // Cache the search results
    saveToCache(cacheKey, data);
    
    return data;

  } catch (error) {
    console.error("Gemini API Error (Search):", error);
    throw new Error(`Could not search for "${query}" on ${service}. Please try again.`);
  }
};

// New function: Search across all streaming services
export const searchAllServices = async (query: string): Promise<ShowData[]> => {
  const cacheKey = `search-all-${query.toLowerCase().trim()}`;
  
  // Check cache first
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const prompt = `
    Search for "${query}" across ALL major streaming services (Netflix, HBO Max, Apple TV+, Disney+, Hulu, Prime Video).
    Find up to 30 matches total, distributed across all services where available.
    Include which service each title is available on.
    
    Step 1: Use the search tool to find titles matching "${query}" on multiple streaming platforms.
    Step 2: Briefly summarize your findings.
    Step 3: Output the data in a strict JSON array format inside a markdown code block.

    For each item, include:
    - title
    - criticScore (number 0-100)
    - audienceScore (number 0-100)
    - year
    - summary (one sentence)
    - serviceLink (URL to watch - use the actual streaming service URL)
    - rtLink (URL to Rotten Tomatoes)
    - genre
    - service (which streaming service: Netflix, HBO Max, Apple TV+, Disney+, Hulu, or Prime Video)

    Example format:
    Here are the matches I found across services...
    \`\`\`json
    [
      { "title": "Show Name", "service": "Netflix", "criticScore": 95, ... }
    ]
    \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: commonConfig,
    });

    const parsedData = parseGeminiResponse(response.text);
    const data = parsedData.map((item: any, index: number) => ({
      id: `all-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: item.title ? String(item.title) : "Unknown Title",
      year: item.year ? String(item.year) : "N/A",
      criticScore: typeof item.criticScore === 'number' ? item.criticScore : null,
      audienceScore: typeof item.audienceScore === 'number' ? item.audienceScore : null,
      summary: item.summary || "No summary available.",
      serviceLink: item.serviceLink || null,
      rtLink: item.rtLink || null,
      genre: item.genre || "N/A",
      service: item.service || "Multiple Services"
    }));
    
    // Cache the results
    saveToCache(cacheKey, data);
    
    return data;

  } catch (error) {
    console.error("Gemini API Error (Search All):", error);
    throw new Error(`Could not search for "${query}" across services. Please try again.`);
  }
};
