"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import dynamic from 'next/dynamic';
import { StatsDisplay } from "../../components/StatsDisplay";
import { useTranslation } from "../../context/TranslationContext";

const DynamicMap = dynamic(() => import("../../components/DynamicMap"), {
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

export default function AllIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [listLayout, setListLayout] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // const [user, setUser] = useState<{id: string, email: string, name: string} | null>(null);
  const itemsPerPage = 12;
  const { t } = useTranslation();

  useEffect(() => {
    fetchIncidents();
    getUserLocation();
    getCurrentUser();
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
  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // setUser({
        //   id: user.id,
        //   email: user.email || '',
        //   name: user.user_metadata?.full_name || user.email || 'Anonymous User'
        // });
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
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

  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === "all" || incident.status === filter;
    const matchesSearch = searchQuery === "" || 
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedIncidents.length / itemsPerPage);
  const paginatedIncidents = sortedIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('incidents.all.title')}
            </h1>
            <a
              href="/incidents"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-2"
            >
              {t('incidents.all.back')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsDisplay stats={incidentStats} />

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Controls */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="text"
                    placeholder={t('incidents.all.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="newest">{t('incidents.all.sort.newest')}</option>
                    <option value="oldest">{t('incidents.all.sort.oldest')}</option>
                    <option value="type">{t('incidents.all.sort.type')}</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="all">{t('incidents.all.filter.all')}</option>
                    <option value="active">{t('incidents.all.filter.active')}</option>
                    <option value="resolved">{t('incidents.all.filter.resolved')}</option>
                    <option value="investigating">{t('incidents.all.filter.investigating')}</option>
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
                      {t('incidents.all.views.list')}
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 ${
                        viewMode === 'map'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t('incidents.all.views.map')}
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
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : viewMode === 'map' ? (
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <DynamicMap locations={paginatedIncidents.map(transformIncidentToLocation)} />
                </div>
              ) : listLayout === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedIncidents.map((incident) => (
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
                              📍 {incident.address || 'Location not specified'}
                            </>
                          ) : (
                            <>📍 {incident.address || 'Location not specified'}</>
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
                  {paginatedIncidents.map((incident) => (
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
                                  📍 {incident.address || 'Location not specified'}
                                </>
                              ) : (
                                <>📍 {incident.address || 'Location not specified'}</>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    {t('incidents.all.previous')}
                  </button>
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('incidents.all.page')} {currentPage} {t('incidents.all.of')} {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    {t('incidents.all.next')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 