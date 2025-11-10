import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Get the base URL for API calls
const getBaseUrl = (): string => {
  // Always use production domain
  return 'https://desistv2.vercel.app';
};

// Fetch full article content from URL using cheerio
async function fetchFullArticleContent(url: string): Promise<{ content: string; title?: string; author?: string; source?: string; date?: string; description?: string; images?: string[] }> {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract title - try multiple selectors
    let title = $('h1').first().text().trim() || 
                $('h1.headline').first().text().trim() ||
                $('h1[data-module="ArticleHeader"]').first().text().trim() ||
                $('.headline').first().text().trim() ||
                $('meta[property="og:title"]').attr('content') ||
                $('title').first().text().trim() ||
                '';
    
    // Clean up title (remove site name suffixes)
    if (title) {
      title = title.replace(/\s*-\s*LA Times.*$/i, '');
      title = title.replace(/\s*-\s*Los Angeles Times.*$/i, '');
      title = title.replace(/\s*\|\s*LA Times.*$/i, '');
      title = title.trim();
    }
    
    // Extract author
    const author = $('meta[name="author"]').attr('content') ||
                 $('.author').first().text().trim() ||
                 $('[rel="author"]').first().text().trim() ||
                 $('span[itemprop="author"]').first().text().trim() ||
                 $('a[rel="author"]').first().text().trim() ||
                 $('.byline-author').first().text().trim() ||
                 $('[data-module="Byline"]').first().text().trim() ||
                 '';
    
    // Extract date
    const date = $('meta[property="article:published_time"]').attr('content') ||
               $('time[datetime]').attr('datetime') ||
               $('time').attr('datetime') ||
               $('meta[name="publish-date"]').attr('content') ||
               '';
    
    // Extract description
    const description = $('meta[property="og:description"]').attr('content') ||
                     $('meta[name="description"]').attr('content') ||
                     $('.article-summary').first().text().trim() ||
                     '';
    
    // Extract source from domain
    const urlObj = new URL(url);
    let source = 'Unknown';
    if (urlObj.hostname.includes('latimes.com')) {
      source = 'LA Times';
    } else if (urlObj.hostname.includes('cbsnews.com')) {
      source = 'CBS News';
    } else if (urlObj.hostname.includes('npr.org')) {
      source = 'NPR';
    } else if (urlObj.hostname.includes('nbcnews.com')) {
      source = 'NBC News';
    } else {
      const domainParts = urlObj.hostname.replace('www.', '').split('.');
      source = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }
    
    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .advertisement, .ad, .sidebar').remove();
    
    // Try common article content selectors
    const selectors = [
      'article',
      '.article-body',
      '.article-content',
      '.story-body',
      '.post-content',
      '[role="article"]',
      '.entry-content',
      '.content-body',
      '.article-text',
      'main article',
      '.main-content article'
    ];
    
    let content = '';
    
    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        // Extract text from paragraphs
        const paragraphs = element.find('p').map((_, el) => {
          const text = $(el).text().trim();
          return text.length > 50 ? text : null;
        }).get();
        
        if (paragraphs.length > 0) {
          content = paragraphs.join('\n\n');
          break;
        }
      }
    }
    
    // If no content found, try extracting all paragraphs from body
    if (!content) {
      const paragraphs = $('body p').map((_, el) => {
        const text = $(el).text().trim();
        return text.length > 50 ? text : null;
      }).get();
      
      if (paragraphs.length > 0) {
        content = paragraphs.slice(0, 20).join('\n\n'); // Limit to first 20 paragraphs
      }
    }
    
    // Filter out unwanted text patterns (automated voice messages)
    if (content) {
      content = content
        .replace(/This is read by an automated voice\.?\s*Please report any issues or inconsistencies here\.?/gi, '')
        .replace(/This article was read by an automated voice\.?\s*Please report any issues or inconsistencies here\.?/gi, '')
        .replace(/Read by an automated voice\.?\s*Please report any issues\.?/gi, '')
        .replace(/This is read by an automated voice/gi, '')
        .replace(/Please report any issues or inconsistencies here\.?/gi, '')
        .trim();
    }
    
    // Extract images from the article
    const images: string[] = [];
    
    // Helper function to resolve image URLs
    const resolveImageUrl = (src: string | undefined): string | null => {
      if (!src) return null;
      try {
        // Handle data URLs
        if (src.startsWith('data:')) return null;
        
        // Handle absolute URLs
        if (src.startsWith('http://') || src.startsWith('https://')) {
          return src;
        }
        
        // Handle relative URLs
        return new URL(src, url).href;
      } catch {
        return null;
      }
    };
    
    // Try to find images in article content area first
    const articleElement = $('article').first();
    if (articleElement.length > 0) {
      articleElement.find('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original');
        const imageUrl = resolveImageUrl(src);
        if (imageUrl) {
          // Filter out small images, icons, and ads
          const width = parseInt($(el).attr('width') || '0');
          const height = parseInt($(el).attr('height') || '0');
          const alt = $(el).attr('alt') || '';
          
          // Only include images that are likely to be article images
          if (
            !imageUrl.includes('icon') &&
            !imageUrl.includes('logo') &&
            !imageUrl.includes('avatar') &&
            !imageUrl.includes('ad') &&
            !imageUrl.includes('advertisement') &&
            !alt.toLowerCase().includes('ad') &&
            !alt.toLowerCase().includes('advertisement') &&
            (width > 300 || height > 200 || (!width && !height)) // Either large enough or no dimensions specified
          ) {
            images.push(imageUrl);
          }
        }
      });
    }
    
    // If no images found in article, try common image selectors
    if (images.length === 0) {
      $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('data-original');
        const imageUrl = resolveImageUrl(src);
        if (imageUrl) {
          const alt = $(el).attr('alt') || '';
          const width = parseInt($(el).attr('width') || '0');
          const height = parseInt($(el).attr('height') || '0');
          
          // Filter out icons, logos, ads, and small images
          if (
            !imageUrl.includes('icon') &&
            !imageUrl.includes('logo') &&
            !imageUrl.includes('avatar') &&
            !imageUrl.includes('ad') &&
            !imageUrl.includes('advertisement') &&
            !alt.toLowerCase().includes('ad') &&
            !alt.toLowerCase().includes('advertisement') &&
            (width > 300 || height > 200 || (!width && !height))
          ) {
            images.push(imageUrl);
          }
        }
      });
    }
    
    // Also try Open Graph images
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      const ogImageUrl = resolveImageUrl(ogImage);
      if (ogImageUrl && !images.includes(ogImageUrl)) {
        images.unshift(ogImageUrl); // Add to beginning as it's likely the main image
      }
    }
    
    // Try meta image tags
    const metaImage = $('meta[name="image"]').attr('content') || $('meta[itemprop="image"]').attr('content');
    if (metaImage) {
      const metaImageUrl = resolveImageUrl(metaImage);
      if (metaImageUrl && !images.includes(metaImageUrl)) {
        images.unshift(metaImageUrl);
      }
    }
    
    // Remove duplicates and limit to 10 images
    const uniqueImages = Array.from(new Set(images)).slice(0, 10);
    
    // Log extracted metadata for debugging
    console.log('[API] Extracted metadata:', {
      title: title.substring(0, 60),
      author: author.substring(0, 40),
      source,
      hasContent: !!content && content.length > 0,
      contentLength: content.length,
      imagesCount: uniqueImages.length
    });
    
    return {
      content: content || 'Full article content could not be extracted. Please visit the original source for complete article.',
      title: title || '',
      author: author || '',
      source: source,
      date: date || '',
      description: description || '',
      images: uniqueImages
    };
  } catch (error) {
    console.error('Error fetching full article content:', error);
    return {
      content: 'Unable to fetch full article content. Please visit the original source for complete article.',
      title: '',
      author: '',
      source: 'Unknown',
      date: '',
      description: '',
      images: []
    };
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const articleId = params.id;
    
    console.log(`[API] Looking up article with ID: ${articleId}`);
    
    // Get URL from query parameter (optional - for faster lookup)
    const url = new URL(request.url);
    const articleUrl = url.searchParams.get('url');
    
    console.log(`[API] Original URL from query: ${articleUrl || 'not provided'}`);
    
    interface Article {
      id: string;
      title: string;
      description: string;
      content?: string;
      url: string;
      originalUrl?: string;
      imageUrl?: string | null;
      images?: string[];
      source: string;
      date: string;
      author?: string;
      categories?: string[];
    }
    
    // If we have the originalUrl from query parameter, use it directly
    // This is faster and more reliable than searching through pages
    if (articleUrl) {
      console.log(`[API] Using originalUrl from query parameter: ${articleUrl}`);
      
      // Try to find article metadata from API (optional - for better metadata)
      let article: Article | null = null;
      try {
        const baseUrl = getBaseUrl();
        // Search a few pages to find metadata
        for (let page = 1; page <= 5; page++) {
          const mainApiResponse = await fetch(`${baseUrl}/api/news?page=${page}&limit=50`);
          const mainData = await mainApiResponse.json();
          
          if (mainData.articles && mainData.articles.length > 0) {
            article = mainData.articles.find((a: Article) => 
              a.id === articleId || a.originalUrl === articleUrl
            );
            
            if (article) {
              console.log(`[API] Found article metadata from API`);
              break;
            }
            
            if (!mainData.pagination?.hasMore) break;
          } else {
            break;
          }
        }
      } catch (error) {
        console.error('[API] Error searching for metadata:', error);
      }
      
      // Fetch full content from original URL
      console.log(`[API] Fetching full content from: ${articleUrl}`);
      const fullContentData = await fetchFullArticleContent(articleUrl);
      
      // If we found article metadata, merge it with fetched content
      if (article) {
        console.log(`[API] ✓ Returning article with metadata and full content`);
        return NextResponse.json({
          ...article,
          content: fullContentData.content || article.content || article.description,
          title: fullContentData.title || article.title,
          description: fullContentData.description || article.description,
          author: fullContentData.author || article.author || article.source,
          source: fullContentData.source || article.source,
          date: fullContentData.date || article.date,
          images: fullContentData.images || article.images || [],
          url: `${getBaseUrl()}/blog/${articleId}`,
          originalUrl: articleUrl
        });
      } else {
        // Fallback: return article constructed from fetched content
        console.log(`[API] ✓ Returning article from fetched content (no metadata found)`);
        return NextResponse.json({
          id: articleId,
          title: fullContentData.title || 'Article',
          description: fullContentData.description || '',
          content: fullContentData.content,
          url: `${getBaseUrl()}/blog/${articleId}`,
          originalUrl: articleUrl,
          imageUrl: fullContentData.images?.[0] || null,
          images: fullContentData.images || [],
          source: fullContentData.source || 'Unknown',
          date: fullContentData.date || new Date().toISOString(),
          author: fullContentData.author || '',
          categories: []
        });
      }
    }
    
    // If no URL provided, search through API pages to find the article by ID
    let article: Article | null = null;
    try {
      // Fetch all pages to find the article
      let page = 1;
      let found = false;
      const maxPages = 50; // Increased from 20 to 50 for better coverage
      
      while (!found && page <= maxPages) {
        console.log(`[API] Searching page ${page} for article ID: ${articleId}`);
        try {
          const baseUrl = getBaseUrl();
          const mainApiResponse = await fetch(`${baseUrl}/api/news?page=${page}&limit=50`, {
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000) // 10 second timeout per page
          });
          
          if (!mainApiResponse.ok) {
            console.error(`[API] Error response from page ${page}: ${mainApiResponse.status}`);
            break;
          }
          
          const mainData = await mainApiResponse.json();
          
          if (mainData.articles && mainData.articles.length > 0) {
            console.log(`[API] Page ${page} has ${mainData.articles.length} articles`);
            
            // Try to find by ID - check exact match and trimmed match
            const foundArticle = mainData.articles.find((a: Article) => {
              if (!a || !a.id) return false;
              const normalizedId = articleId.trim().toLowerCase();
              const normalizedArticleId = a.id.trim().toLowerCase();
              return normalizedId === normalizedArticleId || a.id === articleId;
            });
            
            if (foundArticle) {
              console.log(`[API] ✓ Found article by ID:`, {
                id: foundArticle.id,
                title: foundArticle.title?.substring(0, 60) || 'No title',
                originalUrl: foundArticle.originalUrl || 'No originalUrl'
              });
              article = foundArticle;
              found = true;
              break;
            }
            
            // If no more pages, stop
            if (!mainData.pagination?.hasMore) {
              console.log(`[API] No more pages available`);
              break;
            }
          } else {
            console.log(`[API] Page ${page} has no articles`);
            // If we get an empty page, check if there are more pages
            if (!mainData.pagination?.hasMore) {
              break;
            }
          }
        } catch (pageError) {
          console.error(`[API] Error fetching page ${page}:`, pageError);
          // Continue to next page instead of breaking
          // Only break if it's a critical error
          if (pageError instanceof Error && pageError.name === 'AbortError') {
            console.log(`[API] Timeout on page ${page}, continuing...`);
          }
        }
        
        page++;
      }
      
      if (!found) {
        console.log(`[API] ✗ Article not found after searching ${page - 1} pages`);
        console.log(`[API] Looking for ID: "${articleId}"`);
        // Log some sample IDs from the last page to help debug
        if (page > 1) {
          try {
            const baseUrl = getBaseUrl();
            const sampleResponse = await fetch(`${baseUrl}/api/news?page=1&limit=5`);
            const sampleData = await sampleResponse.json();
            if (sampleData.articles && sampleData.articles.length > 0) {
              console.log(`[API] Sample article IDs from page 1:`, 
                sampleData.articles.slice(0, 3).map((a: Article) => a.id)
              );
            }
          } catch {
            // Ignore sample fetch errors
          }
        }
      }
    } catch (error) {
      console.error('Error fetching from main API:', error);
    }
    
    // If article not found in main API, return error
    if (!article) {
      console.log(`[API] ✗ Article not found after searching`);
      return NextResponse.json(
        { error: 'Article not found. Please try refreshing the news page and clicking the article again.' },
        { status: 404 }
      );
    }
    
    // Use the original external URL from the found article for fetching content
    const finalUrl = article.originalUrl;
    
    if (!finalUrl) {
      console.log(`[API] ✗ No original URL found for article`);
      // Return article without full content if we can't fetch it
      return NextResponse.json({
        ...article,
        url: `${getBaseUrl()}/blog/${articleId}`,
        content: article.content || article.description || 'Content not available'
      });
    }
    
    // Fetch the full article content from the original external URL
    console.log(`[API] Fetching full content from: ${finalUrl}`);
    const fullContentData = await fetchFullArticleContent(finalUrl);
    
    // Return article with full content
    console.log(`[API] ✓ Returning article with full content`);
    return NextResponse.json({
      ...article,
      content: fullContentData.content || article.content || article.description,
      title: fullContentData.title || article.title,
      description: fullContentData.description || article.description,
      author: fullContentData.author || article.author || article.source,
      source: fullContentData.source || article.source,
      date: fullContentData.date || article.date,
      images: fullContentData.images || article.images || [],
      url: `${getBaseUrl()}/blog/${articleId}`,
      originalUrl: article.originalUrl || finalUrl
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

