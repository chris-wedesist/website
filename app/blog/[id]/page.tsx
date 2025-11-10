"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HeroSection } from "../../components/HeroSection";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  images?: string[];
  source: string;
  date: string;
  author: string;
  categories: string[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      // Get URL from query params if available
      const urlParams = new URLSearchParams(window.location.search);
      const articleUrl = urlParams.get('url');
      
      console.log('[News Detail Page] Starting to fetch article:', {
        articleId,
        articleUrl,
        apiUrl: `/api/news/${articleId}${articleUrl ? `?url=${encodeURIComponent(articleUrl)}` : ''}`,
        timestamp: new Date().toISOString()
      });
      
      try {
        setLoading(true);
        console.log('[News Detail Page] Fetching from API...');
        
        const apiUrl = `/api/news/${articleId}${articleUrl ? `?url=${encodeURIComponent(articleUrl)}` : ''}`;
        console.log('[News Detail Page] Full API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('[News Detail Page] API Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[News Detail Page] API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });
          throw new Error(`Article not found (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        console.log('[News Detail Page] Article data received:', {
          id: data.id,
          title: data.title,
          url: data.url,
          hasContent: !!data.content,
          contentLength: data.content?.length || 0,
          imagesCount: data.images?.length || 0
        });
        
        setArticle(data);
      } catch (err) {
        console.error("[News Detail Page] Error fetching article:", err);
        console.error("[News Detail Page] Error details:", {
          message: err instanceof Error ? err.message : String(err),
          articleId,
          stack: err instanceof Error ? err.stack : undefined
        });
        setError("Failed to load article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      console.log('[News Detail Page] Article ID found:', articleId);
      fetchArticle();
    } else {
      console.error('[News Detail Page] No article ID provided!');
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection
        title={article.title}
        description={article.description}
        imageSrc={article.images?.[0] || article.imageUrl || "/images/blog/default-news.jpg"}
        imageAlt={article.title}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to News
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{article.source}</span>
              <span>•</span>
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {article.author && (
                <>
                  <span>•</span>
                  <span>By {article.author}</span>
                </>
              )}
            </div>

            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Images Gallery */}
          {article.images && article.images.length > 0 && (
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="max-w-3xl w-full rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={article.images[0]}
                    alt={`${article.title} - Featured Image`}
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(article.images![0], '_blank')}
                    onError={(e) => {
                      // Hide broken images
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </motion.div>
            </div>
          )}

          {/* Article Image (fallback for single image) */}
          {(!article.images || article.images.length === 0) && article.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="max-w-3xl w-full rounded-xl overflow-hidden shadow-lg">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {article.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          {/* Original Source Link */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Read the original article:
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {article.url}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All News
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

