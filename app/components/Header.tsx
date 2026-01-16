"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useCallback, memo, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "../context/TranslationContext";
import { useSession } from "@/lib/use-session";
import { signOutAction } from "@/lib/auth-actions";

const navigation = [
  { name: "header.navigation.about", href: "/about" },
  { name: "header.navigation.community", href: "/community" },
  { name: "header.navigation.campaigns", href: "/community/campaigns" },
  { name: "header.navigation.incidents", href: "/incidents" },
  { name: "header.navigation.legalHelp", href: "/legal-help" },
  { name: "header.navigation.resources", href: "/resources" },
  { name: "header.navigation.support", href: "/support" },
  { name: "header.navigation.emergency", href: "/support/emergency" },
  { name: "header.navigation.stealthMode", href: "/features/stealth-mode" },
  { name: "header.navigation.press", href: "/press" },
  { name: "header.navigation.download", href: "/download" },
  { name: "header.navigation.contact", href: "/contact" },
] as const;

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
const NavItem = memo(({ item, isActive }: { item: typeof navigation[number]; isActive: boolean }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();

  return (
    <Link
      href={item.href}
      prefetch={false}
      className={`relative px-4 py-2 rounded-full text-sm font-medium will-change-colors transition-colors duration-200 ${
        isActive
          ? "text-blue-900 dark:text-blue-100"
          : "text-gray-700 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-100"
      }`}
    >
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
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-lg">{flagEmoji[language]}</span>
        {t(`header.language.${language}`)}
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
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="text-lg">{flagEmoji['en']}</span> {t('header.language.en')}
          </button>
          <button
            onClick={() => {
              setLanguage('es');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
  const { data: session } = useSession();
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

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOutAction();
  };

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signin"
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signin"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Get Started
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
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline">
          {session.user?.name || 'Account'}
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
              {session.user?.name || 'User'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {session.user?.email}
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

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
            : "bg-white/50 dark:bg-gray-900/50 "
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4">
          <nav 
            className="flex items-center justify-between h-16 lg:h-20"
            role="navigation"
            aria-label="Main navigation"
          >
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <ul className="flex items-center gap-1" role="menubar">
                {navigation.map((item) => (
                  <li key={item.href} role="none">
                    <NavItem item={item} isActive={pathname === item.href} />
                  </li>
                ))}
              </ul>
              <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 flex items-center gap-4">
                <LanguageSelector />
                <ThemeToggle />
                <AccountMenu />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
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
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-semibold text-lg text-blue-900 dark:text-blue-100">{t('header.navigation.menu')}</span>
                  <MenuButton isOpen={true} onClick={() => setIsMobileMenuOpen(false)} />
                </div>
                <nav 
                  className="flex-1 p-4 overflow-y-auto"
                  role="navigation"
                  aria-label="Mobile navigation"
                >
                  <ul className="space-y-1" role="menubar">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name} role="none">
                          <Link
                            href={item.href}
                            prefetch={false}
                            role="menuitem"
                            className={`block px-4 py-3 rounded-lg text-base font-medium will-change-colors transition-colors duration-200 ${
                              isActive
                                ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                            }`}
                          >
                            {t(item.name)}
                          </Link>
                        </li>
                      );
                    })}
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