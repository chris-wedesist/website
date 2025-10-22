'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Announcement {
  id: string;
  type: 'launch' | 'feature' | 'maintenance' | 'emergency' | 'celebration';
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  dismissible: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate?: string;
  targetAudience?: 'all' | 'new-users' | 'beta-users' | 'registered';
  channels: ('banner' | 'modal' | 'email' | 'push')[];
}

interface AnnouncementSystemProps {
  announcements?: Announcement[];
  position?: 'top' | 'bottom';
  maxVisible?: number;
}

export const AnnouncementSystem: React.FC<AnnouncementSystemProps> = ({
  announcements: customAnnouncements,
  position = 'top',
  maxVisible = 3
}) => {
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Default announcements for demo/launch
  const defaultAnnouncements: Announcement[] = [
    {
      id: 'launch-countdown',
      type: 'launch',
      title: '🚀 DESIST Launch in 2 Weeks!',
      message: 'The official launch is coming September 15th. Be among the first to experience the full platform.',
      ctaText: 'Join Launch List',
      ctaUrl: '/press',
      dismissible: true,
      priority: 'high',
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-15T00:00:00Z',
      targetAudience: 'all',
      channels: ['banner', 'modal']
    },
    {
      id: 'beta-feedback',
      type: 'feature',
      title: '📝 Share Your Beta Experience',
      message: 'Help us improve by sharing your feedback about the beta experience.',
      ctaText: 'Give Feedback',
      ctaUrl: '/support/feedback',
      dismissible: true,
      priority: 'medium',
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-30T00:00:00Z',
      targetAudience: 'beta-users',
      channels: ['banner']
    },
    {
      id: 'new-features',
      type: 'feature',
      title: '✨ New Features Added',
      message: 'Check out our new emergency resources and stealth mode features.',
      ctaText: 'Explore Features',
      ctaUrl: '/features/stealth-mode',
      dismissible: true,
      priority: 'medium',
      startDate: '2025-09-01T00:00:00Z',
      targetAudience: 'registered',
      channels: ['banner']
    },
    {
      id: 'community-milestone',
      type: 'celebration',
      title: '🎉 50,000+ Community Members!',
      message: 'Thank you for helping us build a safer digital world together.',
      dismissible: true,
      priority: 'low',
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-07T00:00:00Z',
      targetAudience: 'all',
      channels: ['banner']
    }
  ];

  const announcements = customAnnouncements || defaultAnnouncements;

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem('dismissed-announcements');
    if (dismissed) {
      setDismissedIds(new Set(JSON.parse(dismissed)));
    }

    // Filter active announcements
    const now = new Date();
    const active = announcements.filter(announcement => {
      const startDate = new Date(announcement.startDate);
      const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
      
      const isActive = now >= startDate && (!endDate || now <= endDate);
      const notDismissed = !dismissedIds.has(announcement.id);
      
      return isActive && notDismissed;
    });

    // Sort by priority and limit to maxVisible
    const sorted = active
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, maxVisible);

    setActiveAnnouncements(sorted);
  }, [announcements, maxVisible, dismissedIds]);

  const handleDismiss = (announcementId: string) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(announcementId);
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissed-announcements', JSON.stringify(Array.from(newDismissed)));

    // Remove from active announcements
    setActiveAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  };

  const getAnnouncementStyles = (type: Announcement['type'], priority: Announcement['priority']) => {
    const baseStyles = "border-l-4";
    
    const typeStyles = {
      launch: "border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20",
      feature: "border-l-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      maintenance: "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      emergency: "border-l-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      celebration: "border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    };

    const priorityStyles = {
      critical: "ring-2 ring-red-500 ring-opacity-50",
      high: "ring-1 ring-blue-500 ring-opacity-30",
      medium: "",
      low: "opacity-90"
    };

    return `${baseStyles} ${typeStyles[type]} ${priorityStyles[priority]}`;
  };

  const getTypeEmoji = (type: Announcement['type']) => {
    const emojis = {
      launch: '🚀',
      feature: '✨',
      maintenance: '🔧',
      emergency: '🚨',
      celebration: '🎉'
    };
    return emojis[type];
  };

  const getPriorityBadge = (priority: Announcement['priority']) => {
    const badges = {
      critical: { text: 'Critical', className: 'bg-red-600 text-white' },
      high: { text: 'Important', className: 'bg-orange-600 text-white' },
      medium: { text: 'Info', className: 'bg-blue-600 text-white' },
      low: { text: 'Update', className: 'bg-gray-600 text-white' }
    };
    return badges[priority];
  };

  if (activeAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className={`fixed ${position === 'top' ? 'top-20' : 'bottom-4'} left-4 right-4 z-40 space-y-2`}>
      <AnimatePresence>
        {activeAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className={`${getAnnouncementStyles(announcement.type, announcement.priority)} shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 mt-0.5">
                    {getTypeEmoji(announcement.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {announcement.title}
                      </h3>
                      <Badge className={getPriorityBadge(announcement.priority).className}>
                        {getPriorityBadge(announcement.priority).text}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {announcement.message}
                    </p>
                    {announcement.ctaText && announcement.ctaUrl && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(announcement.ctaUrl, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                          {announcement.ctaText}
                        </Button>
                      </div>
                    )}
                  </div>
                  {announcement.dismissible && (
                    <button
                      onClick={() => handleDismiss(announcement.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 p-1"
                      aria-label="Dismiss announcement"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing announcements
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => [...prev, announcement]);
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const clearAllAnnouncements = () => {
    setAnnouncements([]);
  };

  // Predefined announcement creators
  const createLaunchAnnouncement = (launchDate: string) => addAnnouncement({
    id: `launch-${Date.now()}`,
    type: 'launch',
    title: '🚀 DESIST is Launching Soon!',
    message: `Get ready for the official launch on ${new Date(launchDate).toLocaleDateString()}`,
    ctaText: 'Join Launch List',
    ctaUrl: '/press',
    dismissible: true,
    priority: 'high',
    startDate: new Date().toISOString(),
    endDate: launchDate,
    targetAudience: 'all',
    channels: ['banner', 'modal']
  });

  const createMaintenanceAnnouncement = (startTime: string, duration: string) => addAnnouncement({
    id: `maintenance-${Date.now()}`,
    type: 'maintenance',
    title: '🔧 Scheduled Maintenance',
    message: `DESIST will undergo maintenance starting ${new Date(startTime).toLocaleString()} for approximately ${duration}`,
    dismissible: true,
    priority: 'medium',
    startDate: new Date().toISOString(),
    endDate: startTime,
    targetAudience: 'all',
    channels: ['banner', 'email']
  });

  const createEmergencyAnnouncement = (message: string) => addAnnouncement({
    id: `emergency-${Date.now()}`,
    type: 'emergency',
    title: '🚨 Important Security Notice',
    message,
    dismissible: false,
    priority: 'critical',
    startDate: new Date().toISOString(),
    targetAudience: 'all',
    channels: ['banner', 'modal', 'email', 'push']
  });

  return {
    announcements,
    addAnnouncement,
    removeAnnouncement,
    clearAllAnnouncements,
    createLaunchAnnouncement,
    createMaintenanceAnnouncement,
    createEmergencyAnnouncement
  };
};
