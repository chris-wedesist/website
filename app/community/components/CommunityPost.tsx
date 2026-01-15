import React from 'react';
import { motion } from 'framer-motion';
// Removed unused Badge import
import { cn } from '../../../utils/cn';

export interface CommunityPostProps {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
    isVerified?: boolean;
  };
  category: {
    id: string;
    name: string;
    color: string;
  };
  timestamp: string;
  stats: {
    likes: number;
    replies: number;
    views: number;
  };
  featured?: boolean;
  isPinned?: boolean;
  tags?: string[];
  className?: string;
}

export const CommunityPost: React.FC<CommunityPostProps> = ({
  title,
  content,
  author,
  category,
  timestamp,
  stats,
  featured = false,
  isPinned = false,
  tags = [],
  className,
}) => {
  const categoryColors = {
    support: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    resources: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    stories: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    updates: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <div className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer',
        featured && 'ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-950',
        isPinned && 'border-blue-200 dark:border-blue-800'
      )}>
        <div className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {isPinned && (
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  categoryColors[category.id as keyof typeof categoryColors] || categoryColors.general
                )}>
                  {category.name}
                </span>
                {featured && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {author.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{author.name}</span>
              {author.isVerified && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>•</span>
            <time dateTime={timestamp}>{new Date(timestamp).toLocaleDateString()}</time>
          </div>
        </div>
        
        <div className="pt-0">
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {truncateContent(content)}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {stats.likes}
              </button>
              
              <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {stats.replies}
              </button>
              
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {stats.views}
              </span>
            </div>

            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
              Read more →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
