"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { HeroSection } from "../../components/HeroSection";
import { useAttorneys } from "../../context/AttorneysContext";

const practiceAreas = [
  "General Practice",
  "Criminal Law",
  "Family Law", 
  "Corporate Law",
  "Property Law",
  "Immigration Law",
  "Tax Law",
  "Labor Law",
  "Banking Law",
  "Constitutional Law",
  "Civil Law",
  "Commercial Law",
  "Real Estate Law",
  "Personal Injury",
  "Estate Planning",
  "Bankruptcy Law",
  "Employment Law",
  "Intellectual Property"
];

const MAX_ADDRESS_LENGTH = 30;
const MAX_NAME_LENGTH = 25;

const truncateAddress = (address: string) => {
  if (address.length <= MAX_ADDRESS_LENGTH) return address;
  return address.substring(0, MAX_ADDRESS_LENGTH) + '...';
};

const truncateName = (name: string) => {
  if (name.length <= MAX_NAME_LENGTH) return name;
  return name.substring(0, MAX_NAME_LENGTH) + '...';
};

export default function AllAttorneysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { attorneys, loading, error } = useAttorneys();

  const specializations = practiceAreas;
  const locations = Array.from(new Set(attorneys.map(a => a.location)));

  const filteredAttorneys = attorneys.filter(attorney => {
    // Handle specialization as array
    const specializationText = Array.isArray(attorney.specialization) 
      ? attorney.specialization.join(' ') 
      : attorney.specialization || '';
    
    const matchesSearch = attorney.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         specializationText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (attorney.practiceAreas && attorney.practiceAreas.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location Access Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please enable location access to find attorneys near you. This helps us provide the most relevant legal assistance in your area.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection
        title="Find Attorneys"
        description="Browse our network of qualified attorneys ready to help you with your legal needs."
        imageSrc="/images/legal/legal-team.jpg"
        imageAlt="Legal professionals working together to provide justice"
      />

      {/* Search and Filter Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredAttorneys.length} attorneys
            </div>
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${
                  viewMode === 'grid'
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
                className={`px-4 py-2 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Attorneys Grid/List */}
          {filteredAttorneys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No attorneys found matching your criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAttorneys.map((attorney) => (
                <motion.div
                  key={attorney.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative ${
                    attorney.featured 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30' 
                      : 'bg-white dark:bg-gray-800'
                  } rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    attorney.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}
                >
                  {attorney.featured && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                      Featured
                    </div>
                  )}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className={`text-xl font-semibold ${
                          attorney.featured 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {truncateName(attorney.name)}
                        </h3>
                        <p className={`${
                          attorney.featured 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {Array.isArray(attorney.specialization) 
                            ? attorney.specialization.join(', ') 
                            : attorney.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        <span className={`${
                          attorney.featured 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {attorney.rating} Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`${
                          attorney.featured 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-700 dark:text-gray-300'
                          } ${attorney.detailedLocation.length > MAX_ADDRESS_LENGTH ? 'text-sm' : ''}`}>
                            📍 {truncateAddress(attorney.detailedLocation)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`${
                          attorney.featured 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {attorney.cases}+ cases handled
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {attorney.languages.map((lang) => (
                        <span
                          key={lang}
                          className={`px-3 py-1 rounded-full text-sm ${
                            attorney.featured
                              ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <button className={`w-full py-2 rounded-lg transition-colors mt-auto ${
                      attorney.featured
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      Contact Attorney
                    </button>
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
                  className={`relative ${
                    attorney.featured 
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30' 
                      : 'bg-white dark:bg-gray-700'
                  } rounded-xl shadow-lg p-6 ${
                    attorney.featured ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}
                >
                  {attorney.featured && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                      Featured
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-grow">
                        <h3 className={`text-xl font-semibold ${
                          attorney.featured 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {truncateName(attorney.name)}
                        </h3>
                        <p className={`${
                          attorney.featured 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {Array.isArray(attorney.specialization) 
                            ? attorney.specialization.join(', ') 
                            : attorney.specialization}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className={`${
                            attorney.featured 
                              ? 'text-blue-900 dark:text-blue-100' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {attorney.rating}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className={`${
                            attorney.featured 
                              ? 'text-blue-900 dark:text-blue-100' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {attorney.cases}+ cases
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className={`${
                            attorney.featured 
                              ? 'text-blue-900 dark:text-blue-100' 
                              : 'text-gray-700 dark:text-gray-300'
                            } ${attorney.detailedLocation.length > MAX_ADDRESS_LENGTH ? 'text-sm' : ''}`}>
                              📍 {truncateAddress(attorney.detailedLocation)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {attorney.languages.map((lang) => (
                        <span
                          key={lang}
                          className={`px-3 py-1 rounded-full text-sm ${
                            attorney.featured
                              ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                    <button className={`w-full py-2 rounded-lg transition-colors ${
                      attorney.featured
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      Contact Attorney
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 
