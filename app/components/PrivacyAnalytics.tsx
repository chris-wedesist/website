'use client';

import { useEffect, useState } from 'react';

interface AnalyticsConfig {
  plausibleDomain?: string;
  fathomSiteId?: string;
  respectDNT?: boolean;
}

declare global {
  interface Window {
    plausible?: (...args: unknown[]) => void;
    fathom?: {
      trackGoal: (id: string, value?: number) => void;
    };
  }
}

export const PrivacyAnalytics: React.FC<AnalyticsConfig> = ({
  plausibleDomain,
  fathomSiteId,
  respectDNT = true
}) => {
  useEffect(() => {
    // Check if Do Not Track is enabled
    if (respectDNT && navigator.doNotTrack === '1') {
      console.log('Analytics disabled: Do Not Track enabled');
      return;
    }

    // Load Plausible Analytics if configured
    if (plausibleDomain) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://plausible.io/js/script.js';
      script.setAttribute('data-domain', plausibleDomain);
      document.head.appendChild(script);
    }

    // Load Fathom Analytics if configured
    if (fathomSiteId) {
      const script = document.createElement('script');
      script.src = 'https://cdn.usefathom.com/script.js';
      script.setAttribute('data-site', fathomSiteId);
      script.setAttribute('defer', '');
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup scripts if component unmounts
      const scripts = document.querySelectorAll('script[src*="plausible"], script[src*="fathom"]');
      scripts.forEach(script => script.remove());
    };
  }, [plausibleDomain, fathomSiteId, respectDNT]);

  return null; // This component doesn't render anything
};

// Analytics utility functions
export const trackEvent = (event: string, properties?: Record<string, string | number>) => {
  // Check if Do Not Track is enabled
  if (navigator.doNotTrack === '1') {
    return;
  }

  // Track with Plausible
  if (window.plausible) {
    window.plausible(event, { props: properties });
  }

  // Track with Fathom (goal-based)
  if (window.fathom && typeof properties?.goalId === 'string') {
    window.fathom.trackGoal(properties.goalId, properties.value as number);
  }

  // Log for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event, properties);
  }
};

// Predefined event helpers
export const analytics = {
  // User engagement
  pageView: (page: string) => trackEvent('pageview', { page }),
  signup: (method: string) => trackEvent('signup', { method }),
  login: (method: string) => trackEvent('login', { method }),
  
  // Community actions
  joinCommunity: () => trackEvent('community_join'),
  postMessage: (category: string) => trackEvent('post_message', { category }),
  giveBadge: (badgeType: string) => trackEvent('give_badge', { badge: badgeType }),
  
  // Safety features
  useEmergencyResources: () => trackEvent('emergency_resources'),
  activateStealth: () => trackEvent('stealth_mode_activated'),
  reportHarassment: (type: string) => trackEvent('report_harassment', { type }),
  
  // Engagement
  newsletterSignup: (interests: string[]) => trackEvent('newsletter_signup', { 
    interests: interests.join(','),
    count: interests.length 
  }),
  downloadApp: (platform: string) => trackEvent('app_download', { platform }),
  shareContent: (type: string, method: string) => trackEvent('content_share', { type, method }),
  
  // Campaigns and challenges
  joinCampaign: (campaignId: string) => trackEvent('campaign_join', { campaign: campaignId }),
  completeChallenge: (challengeId: string, points: number) => trackEvent('challenge_complete', { 
    challenge: challengeId, 
    points 
  }),
  
  // Feedback and support
  submitFeedback: (type: string, priority: string) => trackEvent('feedback_submit', { type, priority }),
  useHelpDesk: (category: string) => trackEvent('help_desk_use', { category }),
  
  // Press and media
  pressKitDownload: (asset: string) => trackEvent('press_kit_download', { asset }),
  mediaContact: (method: string) => trackEvent('media_contact', { method }),
};

// Privacy-compliant session tracking
export const useSessionTracking = () => {
  useEffect(() => {
    const sessionStart = Date.now();
    const startPage = window.location.pathname;

    // Track session start
    analytics.pageView(startPage);

    // Track session duration on page unload
    const handleUnload = () => {
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      trackEvent('session_end', { 
        duration, 
        pages_visited: sessionStorage.getItem('pages_visited') || '1',
        start_page: startPage 
      });
    };

    // Track page navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentPages = parseInt(sessionStorage.getItem('pages_visited') || '0');
        sessionStorage.setItem('pages_visited', String(currentPages + 1));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

// Component for analytics consent banner
export const AnalyticsConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    localStorage.setItem('analytics-consent', String(consent));
    setShowBanner(false);

    if (consent) {
      trackEvent('analytics_consent_granted');
    } else {
      trackEvent('analytics_consent_declined');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            🍪 We use privacy-friendly analytics to improve your experience. 
            No personal data is collected or shared.{' '}
            <a href="/cookies" className="underline hover:text-blue-600 dark:hover:text-blue-400">
              Read our Cookie Policy
            </a>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleConsent(false)}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Decline
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
