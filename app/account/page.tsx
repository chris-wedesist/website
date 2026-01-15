/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BadgeShowcase } from '../community/components/BadgeShowcase';
import supabase from '../../utils/supabase';
import { useTranslation } from '../context/TranslationContext';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  location: string | null;
  pronouns: string | null;
  isPrivate: boolean;
  showEmail: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  createdAt: string;
}

interface UserStats {
  totalBadges: number;
  communityPosts: number;
  resourcesShared: number;
  helpfulVotes: number;
  incidentReports: number;
}

interface IncidentReport {
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

export default function AccountPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalBadges: 0,
    communityPosts: 0,
    resourcesShared: 0,
    helpfulVotes: 0,
    incidentReports: 0,
  });
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }

        setUser(user);

        // Load user profile data
        setProfile({
          id: user.id,
          name: user.user_metadata?.full_name || user.email || null,
          email: user.email || '',
          bio: null,
          location: null,
          pronouns: null,
          isPrivate: false,
          showEmail: false,
          showLocation: false,
          allowMessages: true,
          createdAt: user.created_at || new Date().toISOString(),
        });

        // Fetch all user data from database
        const fetchUserData = async () => {
          try {
            // Fetch user's incident reports
            const { data: incidents, error: incidentsError } = await supabase
              .from('incidents')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (incidentsError) throw incidentsError;

            // Fetch user's community posts
            const { data: posts, error: postsError } = await supabase
              .from('posts')
              .select('*')
              .eq('user_id', user.id);

            if (postsError) throw postsError;

            // Fetch user's post likes (helpful votes)
            const { data: likes, error: likesError } = await supabase
              .from('post_likes')
              .select('*')
              .eq('user_id', user.id);

            if (likesError) throw likesError;

            // Fetch user's comments (as resources shared)
            const { data: comments, error: commentsError } = await supabase
              .from('post_comments')
              .select('*')
              .eq('user_id', user.id);

            if (commentsError) throw commentsError;

            setIncidentReports(incidents || []);
            
            // Create recent activity from all user data
            const activities: any[] = [];
            
            // Add recent posts
            if (posts && posts.length > 0) {
              posts.slice(0, 2).forEach(post => {
                activities.push({
                  action: 'Posted in',
                  item: post.title,
                  time: new Date(post.created_at).toLocaleDateString(),
                  type: 'post',
                  timestamp: new Date(post.created_at).getTime()
                });
              });
            }
            
            // Add recent incidents
            if (incidents && incidents.length > 0) {
              incidents.slice(0, 2).forEach(incident => {
                activities.push({
                  action: 'Reported incident',
                  item: incident.type,
                  time: new Date(incident.created_at).toLocaleDateString(),
                  type: 'incident',
                  timestamp: new Date(incident.created_at).getTime()
                });
              });
            }
            
            // Add recent comments
            if (comments && comments.length > 0) {
              comments.slice(0, 1).forEach(comment => {
                activities.push({
                  action: 'Commented on',
                  item: 'Community Post',
                  time: new Date(comment.created_at).toLocaleDateString(),
                  type: 'comment',
                  timestamp: new Date(comment.created_at).getTime()
                });
              });
            }
            
            // Sort by timestamp and take the most recent 4
            activities.sort((a, b) => b.timestamp - a.timestamp);
            setRecentActivity(activities.slice(0, 4));
            
            // Update stats with real data
            setStats({
              totalBadges: 0, // Badges system not implemented yet
              communityPosts: posts?.length || 0,
              resourcesShared: comments?.length || 0, // Using comments as resources shared
              helpfulVotes: likes?.length || 0,
              incidentReports: incidents?.length || 0,
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setIncidentReports([]);
            setRecentActivity([]);
            setStats({
              totalBadges: 0,
              communityPosts: 0,
              resourcesShared: 0,
              helpfulVotes: 0,
              incidentReports: 0,
            });
          }
        };

        fetchUserData();
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting user:', error);
        router.push('/auth/login');
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      alert('You must be logged in to delete your account.');
      return;
    }

    if (deleteConfirmation !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeleting(true);

    try {
      console.log('Starting account deletion process...');

      // Step 1: Delete all user-related data from all tables
      const userId = user.id;

      // Delete incident reports
      const { error: incidentsError } = await supabase
        .from('incidents')
        .delete()
        .eq('user_id', userId);

      if (incidentsError) {
        console.error('Error deleting incidents:', incidentsError);
        throw new Error('Failed to delete incident reports');
      }

      // Delete community posts
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', userId);

      if (postsError) {
        console.error('Error deleting posts:', postsError);
        throw new Error('Failed to delete community posts');
      }

      // Delete post comments
      const { error: commentsError } = await supabase
        .from('post_comments')
        .delete()
        .eq('user_id', userId);

      if (commentsError) {
        console.error('Error deleting comments:', commentsError);
        throw new Error('Failed to delete comments');
      }

      // Delete post likes
      const { error: likesError } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', userId);

      if (likesError) {
        console.error('Error deleting likes:', likesError);
        throw new Error('Failed to delete likes');
      }

      // Delete user profile from custom users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) {
        console.error('Error deleting user profile:', userError);
        // Don't throw error here as user might not exist in custom table
      }

      // Step 2: Sign out the user (this removes the session)
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error('Error signing out:', signOutError);
        // Continue anyway as data is already deleted
      }

      console.log('Account deletion completed successfully');

      // Step 3: Clear local storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      alert('All your data has been permanently deleted and you have been signed out. Your account is no longer accessible.');
      router.push('/');

    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
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
  //     const { data: incidents, error: incidentsError } = await supabase
  //       .from('incidents')
  //       .select('*')
  //       .eq('user_id', user.id)
  //       .order('created_at', { ascending: false });

  //     if (incidentsError) throw incidentsError;
  //     setIncidentReports(incidents || []);
      
  //     // Update stats
  //     setStats(prev => ({
  //       ...prev,
  //       incidentReports: incidents?.length || 0
  //     }));

  //     alert('Incident deleted successfully.');
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     alert('An unexpected error occurred. Please try again.');
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('account.loading')}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: t('account.tabs.dashboard'), icon: '📊' },
    { id: 'incidents', label: t('account.tabs.incidents'), icon: '🚨' },
    { id: 'badges', label: t('account.tabs.badges'), icon: '🏆' },
    { id: 'profile', label: t('account.tabs.profile'), icon: '👤' },
    { id: 'privacy', label: t('account.tabs.privacy'), icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {profile?.name || user?.user_metadata?.full_name || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t('account.header.backToSite')}
              </button>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t('account.header.signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {(profile?.name || user?.user_metadata?.full_name || 'U')[0].toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {profile?.name || user?.user_metadata?.full_name || t('account.sidebar.anonymousUser')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('account.sidebar.memberSince').replace('{year}', new Date(profile?.createdAt || Date.now()).getFullYear().toString())}
                  </p>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalBadges}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Badges Earned
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.communityPosts}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('account.dashboard.communityPosts')}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.resourcesShared}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('account.dashboard.resourcesShared')}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.helpfulVotes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Helpful Votes
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {stats.incidentReports}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t('account.dashboard.incidentReports')}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('account.dashboard.recentActivity.title')}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivity.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-4xl mb-4">📊</div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {t('account.dashboard.recentActivity.none')}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {t('account.dashboard.recentActivity.startEngaging')}
                          </p>
                        </div>
                      ) : (
                        recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 py-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                              activity.type === 'badge' ? 'bg-yellow-500' :
                              activity.type === 'post' ? 'bg-blue-500' :
                              activity.type === 'incident' ? 'bg-red-500' :
                              activity.type === 'comment' ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {activity.type === 'badge' ? '🏆' : 
                               activity.type === 'post' ? '💬' : 
                               activity.type === 'incident' ? '🚨' :
                               activity.type === 'comment' ? '💭' : '📊'}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {activity.action} <span className="font-medium">{activity.item}</span>
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'incidents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Incident Reports Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('account.incidents.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('account.incidents.description')}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {incidentReports.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-6xl mb-4">🚨</div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Incident Reports Yet
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You haven&apos;t submitted any incident reports yet.
                          </p>
                          <button
                            onClick={() => router.push('/incidents/report')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Report an Incident
                          </button>
                        </div>
                      ) : (
                        incidentReports.map((report) => {
                          const getStatusLabel = (status: string) => {
                            const statusKey = status.toLowerCase().replace(' ', '_');
                            return t(`account.incidents.status.${statusKey}`) || status.charAt(0).toUpperCase() + status.slice(1);
                          };

                          const statusColors: { [key: string]: string } = {
                            active: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                            investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                            resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                            closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
                            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                            under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          };
                          
                          // Parse description if it's a JSON object
                          const parseDescription = (desc: string | any): string => {
                            if (typeof desc === 'string') {
                              try {
                                const parsed = JSON.parse(desc);
                                if (typeof parsed === 'object' && parsed !== null) {
                                  // Format as key-value pairs
                                  return Object.entries(parsed)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join('\n');
                                }
                              } catch {
                                // Not JSON, return as is
                              }
                            } else if (typeof desc === 'object' && desc !== null) {
                              // Already an object, format it
                              return Object.entries(desc)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n');
                            }
                            return String(desc || '');
                          };

                          const formattedDescription = parseDescription(report.description);

                          return (
                            <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {report.type || t('account.incidents.title')}
                                </h4>
                                <div className="flex gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status.toLowerCase()] || statusColors.closed}`}>
                                    {getStatusLabel(report.status)}
                                  </span>
                                  {/* DELETE BUTTON COMMENTED OUT FOR NOW */}
                                  {/* <button
                                    onClick={() => deleteIncident(report.id)}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete incident"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button> */}
                                </div>
                              </div>
                              
                              {formattedDescription && (
                                <div className="text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-line text-sm">
                                  {formattedDescription.split('\n').map((line, idx) => (
                                    <div key={idx} className="mb-1">
                                      {line}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>📍 {report.address || t('account.incidents.locationNotSpecified')}</span>
                                <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('account.badges.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('account.badges.description')}
                    </p>
                  </div>
                  <div className="p-6">
                    <BadgeShowcase badges={[]} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('account.profile.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your personal information and how others see you in the community.
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('account.profile.name')}
                          </label>
                          <input
                            type="text"
                            defaultValue={profile?.name || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('account.profile.pronouns')}
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                            <option value="">Select pronouns</option>
                            <option value="they/them">they/them</option>
                            <option value="she/her">she/her</option>
                            <option value="he/him">he/him</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('account.profile.bio')}
                        </label>
                        <textarea
                          rows={3}
                          defaultValue={profile?.bio || ''}
                          placeholder="Tell the community a bit about yourself..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('account.profile.location')}
                        </label>
                        <input
                          type="text"
                          defaultValue={profile?.location || ''}
                          placeholder="City, State/Country"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {t('account.profile.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('account.privacy.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Control your privacy and who can see your information.
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                        
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={!profile?.isPrivate}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {t('account.privacy.privateProfile')}
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.showEmail}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {t('account.privacy.showEmail')}
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.showLocation}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {t('account.privacy.showLocation')}
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.allowMessages}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {t('account.privacy.allowMessages')}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Account Security</h4>
                        <div className="space-y-3">
                          <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                            Change Password
                          </button>
                          {/* <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 ml-4">
                            Enable Two-Factor Authentication
                          </button> */}
                          <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 ml-4"
                          >
                            {t('account.privacy.deleteAccount')}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Save Privacy Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('account.privacy.deleteAccount')}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('account.privacy.deleteDescription')}
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">{t('account.privacy.deleteWarning')}</h4>
                <ul className="text-sm text-red-700 dark:text-red-400 text-left space-y-1">
                  <li>• All incident reports ({stats.incidentReports})</li>
                  <li>• All community posts ({stats.communityPosts})</li>
                  <li>• All comments and interactions ({stats.resourcesShared})</li>
                  <li>• All likes and votes ({stats.helpfulVotes})</li>
                  <li>• Your profile and account information</li>
                  <li>• All associated data and preferences</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('account.privacy.deleteConfirm')}
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={t('account.privacy.deletePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {t('account.privacy.cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('account.privacy.deleting')}
                    </div>
                  ) : (
                    t('account.privacy.deleteButton')
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}