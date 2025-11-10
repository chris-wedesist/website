import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import * as cheerio from 'cheerio';

// Define article type
// type Article = {
//   id: string;
//   title: string;
//   description: string;
//   url: string;
//   imageUrl: string | null;
//   source: string;
//   date: string;
// };

// Simple in-memory cache
// let cache = {
//   articles: null as Article[] | null,
//   timestamp: 0
// };

// // Cache duration in milliseconds (5 minutes)
// const CACHE_DURATION = 5 * 60 * 1000;

// RSS feed sources - US focused
const RSS_FEEDS = [
  {
    url: 'https://www.cbsnews.com/latest/rss/main',
    name: 'CNN US'
  },
  {
    url: 'https://feeds.npr.org/1001/rss.xml', // NPR US News
    name: 'NPR'
  },
  {
    url: 'https://www.nbcnews.com/id/3032091/device/rss/rss.xml',
    name: 'NBC News'
  },
  {
    url: 'https://www.latimes.com/local/rss2.0.xml',
    name: 'LA Times'
  }
];

// Keywords for filtering relevant topics
const RELEVANT_KEYWORDS = [
  'community',
  'protection',
  'harassment',
  'incident',
  'karen',
  'safety',
  'crime',
  'law enforcement',
  'neighborhood',
  'security',
  'threat',
  'violence',
  'abuse',
  'stalking',
  'bullying',
  'discrimination',
  'hate crime',
  'domestic violence',
  'sexual harassment',
  'assault'
];

const MAX_ARTICLES = 50; // Increased total articles limit
const ARTICLES_PER_PAGE = 10; // Number of articles per page
const MAX_DESCRIPTION_LENGTH = 150;
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'news');

// Get the base URL for generating full article URLs
function getBaseUrl(): string {
  // Use environment variable if available, otherwise use production domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default to production domain
  return 'https://desistv2.vercel.app';
}

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate professional article ID: slug + short hash
function generateArticleId(title: string, articleUrl: string): string {
  const slug = generateSlug(title);
  const hash = createHash('sha256').update(articleUrl).digest('hex').substring(0, 8); // Short 8-char hash
  const slugPart = slug.substring(0, 60); // Limit slug length
  return `${slugPart}-${hash}`;
}

// Ensure the images directory exists
try {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Error creating images directory:', error);
}

// Retry mechanism for fetching RSS feeds
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchWithRetry(parser: Parser, url: string, maxRetries: number = 3, delay: number = 1000): Promise<any> {
  console.log(`Attempting to fetch RSS feed from ${url}`);
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await parser.parseURL(url);
      console.log(`Successfully fetched RSS feed from ${url}`);
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error fetching RSS feed from ${url} (attempt ${attempt}/${maxRetries}):`, errorMessage);
      const isRetryableError = 
        (error instanceof Error && error.message?.includes('Status code 502')) ||
        (error instanceof Error && error.message?.includes('Status code 503')) ||
        (error instanceof Error && error.message?.includes('Status code 504')) ||
        (error instanceof Error && error.message?.includes('ECONNRESET')) ||
        (error instanceof Error && error.message?.includes('ETIMEDOUT')) ||
        (error instanceof Error && error.message?.includes('timeout')) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.code === 'ECONNABORTED' ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.code === 'ETIMEDOUT';      if (attempt === maxRetries || !isRetryableError) {
        console.error(`Failed to fetch RSS feed from ${url} after ${maxRetries} attempts`);
        return { items: [] }; // Return empty feed instead of throwing
      }
      
      console.log(`Attempt ${attempt} failed for ${url}, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
}

