// Attorney Enrichment Configuration
// Your Google Custom Search Engine ID: 067300f0d12244cd4

export const ENRICHMENT_CONFIG = {
  // Set to true to enable attorney data enrichment via web scraping
  ENABLE_ATTORNEY_ENRICHMENT: process.env.ENABLE_ATTORNEY_ENRICHMENT === 'true',
  
  // Set to false to disable caching (not recommended for production)
  ENABLE_ATTORNEY_CACHING: process.env.ENABLE_ATTORNEY_CACHING !== 'false',
  
  // Maximum number of concurrent enrichment requests
  MAX_CONCURRENT_ENRICHMENTS: parseInt(process.env.MAX_CONCURRENT_ENRICHMENTS || '3'),
  
  // Cache TTL in milliseconds (24 hours = 86400000)
  CACHE_TTL: parseInt(process.env.ATTORNEY_CACHE_TTL || '86400000'),
  
  // Google Custom Search API Configuration
  // Your CSE ID: 067300f0d12244cd4
  GOOGLE_SEARCH_API_KEY: process.env.GOOGLE_SEARCH_API_KEY,
  GOOGLE_CSE_ID: process.env.GOOGLE_CSE_ID || '067300f0d12244cd4',
  
  // Rate limiting settings
  REQUEST_DELAY_MS: parseInt(process.env.REQUEST_DELAY_MS || '1000'),
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES || '3'),
  TIMEOUT_MS: parseInt(process.env.TIMEOUT_MS || '15000'),
};

// Environment variables you need to set:
/*
ENABLE_ATTORNEY_ENRICHMENT=true
ENABLE_ATTORNEY_CACHING=true
MAX_CONCURRENT_ENRICHMENTS=3
ATTORNEY_CACHE_TTL=86400000
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
REQUEST_DELAY_MS=1000
MAX_RETRIES=3
TIMEOUT_MS=15000
*/
