import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export interface SuccessStory {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    location?: string;
    isAnonymous: boolean;
  };
  category: string;
  impact: {
    type: 'incident_resolved' | 'support_provided' | 'policy_change' | 'awareness_raised';
    description: string;
  };
  timestamp: string;
  featured: boolean;
  likes: number;
  tags: string[];
}

export interface SuccessStoriesProps {
  stories: SuccessStory[];
  title?: string;
  maxDisplay?: number;
  showFeaturedOnly?: boolean;
  className?: string;
}

const impactIcons = {
  incident_resolved: '🛡️',
  support_provided: '🤝',
  policy_change: '📋',
  awareness_raised: '📢',
};

// const impactColors = {
//   incident_resolved: 'bg-blue-100 text-primary-800 dark:bg-blue-900/30 dark:text-primary-300',
//   support_provided: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
//   policy_change: 'bg-blue-100 text-primary-800 dark:bg-blue-900/30 dark:text-primary-300',
//   awareness_raised: 'bg-blue-100 text-primary-800 dark:bg-blue-900/30 dark:text-primary-300',
// };

export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  stories,
  title = 'Success Stories',
  maxDisplay = 6,
  showFeaturedOnly = false,
  className,
}) => {
  const filteredStories = showFeaturedOnly 
    ? stories.filter(story => story.featured)
    : stories;
  
  const displayStories = maxDisplay 
    ? filteredStories.slice(0, maxDisplay)
    : filteredStories;

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4"
          >
            {/* <Badge variant="secondary" className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              {filteredStories.length} stories
            </Badge> */}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>{impactIcons[story.impact.type]}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-primary-800 dark:text-primary-300 rounded-full">
                  {story.impact.type.replace('_', ' ')}
                </span>
                {story.featured && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {story.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {truncateText(story.excerpt)}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="font-medium">
                  {story.author.isAnonymous ? 'Anonymous' : story.author.name}
                </span>
                {story.author.location && !story.author.isAnonymous && (
                  <>
                    <span>•</span>
                    <span>{story.author.location}</span>
                  </>
                )}
                <span>•</span>
                <time dateTime={story.timestamp}>
                  {new Date(story.timestamp).toLocaleDateString()}
                </time>
              </div>

              {/* Impact Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-1">
                  Impact
                </div>
                <div className="text-sm text-primary-700 dark:text-primary-400">
                  {story.impact.description}
                </div>
              </div>

              {/* Tags */}
              {story.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {story.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {story.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      +{story.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {story.likes}
                </button>

                <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors">
                  Read full story →
                </button>
              </div>
          </motion.div>
        ))}
      </div>

        {filteredStories.length > maxDisplay && (
          <div className="mt-8 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              View All Success Stories ({filteredStories.length})
            </button>
          </div>
        )}

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to share your success story with the community.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Share Your Story
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
