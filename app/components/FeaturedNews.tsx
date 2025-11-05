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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/blog/${item.id}`}
            >
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
                href={`/blog/${item.id}`}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                {t('home.news.readMore')}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 