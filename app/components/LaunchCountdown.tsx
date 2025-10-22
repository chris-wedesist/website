"use client";

import { useState, useEffect } from 'react';

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
          🎉 <span className="hidden sm:inline">We&apos;re Live!</span><span className="sm:hidden">Live!</span>
        </span>
      </div>
    );
  }

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  if (variant === 'header') {
    return (
      <div className={`${className} text-xs font-medium text-primary-600 dark:text-primary-400`}>
        <span className="inline-flex items-center gap-1">
          🚀 <span className="hidden sm:inline">Launch in:</span>
          <span className="font-mono">
            {timeLeft.days}d {formatNumber(timeLeft.hours)}h {formatNumber(timeLeft.minutes)}m
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`${className} bg-gradient-to-r from-primary-50 to-accent-purple-50 dark:from-primary-900/20 dark:to-accent-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 text-center shadow-sm`}>
        <div className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-3">
          🚀 Launch Countdown
        </div>
        <div className="flex justify-center items-center gap-6 text-lg font-mono font-bold text-primary-900 dark:text-primary-100">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.days)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.hours)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.minutes)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold">{formatNumber(timeLeft.seconds)}</span>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">Seconds</span>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`${className} text-sm font-medium text-primary-600 dark:text-primary-400`}>
      <span className="inline-flex items-center gap-1">
        🚀 <span className="hidden sm:inline">Launching in:</span>
        <span className="font-mono">
          {timeLeft.days}d {formatNumber(timeLeft.hours)}h {formatNumber(timeLeft.minutes)}m {formatNumber(timeLeft.seconds)}s
        </span>
      </span>
    </div>
  );
};
