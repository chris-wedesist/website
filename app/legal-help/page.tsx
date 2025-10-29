"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { StatsDisplay } from "../components/StatsDisplay";
import { CallToAction } from "../components/CallToAction";
import { FeatureGrid } from "../components/FeatureGrid";
import { HeroSection } from "../components/HeroSection";
import { useTranslation } from "../context/TranslationContext";
import { useAttorneys } from "../context/AttorneysContext";


// Sample data for demonstration
const practiceAreas = [
  "Civil Rights Law",
  "Immigration Law",
  "Constitutional Law",
  "Police Misconduct",
  "Discrimination Law",
  "Asylum & Refugee Law",
  "First Amendment Rights",
  "Employment Discrimination",
  "Housing Discrimination",
  "Education Law",
  "Disability Rights",
  "LGBTQ+ Rights",
  "Women's Rights",
  "Racial Justice",
  "Criminal Justice Reform",
  "Environmental Justice",
];

const MAX_NAME_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 80;

const truncateName = (name: string) => {
  if (name.length <= MAX_NAME_LENGTH) return name;
  return name.substring(0, MAX_NAME_LENGTH) + '...';
};

const truncateAddress = (address: string) => {
  if (address.length <= MAX_ADDRESS_LENGTH) return address;
  return address.substring(0, MAX_ADDRESS_LENGTH) + '...';
};

export default function LegalHelpPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { attorneys, loading, setLoading, error, setError, fetchAttorneys } = useAttorneys();
  const { t } = useTranslation();
  // const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Removed duplicate fetchAttorneys - AttorneysContext handles all data fetching

  // Removed duplicate location initialization - AttorneysContext handles this

  const filteredAttorneys = attorneys.filter(attorney => {
    const specializationText = Array.isArray(attorney.specialization) 
      ? attorney.specialization.join(' ') 
      : attorney.specialization || '';
    
    const matchesSearch = attorney.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specializationText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
      (Array.isArray(attorney.specialization) 
        ? attorney.specialization.includes(selectedSpecialization)
        : attorney.specialization === selectedSpecialization);
    const matchesLocation = !selectedLocation || attorney.location === selectedLocation;

    return matchesSearch && matchesSpecialization && matchesLocation;
  }).sort((a, b) => {
    // First sort by featured status
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    // Then sort by rating
    return b.rating - a.rating;
  });

  const locations = Array.from(new Set(attorneys.map(a => a.location)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('legalHelp.attorneys.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                  });
                });
                const { latitude: lat, longitude: lng } = position.coords;
                await fetchAttorneys(lat, lng);
              } catch (error) {
                console.error('Retry location error:', error);
                setError(t('legalHelp.attorneys.error'));
                setLoading(false);
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('legalHelp.attorneys.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection
        title={t('legalHelp.hero.title')}
        description={t('legalHelp.hero.description')}
        imageSrc="/images/legal/legal-team.jpg"
        imageAlt="Legal professionals working together to provide justice"
      />

      {/* Stats Section */}
      <StatsDisplay stats={[]} />

      {/* Legal Services */}
      <FeatureGrid
        title={t('legalHelp.features.title')}
        description={t('legalHelp.features.description')}
        features={[]}
        columns={3}
        variant="bordered"
      />

      {/* Featured Attorneys */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legalHelp.attorneys.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('legalHelp.attorneys.description')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 ${viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 ${viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <motion.a
                href="/legal-help/attorneys"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
              >
                {t('legalHelp.attorneys.viewAll')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder={t('legalHelp.attorneys.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{t('legalHelp.attorneys.filter.all')}</option>
                  {practiceAreas.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{t('legalHelp.attorneys.filter.all')}</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Attorneys Grid/List */}
          {filteredAttorneys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">{t('legalHelp.attorneys.noResults')}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAttorneys.map((attorney) => (
                <motion.div
                  key={attorney.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative ${attorney.featured
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                      : 'bg-white dark:bg-gray-800'
                    } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${attorney.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                >
                  {attorney.featured && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                      {t('legalHelp.attorneys.featured')}
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className={`text-xl font-semibold ${attorney.featured
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                        }`}>
                        {truncateName(attorney.name)}
                      </h3>
                      <p className={`${attorney.featured
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        {Array.isArray(attorney.specialization) 
                          ? attorney.specialization.join(', ') 
                          : attorney.specialization}
                      </p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className={`${attorney.featured
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                           {attorney.rating.toFixed(2)} Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`${attorney.featured
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-700 dark:text-gray-300'
                          }`}>
                          📍 {truncateAddress(attorney.detailedLocation)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button className={`w-full py-2 rounded-lg transition-colors ${attorney.featured
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}>
                        {t('legalHelp.attorneys.contact')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredAttorneys.map((attorney) => (
                <motion.div
                  key={attorney.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative ${attorney.featured
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                      : 'bg-white dark:bg-gray-700'
                    } rounded-xl shadow-lg p-6 ${attorney.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                    }`}
                >
                  {attorney.featured && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                      {t('legalHelp.attorneys.featured')}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${attorney.featured
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600'
                        }`}>
                        <span className="text-2xl">👨‍⚖️</span>
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${attorney.featured
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-white'
                          }`}>
                          {attorney.name}
                        </h3>
                        <p className={`${attorney.featured
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400'
                          }`}>
                          {Array.isArray(attorney.specialization) 
                            ? attorney.specialization.join(', ') 
                            : attorney.specialization}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className={`${attorney.featured
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {attorney.rating}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className={`${attorney.featured
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            {attorney.cases}+ cases
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className={`${attorney.featured
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-700 dark:text-gray-300'
                            }`}>
                            📍 {attorney.detailedLocation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className={`px-6 py-2 rounded-lg transition-colors ${attorney.featured
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}>
                      Contact
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action for Attorneys */}
      <CallToAction
        title={t('legalHelp.cta.title')}
        description={t('legalHelp.cta.description')}
        primaryAction={{
          label: t('legalHelp.cta.primary'),
          href: "mailto:admin@wedesist.com"
        }}
        secondaryAction={{
          label: t('legalHelp.cta.secondary'),
          href: "/legal-help/join"
        }}
      />
    </div>
  );
} 
