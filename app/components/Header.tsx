"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useCallback, memo, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "../context/TranslationContext";
import supabase from "../../utils/supabase";
import { LaunchCountdown } from "./LaunchCountdown";

// Core navigation items (always visible)
const getCoreNavigation = (isLoggedIn: boolean): Array<{ name: string; href: string; requiresAuth?: boolean }> => [
  { name: "header.navigation.about", href: "/about" },
  { name: "header.navigation.resources", href: "/resources" },
  { name: "header.navigation.legalHelp", href: "/legal-help" },
  // Always show incidents tab, but handle login redirect
  { name: "header.navigation.incidents", href: "/incidents", requiresAuth: !isLoggedIn },
];

// Navigation groups with dropdowns
const getNavigationGroups = (isLoggedIn: boolean) => ({
  community: {
    label: "header.navigation.community",
    href: "/community",
    items: [
      { name: "header.navigation.community", href: "/community", isMain: true },
      { name: "header.navigation.campaigns", href: "/community/campaigns" },
    ]
  },
  features: {
    label: "header.navigation.features",
    href: "/features",
    items: [
      { name: "header.navigation.stealthMode", href: "/features/stealth-mode" },
      { name: "header.navigation.press", href: "/press" },
    ]
  }
});

const flagEmoji = {
  en: "🇺🇸",
  es: "🇪🇸"
};

// Memoized Logo component with preloaded image
export const Logo = memo(() => {
  const { t } = useTranslation();
  return (
    <Link href="/" className="flex items-center gap-4 group relative" prefetch={false}>
      <div className="relative">
        {/* <div className="absolute -inset-0.5 bg-blue-200 rounded-full blur opacity-40 group-hover:opacity-75 will-change-[opacity] transition-opacity duration-300" /> */}
        <div className="relative">
          <Image 
            src="/desist.png" 
            alt="Logo" 
            width={48} 
            height={48} 
            className="rounded-full will-change-transform transition-transform duration-300 group-hover:scale-105" 
            priority
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-2xl text-blue-900 dark:text-blue-100">
          {t('header.logo.title')}
        </span>
        <span className="text-xs text-gray-700 dark:text-gray-300">
          {t('header.logo.subtitle')}
        </span>
      </div>
    </Link>
  );
});
Logo.displayName = 'Logo';

// Optimized navigation item with reduced motion support
const NavItem = memo(({ item, isActive }: { item: { name: string; href: string; requiresAuth?: boolean }; isActive: boolean }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    if (item.requiresAuth) {
      e.preventDefault();
      // Create a more elegant notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <span>Please login to access the incidents page</span>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 500);
    }
  };

  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={handleClick}
      className={`relative px-3 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 group ${
        isActive
          ? "text-blue-900 dark:text-blue-100"
          : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
      }`}
    >
      {/* Hover background */}
      <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {t(item.name)}
      {isActive && !shouldReduceMotion && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
      )}
      {isActive && shouldReduceMotion && (
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10" />
      )}
    </Link>
  );
});
NavItem.displayName = 'NavItem';

