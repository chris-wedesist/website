"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LaunchCountdownProps {
  launchDate?: string;
  className?: string;
  variant?: 'header' | 'banner' | 'inline';
}

export const LaunchCountdown = ({ 
  launchDate = "2025-12-15T09:00:00.000Z",
  className = "",
  variant = 'header'
}: LaunchCountdownProps) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      
      // Ensure proper date parsing
      const launchDateObj = new Date(launchDate);
      const launch = launchDateObj.getTime();
      const difference = launch - now;


      if (difference > 0) {
        setIsLaunched(false);
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      } else {
        setIsLaunched(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  if (isLaunched) {
    return (
      <div className={`${className} ${variant === 'header' ? 'text-xs' : 'text-sm'} font-medium text-accent-green-600 dark:text-accent-green-500`}>
        <span className="inline-flex items-center gap-1">
          🎉 <span className="hidden sm:inline">{t('launchCountdown.live')}</span><span className="sm:hidden">{t('launchCountdown.liveShort')}</span>
        </span>
      </div>
    );
  }

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  if (variant === 'header') {
    return (
      <div className={`${className} text-xs font-medium text-primary-600 dark:text-primary-400`}>
        <span className="inline-flex items-center gap-1">
          🚀 <span className="hidden sm:inline">{t('launchCountdown.launchIn')}</span>
          <span className="font-mono">
            {timeLeft.days}{t('launchCountdown.days')} {formatNumber(timeLeft.hours)}{t('launchCountdown.hours')} {formatNumber(timeLeft.minutes)}{t('launchCountdown.minutes')}
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`${className} bg-gradient-to-r from-primary-50 to-accent-purple-50 dark:from-primary-900/20 dark:to-accent-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 text-center shadow-sm`}>
        <div className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-3">
          🚀 {t('launchCountdown.title')}
        </div>
        <div className="flex justify-center items-center gap-6 text-lg font-mono font-bold text-primary-900 dark:text-primary-100">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.days)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('launchCountdown.daysLabel')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.hours)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('launchCountdown.hoursLabel')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.minutes)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('launchCountdown.minutesLabel')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.seconds)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('launchCountdown.secondsLabel')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`${className} text-sm font-medium text-primary-600 dark:text-primary-400`}>
      <span className="inline-flex items-center gap-1">
        🚀 <span className="hidden sm:inline">{t('launchCountdown.launchingIn')}</span>
          <span className="font-mono">
            {timeLeft.days}{t('launchCountdown.days')} {formatNumber(timeLeft.hours)}{t('launchCountdown.hours')} {formatNumber(timeLeft.minutes)}{t('launchCountdown.minutes')} {formatNumber(timeLeft.seconds)}{t('launchCountdown.seconds')}
          </span>
      </span>
    </div>
  );
};
