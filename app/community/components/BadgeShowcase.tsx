import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export interface CommunityBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
  isEarned: boolean;
  requirements?: string;
  progress?: {
    current: number;
    total: number;
  };
}

export interface BadgeShowcaseProps {
  badges: CommunityBadge[];
  title?: string;
  showProgress?: boolean;
  maxDisplay?: number;
  className?: string;
}

const rarityColors = {
  common: { bg: 'bg-gray-500', text: 'text-gray-700 dark:text-gray-300', glow: 'shadow-gray-500/20' },
  uncommon: { bg: 'bg-blue-400', text: 'text-blue-700 dark:text-blue-300', glow: 'shadow-blue-400/30' },
  rare: { bg: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300', glow: 'shadow-blue-500/40' },
  epic: { bg: 'bg-blue-600', text: 'text-blue-700 dark:text-blue-300', glow: 'shadow-blue-600/50' },
  legendary: { bg: 'bg-gradient-to-br from-yellow-400 to-orange-500', text: 'text-orange-700 dark:text-orange-300' , glow: 'shadow-yellow-500/60' },
};

const rarityShine = {
  common: 'hover:shadow-lg',
  uncommon: 'hover:shadow-blue-500/30 hover:shadow-xl',
  rare: 'hover:shadow-blue-600/40 hover:shadow-2xl',
  epic: 'hover:shadow-blue-700/50 hover:shadow-2xl',
  legendary: 'hover:shadow-yellow-500/60 hover:shadow-2xl',
};

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  title = 'Community Badges',
  showProgress = true,
  maxDisplay,
  className,
}) => {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const earnedBadges = badges.filter(badge => badge.isEarned);

  return (
    <section className={cn('w-full', className)}>
      {/* Header Section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Earn badges by participating in community activities and reaching milestones
          </p>
        </motion.div>

        {/* Stats and Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${earnedBadges.length > badges.length * 0.7 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {earnedBadges.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collected</div>
            </div>
            <div className="text-gray-400 dark:text-gray-600">/</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{badges.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
          </div>

          {showProgress && (
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Completion</span>
                <span className="font-medium">{Math.round((earnedBadges.length / badges.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative group cursor-pointer',
                !badge.isEarned && 'opacity-60'
              )}
            >
              <div className={cn(
                'relative bg-white dark:bg-gray-800 rounded-2xl p-6 border transition-all duration-300 hover:scale-105',
                badge.isEarned 
                  ? 'border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl' 
                  : 'border border-gray-200 dark:border-gray-700 shadow-sm',
                badge.isEarned && rarityShine[badge.rarity]
              )}>
                
                {/* Rarity Border Glow */}
                {badge.isEarned && (
                  <div className={cn(
                    'absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300',
                    `${rarityColors[badge.rarity].bg}`
                  )} />
                )}

                {/* Badge Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={cn(
                    'mb-4 inline-flex items-center justify-center w-16 h-16 mx-auto rounded-2xl shadow-lg',
                    badge.isEarned ? `${rarityColors[badge.rarity].bg} text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  )}>
                    <div className={cn(
                      'text-2xl transition-transform duration-300 group-hover:scale-110',
                      !badge.isEarned && 'grayscale'
                    )}>
                      {badge.icon}
                    </div>
                  </div>

                  {/* Badge Name */}
                  <h4 className={cn(
                    'font-semibold mb-2 leading-tight',
                    badge.isEarned ? rarityColors[badge.rarity].text : 'text-gray-600 dark:text-gray-400'
                  )}>
                    {badge.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Status */}
                  {badge.isEarned ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        ✓ Earned
                      </div>
                      {badge.earnedAt && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(badge.earnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        Not Earned
                      </div>
                      {badge.progress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{badge.progress.current}/{badge.progress.total}</span>
                            <span>{Math.round((badge.progress.current / badge.progress.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rarity Indicator */}
                <div className={cn(
                  'absolute -top-2 -right-2 w-6 h-6 rounded-full border-3 flex items-center justify-center text-xs font-bold',
                  badge.isEarned ? `${rarityColors[badge.rarity].bg} text-white border-white dark:border-gray-800` : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
                  badge.rarity === 'legendary' && 'animate-pulse'
                )}>
                  {badge.rarity.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 scale-75 group-hover:scale-100">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-4 max-w-60 text-center shadow-2xl">
                  <div className={cn(
                    'font-bold mb-2 text-lg',
                    rarityColors[badge.rarity].text
                  )}>
                    {badge.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {badge.description}
                  </div>
                  {!badge.isEarned && badge.requirements && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-lg py-2 px-3">
                      <strong>Unlock:</strong> {badge.requirements}
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-gray-800" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      {/* Footer Section */}
      {maxDisplay && badges.length > maxDisplay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            View all {badges.length} badges
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      )}
    </section>
  );
};