// Navigation group component with dropdown
const NavGroup = memo(({ group }: { groupKey: string; group: { label: string; href: string; items: Array<{ name: string; href: string; isMain?: boolean }> } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isGroupActive = group.items.some((item) => pathname === item.href);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative px-3 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 flex items-center gap-1 group ${
          isGroupActive
            ? "text-blue-900 dark:text-blue-100"
            : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
        }`}
      >
        {/* Hover background */}
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {t(group.label)}
        {isGroupActive && !shouldReduceMotion && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        {isGroupActive && shouldReduceMotion && (
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10" />
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className={`relative block px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                    : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
                }`}
              >
                {/* Hover background for dropdown items */}
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-md -z-10 transition-opacity duration-200 group-hover:opacity-100 opacity-0" />
                {t(item.name)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});
NavGroup.displayName = 'NavGroup';

// Optimized mobile menu button
const MenuButton = memo(({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    aria-label="Toggle navigation menu"
  >
    <span className="sr-only">Toggle menu</span>
    <div className="relative w-6 h-6">
      <span 
        className={`absolute left-0 block h-0.5 w-6 bg-current will-change-transform transition-transform duration-200 ${
          isOpen ? "rotate-45 top-3" : "top-2"
        }`}
      />
      <span 
        className={`absolute left-0 block h-0.5 w-6 bg-current will-change-transform transition-transform duration-200 ${
          isOpen ? "-rotate-45 top-3" : "top-4"
        }`}
      />
    </div>
  </button>
));
MenuButton.displayName = 'MenuButton';

// Language selector component
const LanguageSelector = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg">{flagEmoji[language]}</span>
        <span className="hidden sm:inline">{t(`header.language.${language}`)}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">{flagEmoji['en']}</span> {t('header.language.en')}
          </button>
          <button
            onClick={() => {
              setLanguage('es');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg">{flagEmoji['es']}</span> {t('header.language.es')}
          </button>
        </div>
      )}
    </div>
  );
});
LanguageSelector.displayName = 'LanguageSelector';

// Account menu component
const AccountMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{id: string, email: string, name: string, image?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check for user session on mount and listen for auth changes
  useEffect(() => {
    // Set loading to false immediately to show buttons
    setLoading(false);
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if email is confirmed in our custom users table
          const { data: userData } = await supabase
            .from('users')
            .select('email_confirmed')
            .eq('id', user.id)
            .single();

          // Only set user if email is confirmed
          if (userData && userData.email_confirmed === true) {
            setUser({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.full_name || user.email || '',
              image: user.user_metadata?.avatar_url
            });
          } else {
            // If email not confirmed, don't set user
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        // Check if email is confirmed in our custom users table
        const { data: userData } = await supabase
          .from('users')
          .select('email_confirmed')
          .eq('id', session.user.id)
          .single();

        // Only set user if email is confirmed
        if (userData && userData.email_confirmed === true) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            image: session.user.user_metadata?.avatar_url
          });
        } else {
          // If email not confirmed, don't set user
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsOpen(false);
      // Clear any localStorage data
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          prefetch={false}
          className={`relative px-4 py-2 rounded text-sm font-medium will-change-colors transition-colors duration-200 group ${
            pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/account'
              ? "text-blue-900 dark:text-blue-100"
              : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
          }`}
        >
          {/* Hover background */}
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-400" />
          Account
          {(pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/account') && !shouldReduceMotion && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded -z-10"
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            />
          )}
          {(pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/account') && shouldReduceMotion && (
            <div className="absolute inset-0 bg-blue-100 rounded dark:bg-blue-900/40 -z-10" />
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline">
          {user.name || 'Account'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name || 'User'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span>👤</span>
              My Account
            </Link>
            <Link
              href="/support/feedback"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span>💬</span>
              Send Feedback
            </Link>
            <Link
              href="/support/emergency"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <span>🚨</span>
              Emergency Resources
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
AccountMenu.displayName = 'AccountMenu';

// Quick Actions component
const QuickActions = memo(() => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="hidden lg:flex items-center gap-2 ml-4">
      <Link
        href="/download"
        prefetch={false}
        className={`relative px-3 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 group ${
          pathname === '/download'
            ? "text-blue-900 dark:text-blue-100"
            : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
        }`}
      >
        {/* Hover background */}
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {t('header.navigation.download')}
        {pathname === '/download' && !shouldReduceMotion && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        {pathname === '/download' && shouldReduceMotion && (
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10" />
        )}
      </Link>
      <Link
        href="/support/emergency"
        prefetch={false}
        className={`relative px-3 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 group ${
          pathname === '/support/emergency'
            ? "text-blue-900 dark:text-blue-100"
            : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
        }`}
      >
         {/* Hover background */}
         <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {t('header.navigation.emergency')}
        {pathname === '/support/emergency' && !shouldReduceMotion && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        {pathname === '/support/emergency' && shouldReduceMotion && (
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10" />
        )}
      </Link>
      <Link
        href="/support"
        prefetch={false}
        className={`relative px-3 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 group ${
          pathname === '/support' || pathname.startsWith('/support/')
            ? "text-blue-900 dark:text-blue-100"
            : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
        }`}
      >
         {/* Hover background */}
         <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {t('header.navigation.support')}
        {(pathname === '/support' || pathname.startsWith('/support/')) && !shouldReduceMotion && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        {(pathname === '/support' || pathname.startsWith('/support/')) && shouldReduceMotion && (
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10" />
        )}
      </Link>
    </div>
  );
});
QuickActions.displayName = 'QuickActions';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{id: string, email: string, name: string, image?: string} | null>(null);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();


  // Optimized scroll handler with RAF
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
          setScrolled(currentScrollY > 20);
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Check for user session and email confirmation status
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if email is confirmed in our custom users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('email_confirmed')
            .eq('id', user.id)
            .single();

          // If user doesn't exist in our table, check localStorage and logout
          if (error || !userData) {
            console.log('User not found in users table or error:', error);
            await supabase.auth.signOut();
            setUser(null);
            return;
          }

          // Only set user if email is confirmed
          if (userData && userData.email_confirmed === true) {
            setUser({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.full_name || user.email || '',
              image: user.user_metadata?.avatar_url
            });
          } else {
            // If email not confirmed, sign out the user
            console.log('Email not confirmed, signing out');
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Check if email is confirmed in our custom users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('email_confirmed')
          .eq('id', session.user.id)
          .single();

        // If user doesn't exist in our table, logout
        if (error || !userData) {
          console.log('User not found in users table, signing out');
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        // Only set user if email is confirmed
        if (userData && userData.email_confirmed === true) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            image: session.user.user_metadata?.avatar_url
          });
        } else {
          // If email not confirmed, sign out the user
          console.log('Email not confirmed, signing out');
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Get navigation based on user authentication status
  const isLoggedIn = !!user;
  const coreNavigation = getCoreNavigation(isLoggedIn);
  const navigationGroups = getNavigationGroups(isLoggedIn);

  const mobileMenuAnimations = {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    menu: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      transition: shouldReduceMotion 
        ? { duration: 0.2 }
        : { type: "spring", damping: 25, stiffness: 200 }
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 will-change-[background,box-shadow] transition-[background,box-shadow] duration-200 ${
          scrolled 
            ? "bg-white/90 dark:bg-gray-950/50 backdrop-blur-md shadow-sm" 
            : "bg-white/50 dark:bg-gray-900/50 "
        }`}
        role="banner"
      >
        <div className="mx-auto px-4 lg:px-6">
          <nav 
            className="flex items-center justify-between h-16 lg:h-20"
            role="navigation"
            aria-label="Main navigation"
          >
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <ul className="flex items-center gap-2" role="menubar">
                {/* Core Navigation Items */}
                {coreNavigation.map((item) => (
                  <li key={item.href} role="none">
                    <NavItem item={item} isActive={pathname === item.href} />
                  </li>
                ))}
                {/* Navigation Groups with Dropdowns */}
                {Object.entries(navigationGroups).map(([key, group]) => (
                  <li key={key} role="none">
                    <NavGroup groupKey={key} group={group} />
                  </li>
                ))}
              </ul>
              
              {/* Quick Actions */}
              <QuickActions />
              
              <div className="ml-8 pl-6 border-l border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <LaunchCountdown variant="header" />
                <LanguageSelector />
                <ThemeToggle />
                <AccountMenu />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <LaunchCountdown variant="header" />
              <LanguageSelector />
              <ThemeToggle />
              <MenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            <motion.div
              {...mobileMenuAnimations.overlay}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              {...mobileMenuAnimations.menu}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
              id="mobile-menu"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold text-lg text-blue-900 dark:text-blue-100">{t('header.navigation.menu')}</span>
                  <MenuButton isOpen={true} onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                <nav 
                  className="flex-1 p-6 overflow-y-auto"
                  role="navigation"
                  aria-label="Mobile navigation"
                >
                  <ul className="space-y-2" role="menubar">
                    {/* Core Navigation Items */}
                    {coreNavigation.map((item) => {
                      const isActive = pathname === item.href;
                      const handleMobileClick = (e: React.MouseEvent) => {
                        if (item.requiresAuth) {
                          e.preventDefault();
                          // Create a more elegant notification for mobile
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
                          notification.innerHTML = `
                            <div class="flex items-center gap-3">
                              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                              </svg>
                              <span>Please login to access the incidents page</span>
                            </div>
                          `;
                          
                          document.body.appendChild(notification);
                          
                          // Animate in
                          setTimeout(() => {
                            notification.classList.remove('translate-x-full');
                          }, 100);
                          
                          // Auto remove after 3 seconds
                          setTimeout(() => {
                            notification.classList.add('translate-x-full');
                            setTimeout(() => {
                              document.body.removeChild(notification);
                            }, 300);
                          }, 3000);
                          
                          // Redirect to login after a short delay
                          setTimeout(() => {
                            window.location.href = "/auth/login";
                          }, 500);
                        }
                      };
                      
                      return (
                        <li key={item.href} role="none">
                          <Link
                            href={item.href}
                            prefetch={false}
                            role="menuitem"
                            onClick={handleMobileClick}
                            className={`relative block px-4 py-3 rounded-lg text-base font-medium will-change-colors transition-colors duration-200 group ${
                              isActive
                                ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                                : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
                            }`}
                          >
                            {/* Hover background for mobile nav */}
                            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            {t(item.name)}
                          </Link>
                        </li>
                      );
                    })}
                    
                    {/* Navigation Groups Items (flattened for mobile) */}
                    {Object.entries(navigationGroups).map(([, group]) => 
                      group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href} role="none">
                            <Link
                              href={item.href}
                              prefetch={false}
                              role="menuitem"
                              className={`relative block px-4 py-3 rounded-lg text-base font-medium will-change-colors transition-colors duration-200 group ${
                                isActive
                                  ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                                  : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
                              }`}
                            >
                              {/* Hover background for mobile nav */}
                              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              {t(item.name)}
                            </Link>
                          </li>
                        );
                      })
                    ).flat()}
                    
                    {/* Mobile Quick Actions */}
                    <li role="none">
                      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="space-y-2">
                          <Link
                            href="/support/emergency"
                            className="block px-4 py-3 text-white rounded-lg font-medium transition-colors duration-200 text-center"
                          >
                            {t('header.navigation.emergency')}
                          </Link>
                          <Link
                            href="/download"
                            className="block px-4 py-3 text-white rounded-lg font-medium transition-colors duration-200 text-center"
                          >
                            {t('header.navigation.download')}
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}; 