// Check if article is relevant to our topics
function isRelevantArticle(item: { title?: string; contentSnippet?: string; content?: string }): boolean {
  if (!item) return false;
  const searchText = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`.toLowerCase();
  return RELEVANT_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
}

// Truncate text to a maximum length
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Download and save image
async function downloadAndSaveImage(imageUrl: string): Promise<string | null> {
  try {
    // Skip invalid URLs
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return null;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      return null;
    }

    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => status === 200,
      maxContentLength: 5 * 1024 * 1024 // 5MB limit
    });
    
    const contentType = response.headers['content-type'];
    if (!contentType?.startsWith('image/')) {
      return null;
    }

    const extension = contentType.split('/')[1];
    if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(extension)) {
      return null;
    }

    const filename = `${uuidv4()}.${extension}`;
    const filepath = path.join(IMAGES_DIR, filename);
    
    fs.writeFileSync(filepath, response.data);
    return `/images/news/${filename}`;
  } catch (error) {
    // Only log actual errors, not expected failures
    if (axios.isAxiosError(error) && error.code !== 'ECONNABORTED') {
      console.error(`Error downloading image from ${imageUrl}:`, error.message);
    }
    return null;
  }
}

export async function GET(request: Request) {
  try {
    // Get pagination parameters
    console.log('Starting news API request');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || String(ARTICLES_PER_PAGE));
    
    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }
    if (isNaN(limit) || limit < 1 || limit > 20) {
      return NextResponse.json({ error: 'Invalid limit. Must be between 1 and 20' }, { status: 400 });
    }

    const parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'media:content', { keepArray: true }],
          ['media:thumbnail', 'media:thumbnail', { keepArray: true }],
          ['itunes:image', 'itunes:image']
        ]
      }
    });
    const allArticles = [];

    console.log(`Fetching from ${RSS_FEEDS.length} RSS feeds`);
    // Fetch from all RSS feeds in parallel
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        console.log(`\n=== Fetching feed from ${feed.name} ===`);
        const feedData = await fetchWithRetry(parser, feed.url);
        
        if (!feedData?.items || feedData.items.length === 0) {
          console.log(`No items found in feed ${feed.name}`);
          return [];
        }

        // Filter and process relevant articles
        const relevantItems = feedData.items.filter(isRelevantArticle);
        console.log(`Found ${relevantItems.length} relevant articles in ${feed.name}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const articlePromises = relevantItems.map(async (item: any) => {
          if (!item) return null;

          // Try multiple sources for images
          let imageUrl: string | null = null;
          
          // 1. Try enclosure (most common)
          if (item.enclosure?.url) {
            imageUrl = item.enclosure.url;
          }
          
          // 2. Try media:content
          if (!imageUrl && item['media:content']?.[0]?.url) {
            imageUrl = item['media:content'][0].url;
          }
          
          // 3. Try media:thumbnail
          if (!imageUrl && item['media:thumbnail']?.[0]?.url) {
            imageUrl = item['media:thumbnail'][0].url;
          }
          
          // 4. Try itunes:image
          if (!imageUrl && item['itunes:image']?.href) {
            imageUrl = item['itunes:image'].href;
          }
          
          // Download and save image (try to download, but don't fail if it doesn't work)
          const localImagePath = imageUrl ? await downloadAndSaveImage(imageUrl) : null;
          
          // Create a professional article ID: slug from title + short hash
          const articleUrl = item.link || '';
          const articleTitle = item.title || 'Untitled Article';
          let articleId: string;
          if (articleUrl && articleTitle) {
            // Generate professional slug-based ID
            articleId = generateArticleId(articleTitle, articleUrl);
          } else if (articleUrl) {
            // Fallback: use hash if no title
            const hash = createHash('sha256').update(articleUrl).digest('hex');
            articleId = `article-${hash.substring(0, 8)}`;
          } else {
            articleId = `article-${uuidv4().substring(0, 8)}`;
          }
          
          const fullContent = item.content || item.contentSnippet || item.description || '';
          
          // Extract images from content if available
          const images: string[] = [];
          
          // Helper function to resolve relative URLs
          const resolveImageUrl = (src: string | undefined): string | null => {
            if (!src) return null;
            try {
              // Handle data URLs
              if (src.startsWith('data:')) return null;
              
              // Handle absolute URLs
              if (src.startsWith('http://') || src.startsWith('https://')) {
                return src;
              }
              
              // Handle relative URLs - resolve against article URL
              if (articleUrl) {
                return new URL(src, articleUrl).href;
              }
              
              return null;
            } catch {
              return null;
            }
          };
          
          if (fullContent) {
            try {
              const $ = cheerio.load(fullContent);
              $('img').each((_, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
                const resolvedUrl = resolveImageUrl(src);
                if (resolvedUrl) {
                  images.push(resolvedUrl);
                }
              });
            } catch {
              // If parsing fails, continue without images from content
            }
          }
          
          // Add original image URL if available (from enclosure/media)
          if (imageUrl) {
            // Always add original URL to images array (don't rely on local download)
            images.unshift(imageUrl);
            // Also add local path if download succeeded
            if (localImagePath) {
              images.unshift(localImagePath);
            }
          }
          
          // If no image found yet, try to fetch from article page (Open Graph)
          if (!imageUrl && articleUrl && images.length === 0) {
            try {
              console.log(`[API] No image in RSS, trying to fetch from article: ${articleUrl}`);
              const articleResponse = await axios.get(articleUrl, {
                timeout: 5000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              const $ = cheerio.load(articleResponse.data);
              
              // Try Open Graph image first
              const ogImage = $('meta[property="og:image"]').attr('content');
              if (ogImage) {
                const resolvedOgImage = resolveImageUrl(ogImage);
                if (resolvedOgImage) {
                  imageUrl = resolvedOgImage;
                  images.push(resolvedOgImage);
                  console.log(`[API] Found OG image: ${resolvedOgImage}`);
                }
              }
            } catch {
              // Silently fail - this is just a fallback
              console.log(`[API] Could not fetch image from article page`);
            }
          }
          
          const processedItem = {
            id: articleId,
            title: item.title || 'Untitled Article',
            description: truncateText(item.contentSnippet || item.content || '', MAX_DESCRIPTION_LENGTH),
            content: fullContent, // Full article content
            url: `${getBaseUrl()}/blog/${articleId}`, // Full domain URL to our detailed article page
            originalUrl: articleUrl, // Original external URL for fetching full content
            imageUrl: imageUrl || localImagePath || null, // Prioritize original URL, fallback to local
            images: images.length > 0 ? images : undefined,
            source: feed.name,
            date: item.isoDate || item.pubDate || new Date().toISOString(),
            author: item.creator || item.author || feed.name,
            categories: item.categories || []
          };

          console.log('Processed relevant article:', {
            id: processedItem.id,
            title: processedItem.title,
            source: processedItem.source,
            url: processedItem.url,
            imageUrl: processedItem.imageUrl,
            imagesCount: processedItem.images?.length || 0,
            hasImage: !!(processedItem.imageUrl || processedItem.images?.length)
          });
          
          return processedItem;
        });

        const articles = await Promise.all(articlePromises);
        return articles.filter((article): article is NonNullable<typeof article> => article !== null);
      } catch (error) {
        console.error(`Error fetching feed ${feed.url}:`, error);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    allArticles.push(...results.flat());
    
    console.log(`Total articles collected: ${allArticles.length}`);
    
    // Sort by date
    const sortedArticles = allArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_ARTICLES);
    
    console.log(`Returning ${sortedArticles.length} sorted articles`);

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = sortedArticles.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedArticles.length / limit);
    const hasMore = page < totalPages;

    console.log(`\n=== Final Results ===`);
    console.log(`Total relevant articles found: ${sortedArticles.length}`);
    console.log(`Page ${page} of ${totalPages}`);
    console.log('Articles with images:', sortedArticles.filter(article => article.imageUrl).length);
    
    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles: sortedArticles.length,
        articlesPerPage: limit,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
