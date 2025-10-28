"use client";
import { motion } from "framer-motion";
import { AppDownloadCTA } from "../components/AppDownloadCTA";
import { HeroSection } from "../components/HeroSection";
import { ResourceCard } from "./components/ResourceCard";
import { ResourceFilters } from "./components/ResourceFilters";
import { useTranslation } from "../context/TranslationContext";
import { useState, useMemo } from "react";

export default function ResourcesPage() {
  const { t } = useTranslation();

  // Sample resource data
  const sampleResources = useMemo(() => [
    {
      id: '1',
      title: 'Workplace Harassment Prevention Guide',
      description: 'A comprehensive guide covering identification, prevention, and reporting of workplace harassment.',
      type: 'guide' as const,
      category: 'workplace',
      tags: ['harassment', 'prevention', 'legal'],
      author: 'DESIST Legal Team',
      publishedAt: '2025-08-15',
      readTime: 15,
      thumbnail: '/images/placeholder-image.png',
      featured: true,
      difficulty: 'beginner' as const,
      language: 'en',
      stats: {
        views: 1250,
        downloads: 340,
        ratings: 23,
        avgRating: 4.8,
      },
    },
    {
      id: '2',
      title: 'Digital Safety Toolkit',
      description: 'Essential tools and strategies for protecting yourself online and in digital spaces.',
      type: 'toolkit' as const,
      category: 'digital-safety',
      tags: ['digital', 'privacy', 'online'],
      author: 'CyberSafe Collective',
      publishedAt: '2025-08-10',
      readTime: 25,
      downloadUrl: '/downloads/digital-safety-toolkit.pdf',
      thumbnail: '/images/placeholder-image.png',
      featured: true,
      difficulty: 'intermediate' as const,
      language: 'en',
      stats: {
        views: 890,
        downloads: 450,
        ratings: 18,
        avgRating: 4.6,
      },
    },
    {
      id: '3',
      title: 'Understanding Your Rights',
      description: 'Know your legal rights and protections against harassment with state-by-state breakdowns.',
      type: 'article' as const,
      category: 'legal',
      tags: ['rights', 'legal', 'protection'],
      author: 'Legal Aid Society',
      publishedAt: '2025-08-05',
      readTime: 12,
      thumbnail: '/images/placeholder-image.png',
      featured: false,
      difficulty: 'beginner' as const,
      language: 'en',
      stats: {
        views: 2100,
        downloads: 0,
        ratings: 31,
        avgRating: 4.7,
      },
    },
    {
      id: '4',
      title: 'Cómo Denunciar el Acoso (Spanish)',
      description: 'Guía completa sobre cómo identificar y denunciar casos de acoso en español.',
      type: 'guide' as const,
      category: 'reporting',
      tags: ['spanish', 'reporting', 'resources'],
      author: 'Equipo DESIST',
      publishedAt: '2025-07-28',
      readTime: 18,
      thumbnail: '/images/placeholder-image.png',
      featured: false,
      difficulty: 'beginner' as const,
      language: 'es',
      stats: {
        views: 650,
        downloads: 120,
        ratings: 15,
        avgRating: 4.9,
      },
    },
    {
      id: '5',
      title: 'Community Support Networks',
      description: 'Build and leverage community support systems for harassment prevention.',
      type: 'video' as const,
      category: 'community',
      tags: ['community', 'support', 'networks'],
      author: 'Community Organizers',
      publishedAt: '2025-07-20',
      readTime: 30,
      thumbnail: '/images/placeholder-image.png',
      featured: false,
      difficulty: 'advanced' as const,
      language: 'en',
      stats: {
        views: 1800,
        downloads: 0,
        ratings: 25,
        avgRating: 4.5,
      },
    },
    {
      id: '6',
      title: 'Emergency Response Checklist',
      description: 'Quick reference for immediate response to harassment incidents and safety protocols.',
      type: 'document' as const,
      category: 'emergency',
      tags: ['emergency', 'checklist', 'safety'],
      author: 'Safety First Initiative',
      publishedAt: '2025-07-15',
      downloadUrl: '/downloads/emergency-checklist.pdf',
      thumbnail: '/images/placeholder-image.png',
      featured: true,
      difficulty: 'beginner' as const,
      language: 'en',
      stats: {
        views: 950,
        downloads: 780,
        ratings: 42,
        avgRating: 4.9,
      },
    },
  ], []);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<{
    type?: string;
    category?: string;
    difficulty?: string;
    language?: string;
    searchQuery?: string;
  }>({});

  // Filter options
  const filterOptions = {
    types: ['article', 'guide', 'video', 'document', 'toolkit'],
    categories: ['workplace', 'digital-safety', 'legal', 'reporting', 'community', 'emergency'],
    difficulties: ['beginner', 'intermediate', 'advanced'],
    languages: ['en', 'es'],
  };

  // Filter resources based on active filters
  const filteredResources = useMemo(() => {
    return sampleResources.filter(resource => {
      if (activeFilters.type && resource.type !== activeFilters.type) return false;
      if (activeFilters.category && resource.category !== activeFilters.category) return false;
      if (activeFilters.difficulty && resource.difficulty !== activeFilters.difficulty) return false;
      if (activeFilters.language && resource.language !== activeFilters.language) return false;
      if (activeFilters.searchQuery) {
        const query = activeFilters.searchQuery.toLowerCase();
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [activeFilters, sampleResources]);

  const handleFilterChange = (filterType: string, value: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearchChange = (query: string) => {
    setActiveFilters(prev => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const featuredResources = sampleResources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection
        title={t('resources.hero.title')}
        description={t('resources.hero.description')}
        imageSrc="/images/community/events/workshop.jpg"
        imageAlt="Community education and resource sharing workshop"
      />

      {/* Resource Categories */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '📚',
                  title: t('resources.categories.educational.title'),
                  items: [
                    t('resources.categories.educational.items.harassment'),
                    t('resources.categories.educational.items.warning'),
                    t('resources.categories.educational.items.prevention'),
                  ],
                },
                {
                  icon: '⚖️',
                  title: t('resources.categories.legal.title'),
                  items: [
                    t('resources.categories.legal.items.rights'),
                    t('resources.categories.legal.items.assistance'),
                    t('resources.categories.legal.items.documentation'),
                  ],
                },
                {
                  icon: '🤝',
                  title: t('resources.categories.support.title'),
                  items: [
                    t('resources.categories.support.items.groups'),
                    t('resources.categories.support.items.counseling'),
                    t('resources.categories.support.items.events'),
                  ],
                },
              ].map((category, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                  <ul className="space-y-2 mb-4">
                    {category.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Featured Resources
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Hand-picked resources to help you get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Resources with Filters */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Resource Library
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                Browse our complete collection of guides, tools, and educational materials
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <ResourceFilters
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
              />
            </div>

            {/* Resources Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Resources ({filteredResources.length})
                </h3>
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    No resources found matching your criteria
                  </div>
                  <button
                    onClick={() => setActiveFilters({})}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {t('resources.mobile.title')}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('resources.mobile.description')}
            </p>
            <AppDownloadCTA />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
