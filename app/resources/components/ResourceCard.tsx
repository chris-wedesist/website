import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, Badge } from '../../components/ui';
import { cn } from '../../../utils/cn';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'guide' | 'video' | 'document' | 'toolkit';
  category: string;
  tags: string[];
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime?: number;
  downloadUrl?: string;
  thumbnail?: string;
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  stats: {
    views: number;
    downloads: number;
    ratings: number;
    avgRating: number;
  };
}

export interface ResourceCardProps {
  resource: Resource;
  className?: string;
  compact?: boolean;
}

const typeIcons = {
  article: '📄',
  guide: '📖',
  video: '🎥',
  document: '📋',
  toolkit: '🧰',
};

const typeColors = {
  article: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  guide: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  video: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  document: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  toolkit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  className,
  compact = false,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return <div className="flex items-center gap-1">{stars}</div>;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn('group cursor-pointer', className)}
      >
        <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">{typeIcons[resource.type]}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {resource.title}
              </h3>
              {resource.featured && (
                <Badge variant="default" size="sm">Featured</Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
              {resource.description}
            </p>
          </div>
          
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatNumber(resource.stats.views)} views
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <Card className={cn(
        'h-full transition-all duration-200 hover:shadow-lg cursor-pointer',
        resource.featured && 'ring-2 ring-primary-500/20',
        'bg-white dark:bg-gray-800'
      )}>
        {resource.thumbnail && (
          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            <Image
              src={resource.thumbnail}
              alt={resource.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-b-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={cn(typeColors[resource.type])}
              >
                <span className="mr-1">{typeIcons[resource.type]}</span>
                {resource.type}
              </Badge>
              
              <Badge 
                variant="outline" 
                size="sm"
                className={cn(difficultyColors[resource.difficulty])}
              >
                {resource.difficulty}
              </Badge>
              
              {resource.featured && (
                <Badge variant="default" size="sm">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {resource.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {resource.author && (
              <>
                <span>By {resource.author}</span>
                <span>•</span>
              </>
            )}
            <time dateTime={resource.publishedAt}>
              {new Date(resource.publishedAt).toLocaleDateString()}
            </time>
            {resource.readTime && (
              <>
                <span>•</span>
                <span>{resource.readTime} min read</span>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {resource.description}
          </p>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" size="sm" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="outline" size="sm" className="text-xs">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatNumber(resource.stats.views)}
              </span>
              
              {resource.downloadUrl && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {formatNumber(resource.stats.downloads)}
                </span>
              )}
              
              {resource.stats.ratings > 0 && (
                <div className="flex items-center gap-1">
                  {renderRating(resource.stats.avgRating)}
                  <span className="text-xs">({resource.stats.ratings})</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {resource.downloadUrl && (
                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors">
                  Download
                </button>
              )}
              <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors">
                View →
              </button>
            </div>
          </div>
        </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};
