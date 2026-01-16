'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BadgeShowcase } from '../community/components/BadgeShowcase';
import { useSession } from '@/lib/use-session';
import { signOutAction } from '@/lib/auth-actions';

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
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalBadges: 0,
    communityPosts: 0,
    resourcesShared: 0,
    helpfulVotes: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // Simulate loading user data
    setTimeout(() => {
      if (session?.user) {
        setProfile({
          id: (session.user as any).id || '',
          name: session.user.name || null,
          email: session.user.email || '',
          bio: null,
          location: null,
          pronouns: null,
          isPrivate: false,
          showEmail: false,
          showLocation: false,
          allowMessages: true,
          createdAt: new Date().toISOString(),
        });

        setStats({
          totalBadges: 8,
          communityPosts: 12,
          resourcesShared: 5,
          helpfulVotes: 34,
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOutAction();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'badges', label: 'Badges & Achievements', icon: '🏆' },
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
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
                Welcome back, {profile?.name || session?.user?.name || 'User'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="hidden sm:inline-flex"
              >
                Back to Site
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {(profile?.name || session?.user?.name || 'U')[0].toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {profile?.name || session?.user?.name || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member since {new Date(profile?.createdAt || Date.now()).getFullYear()}
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
              </CardContent>
            </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.totalBadges}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Badges Earned
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats.communityPosts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Community Posts
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.resourcesShared}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Resources Shared
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {stats.helpfulVotes}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Helpful Votes
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Activity
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Earned badge', item: 'Community Helper', time: '2 hours ago', type: 'badge' },
                        { action: 'Posted in', item: 'Workplace Support Forum', time: '1 day ago', type: 'post' },
                        { action: 'Downloaded', item: 'Digital Safety Toolkit', time: '3 days ago', type: 'download' },
                        { action: 'Earned badge', item: 'First Post', time: '1 week ago', type: 'badge' },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 py-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            activity.type === 'badge' ? 'bg-yellow-500' :
                            activity.type === 'post' ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            {activity.type === 'badge' ? '🏆' : activity.type === 'post' ? '💬' : '📥'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {activity.action} <span className="font-medium">{activity.item}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Badges & Achievements
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Track your progress and showcase your achievements in the DESIST community.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <BadgeShowcase badges={[]} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage your personal information and how others see you in the community.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            defaultValue={profile?.name || ''}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pronouns
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
                          Bio
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
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue={profile?.location || ''}
                          placeholder="City, State/Country"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button className="px-6 py-2">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Privacy & Security Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Control your privacy and who can see your information.
                    </p>
                  </CardHeader>
                  <CardContent>
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
                              Make my profile visible to other community members
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.showEmail}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Show my email address on my profile
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.showLocation}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Show my location on my profile
                            </span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked={profile?.allowMessages}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Allow other members to send me messages
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Account Security</h4>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full sm:w-auto">
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full sm:w-auto">
                            Enable Two-Factor Authentication
                          </Button>
                          <Button variant="outline" className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20">
                            Delete Account
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="px-6 py-2">
                          Save Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
