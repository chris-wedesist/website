"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import dynamic from 'next/dynamic';
import { StatsDisplay } from "../components/StatsDisplay";
import { FeatureGrid } from "../components/FeatureGrid";
import { CallToAction } from "../components/CallToAction";
import { HeroSection } from "../components/HeroSection";
import { useTranslation } from "../context/TranslationContext";

const DynamicMap = dynamic(() => import("../components/DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface Incident {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at: string;
  status: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
}

const transformIncidentToLocation = (incident: Incident) => ({
  id: incident.id,
  title: incident.type || 'Unknown Incident Type',
  description: incident.description,
  latitude: incident.latitude,
  longitude: incident.longitude,
  type: 'incident',
  status: incident.status,
  address: incident.address,
  date: incident.created_at
});

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [listLayout, setListLayout] = useState<'list' | 'grid'>('grid');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // const [user, setUser] = useState<{id: string, email: string, name: string} | null>(null);
  const { t } = useTranslation();
  const showAll = false;
  const INITIAL_DISPLAY_COUNT = 6;

  useEffect(() => {
    fetchIncidents();
    getUserLocation();
    // getCurrentUser();
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Get current user
  // const getCurrentUser = async () => {
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (user) {
  //       setUser({
  //         id: user.id,
  //         email: user.email || '',
  //         name: user.user_metadata?.full_name || user.email || 'Anonymous User'
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error getting user:', error);
  //   }
  // };

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "investigating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete incident function - COMMENTED OUT FOR NOW
  // const deleteIncident = async (incidentId: number) => {
  //   if (!user) {
  //     alert('You must be logged in to delete incidents.');
  //     return;
  //   }

  //   if (!confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase
  //       .from("incidents")
  //       .delete()
  //       .eq("id", incidentId)
  //       .eq("user_id", user.id); // Only allow deletion of own incidents

  //     if (error) {
  //       console.error("Error deleting incident:", error);
  //       alert('Failed to delete incident. You can only delete your own incidents.');
  //       return;
  //     }

  //     // Refresh the incidents list
  //     fetchIncidents();
  //     alert('Incident deleted successfully.');
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     alert('An unexpected error occurred. Please try again.');
  //   }
  // };

  const filteredIncidents = incidents.filter(
    incident => filter === "all" || incident.status === filter
  );

  const displayedIncidents = showAll ? filteredIncidents : filteredIncidents.slice(0, INITIAL_DISPLAY_COUNT);
  // const hasMoreIncidents = filteredIncidents.length > INITIAL_DISPLAY_COUNT;

  const incidentStats = [
    {
      value: incidents.length.toString(),
      label: t('incidents.stats.totalReports'),
      icon: "📊",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    ...Object.entries(
      incidents.reduce((acc, incident) => {
        acc[incident.type] = (acc[incident.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({
      value: count.toString(),
      label: type,
      icon: "🚨",
      color: "bg-red-100 dark:bg-red-900/30"
    }))
  ];

  const reportingFeatures = [
    {
      icon: "🔒",
      title: t('incidents.features.anonymous.title'),
      description: t('incidents.features.anonymous.description')
    },
    {
      icon: "📱",
      title: t('incidents.features.mobile.title'),
      description: t('incidents.features.mobile.description')
    },
    {
      icon: "📍",
      title: t('incidents.features.location.title'),
      description: t('incidents.features.location.description')
    },
    {
      icon: "🔔",
      title: t('incidents.features.alerts.title'),
      description: t('incidents.features.alerts.description')
    },
    {
      icon: "📸",
      title: t('incidents.features.media.title'),
      description: t('incidents.features.media.description')
    },
    {
      icon: "👥",
      title: t('incidents.features.updates.title'),
      description: t('incidents.features.updates.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection
        title={t('incidents.hero.title')}
        description={t('incidents.hero.description')}
        imageSrc="/images/incidents/command-center.jpg"
        imageAlt="Community incident reporting and tracking"
      >
        <div className="flex gap-4">
          <motion.a
            href="/incidents/report"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            {t('incidents.hero.reportButton')}
          </motion.a>
        </div>
      </HeroSection>

      {/* Stats Section */}
      <StatsDisplay stats={incidentStats} />

      {/* Reporting Features */}
      <FeatureGrid
        title={t('incidents.features.title')}
        description={t('incidents.features.description')}
        features={reportingFeatures}
        columns={3}
        variant="bordered"
      />

      {/* Incidents Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Title and View All Link */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('incidents.recent.title')}
            </h2>
            <a
              href="/incidents/all"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
            >
              {t('incidents.recent.viewAll')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Controls */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-end gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">{t('incidents.recent.filters.all')}</option>
                  <option value="active">{t('incidents.recent.filters.active')}</option>
                  <option value="resolved">{t('incidents.recent.filters.resolved')}</option>
                  <option value="investigating">{t('incidents.recent.filters.investigating')}</option>
                </select>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('incidents.recent.views.list')}
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 ${
                      viewMode === 'map'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t('incidents.recent.views.map')}
                  </button>
                </div>
                {viewMode === 'list' && (
                  <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                    <button
                      onClick={() => setListLayout('list')}
                      className={`px-4 py-2 ${
                        listLayout === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setListLayout('grid')}
                      className={`px-4 py-2 ${
                        listLayout === 'grid'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : viewMode === 'map' ? (
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <DynamicMap locations={displayedIncidents.map(transformIncidentToLocation)} />
                </div>
              ) : listLayout === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedIncidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {incident.type}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                          {/* DELETE BUTTON COMMENTED OUT FOR NOW */}
                          {/* {user && incident.user_id === user.id && (
                            <button
                              onClick={() => deleteIncident(incident.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete incident"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )} */}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3" title={incident.description}>
                        {incident.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <p className="truncate max-w-[250px]" title={incident.address}>
                          {userLocation ? (
                            <>
                              📏 {calculateDistance(userLocation.lat, userLocation.lng, incident.latitude, incident.longitude).toFixed(1)} km away
                              <br />
                              📍 {incident.address || t('incidents.recent.location')}
                            </>
                          ) : (
                            <>📍 {incident.address || t('incidents.recent.location')}</>
                          )}
                        </p>
                        <p>🕒 {formatDate(incident.created_at)}</p>
                        {incident.user_name && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            👤 Reported by: {incident.user_name}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedIncidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {incident.type}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2" title={incident.description}>
                            {incident.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="truncate max-w-[250px]" title={incident.address}>
                              {userLocation ? (
                                <>
                                  📏 {calculateDistance(userLocation.lat, userLocation.lng, incident.latitude, incident.longitude).toFixed(1)} km away
                                  <br />
                                  📍 {incident.address || t('incidents.recent.location')}
                                </>
                              ) : (
                                <>📍 {incident.address || t('incidents.recent.location')}</>
                              )}
                            </span>
                            <span>🕒 {formatDate(incident.created_at)}</span>
                            {incident.user_name && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                👤 {incident.user_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                          {/* DELETE BUTTON COMMENTED OUT FOR NOW */}
                          {/* {user && incident.user_id === user.id && (
                            <button
                              onClick={() => deleteIncident(incident.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete incident"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )} */}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title={t('incidents.cta.title')}
        description={t('incidents.cta.description')}
        primaryAction={{
          label: t('incidents.cta.primary'),
          href: "#download"
        }}
        secondaryAction={{
          label: t('incidents.cta.secondary'),
          href: "/about"
        }}
        pageType="incidents"
      />
    </div>
  );
} 