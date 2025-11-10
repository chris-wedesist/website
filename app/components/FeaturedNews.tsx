"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getNews } from '../services/newsService';
import { useTranslation } from '../context/TranslationContext';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  images?: string[];
  source: string;
  date: string;
}

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const news = await getNews(1);
        setFeaturedNews(news.articles.slice(0, 3)); // Get only the first 3 news items
      } catch (error) {
        console.error('Error fetching featured news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('home.news.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              {t('home.news.description')}
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
              {t('home.news.viewAll')}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/blog/${item.id}${item.url ? `?url=${encodeURIComponent(item.url)}` : ''}`}
            >
              {/* Article Image */}
              {(item.imageUrl || item.images?.[0]) ? (
                <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={item.imageUrl || item.images?.[0] || ''}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/blog/default-news.jpg';
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>
              ) : (
                // Default placeholder image
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{item.source}</span>
                  <span>•</span>
                  <time dateTime={item.date}>{new Date(item.date).toLocaleDateString()}</time>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <Link
                  href={`/blog/${item.id}${item.url ? `?url=${encodeURIComponent(item.url)}` : ''}`}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  {t('home.news.readMore')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 