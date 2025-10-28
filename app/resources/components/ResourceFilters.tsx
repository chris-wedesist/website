import React from 'react';
import { Badge } from '../../components/ui';
import { cn } from '../../../utils/cn';

export interface FilterOptions {
  types: string[];
  categories: string[];
  difficulties: string[];
  languages: string[];
}

export interface ResourceFiltersProps {
  filters: FilterOptions;
  activeFilters: {
    type?: string;
    category?: string;
    difficulty?: string;
    language?: string;
    searchQuery?: string;
  };
  onFilterChange: (filterType: string, value: string | null) => void;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onSearchChange,
  className,
}) => {
  const clearAllFilters = () => {
    onFilterChange('type', null);
    onFilterChange('category', null);
    onFilterChange('difficulty', null);
    onFilterChange('language', null);
    onSearchChange('');
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value && value !== '');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={activeFilters.searchQuery || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active filters:
          </span>
          
          {activeFilters.type && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onFilterChange('type', null)}
            >
              Type: {activeFilters.type}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Badge>
          )}
          
          {activeFilters.category && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onFilterChange('category', null)}
            >
              Category: {activeFilters.category}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Badge>
          )}
          
          {activeFilters.difficulty && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onFilterChange('difficulty', null)}
            >
              Level: {activeFilters.difficulty}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Badge>
          )}
          
          {activeFilters.language && activeFilters.language !== 'en' && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onFilterChange('language', null)}
            >
              Language: {activeFilters.language}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Badge>
          )}
          
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Resource Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Resource Type
          </h3>
          <div className="space-y-2">
            {filters.types.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange('type', activeFilters.type === type ? null : type)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  activeFilters.type === type
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Category
          </h3>
          <div className="space-y-2">
            {filters.categories.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange('category', activeFilters.category === category ? null : category)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  activeFilters.category === category
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Difficulty Level
          </h3>
          <div className="space-y-2">
            {filters.difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onFilterChange('difficulty', activeFilters.difficulty === difficulty ? null : difficulty)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  activeFilters.difficulty === difficulty
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                )}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Language
          </h3>
          <div className="space-y-2">
            {filters.languages.map((language) => (
              <button
                key={language}
                onClick={() => onFilterChange('language', activeFilters.language === language ? null : language)}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  activeFilters.language === language
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                )}
              >
                {language === 'en' ? 'English' : language === 'es' ? 'Español' : language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
