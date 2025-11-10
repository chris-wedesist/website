import axios from 'axios';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string; // Internal link to our detailed article page
  fullUrl?: string; // Full URL with originalUrl query parameter
  originalUrl?: string; // Original external URL for fetching full content
  imageUrl?: string | null;
  images?: string[];
  source: string;
  date: string;
  author?: string;
  categories?: string[];
}

interface ApiResponse {
  articles: NewsItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    articlesPerPage: number;
    hasMore: boolean;
  };
}

interface NewsResponse {
  articles: NewsItem[];
  hasMore: boolean;
  totalPages: number;
}

// Default images for different types of news
const DEFAULT_IMAGES = {
  incident: '/images/blog/default-incident.jpg',
  community: '/images/blog/default-community.jpg',
  default: '/images/blog/default-news.jpg'
};

// Fallback data for when RSS feeds are not available
const fallbackNews: NewsItem[] = [
  {
    id: "1",
    title: "Community Safety Meeting",
    description: "Join us for our monthly community safety meeting to discuss local concerns and solutions.",
    url: "#",
    imageUrl: DEFAULT_IMAGES.community,
    images: [DEFAULT_IMAGES.community],
    source: "Community News",
    date: new Date().toISOString(),
    author: "Community News"
  },
  {
    id: "2",
    title: "Know Your Rights Workshop",
    description: "Free workshop on understanding your rights and how to protect them in various situations.",
    url: "#",
    imageUrl: DEFAULT_IMAGES.community,
    images: [DEFAULT_IMAGES.community],
    source: "Community Updates",
    date: new Date().toISOString(),
    author: "Community Updates"
  },
  {
    id: "3",
    title: "New Support Network Launches",
    description: "Local organizations come together to create a stronger support network for our community.",
    url: "#",
    imageUrl: DEFAULT_IMAGES.community,
    images: [DEFAULT_IMAGES.community],
    source: "Community Updates",
    date: new Date().toISOString(),
    author: "Community Updates"
  }
];

const PAGE_SIZE = 10; // Match the API's ARTICLES_PER_PAGE

async function fetchFromAPI(page: number = 1): Promise<ApiResponse | null> {
  try {
    console.log(`Fetching news from API for page ${page}`);
    const response = await axios.get(`/api/news?page=${page}&limit=${PAGE_SIZE}`);
    if (response.data && response.data.articles && Array.isArray(response.data.articles)) {
      console.log(`Successfully fetched ${response.data.articles.length} articles from API`);
      return response.data;
    }
    console.error('Invalid response format from API:', response.data);
    return null;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    return null;
  }
}

export async function fetchNews(page: number = 1): Promise<NewsResponse> {
  try {
    const apiResponse = await fetchFromAPI(page);
    console.log('Received API response:', apiResponse ? 'success' : 'null');

    // If we have results from the API, return them with pagination info
    if (apiResponse && apiResponse.articles && apiResponse.articles.length > 0) {
      console.log(`Returning ${apiResponse.articles.length} articles from API`);
      return {
        articles: apiResponse.articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        hasMore: page < apiResponse.pagination.totalPages,
        totalPages: apiResponse.pagination.totalPages
      };
    }

    // If no results from API, return fallback data
    console.warn('No results from API, using fallback data');
    return {
      articles: fallbackNews,
      hasMore: false,
      totalPages: 1
    };
  } catch (error: unknown) {
    console.error('Error in fetchNews:', error);
    return {
      articles: fallbackNews,
      hasMore: false,
      totalPages: 1
    };
  }
}

// Cache news results for 1 hour
const cachedPages: Map<number, NewsResponse> = new Map();
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getNews(page: number = 1): Promise<NewsResponse> {
  const now = Date.now();
  
  console.log(`Getting news for page ${page}, cache age: ${now - lastFetchTime}ms`);
  
  // Check if we have a valid cached response for this page
  const cachedResponse = cachedPages.get(page);
  if (cachedResponse && now - lastFetchTime <= CACHE_DURATION) {
    console.log('Returning cached news data');
    return cachedResponse;
  }

  console.log('Cache miss or expired, fetching fresh news data');
  // Fetch new data for this page
  const response = await fetchNews(page);
  
  // Update cache
  cachedPages.set(page, response);
  lastFetchTime = now;
  
  console.log(`Cached news data for page ${page}`);

  return response;
} 