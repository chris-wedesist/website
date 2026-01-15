'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NewsletterSignupProps {
  variant?: 'compact' | 'full' | 'modal';
  onSuccess?: () => void;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'full',
  onSuccess,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { id: 'launch', label: 'Product Launches', emoji: '🚀' },
    { id: 'safety', label: 'Safety Tips', emoji: '🛡️' },
    { id: 'community', label: 'Community Updates', emoji: '🤝' },
    { id: 'research', label: 'Research & Reports', emoji: '📊' },
    { id: 'events', label: 'Events & Webinars', emoji: '📅' },
    { id: 'partnerships', label: 'Partnerships', emoji: '🤲' },
  ];

  const handleInterestToggle = (interestId: string) => {
    setInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, you would integrate with:
    // - Mailchimp, ConvertKit, or other email service
    // - Your backend API to store the subscription
    // - Analytics to track conversions

    console.log('Newsletter subscription:', { email, interests });

    setIsSubmitted(true);
    setIsLoading(false);

    if (onSuccess) {
      onSuccess();
    }

    // Reset form after a delay
    setTimeout(() => {
      setEmail('');
      setInterests([]);
      setIsSubmitted(false);
    }, 3000);
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`${className}`}
        {...fadeInVariants}
      >
        {isSubmitted ? (
          <motion.div 
            className="text-center text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xl mb-1">✅</div>
            <p className="font-medium">Subscribed!</p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="flex gap-2"
            {...fadeInVariants}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm transition-all duration-200"
            />
            <button
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              {isLoading ? '...' : 'Subscribe'}
            </button>
          </motion.form>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`${className}`}
      {...fadeInVariants}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* Upcoming Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
            🚀 COMING SOON
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 opacity-50" />
        <div className="absolute inset-0 bg-[url('/community-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 p-6">
          <motion.div 
            className="text-center"
            variants={staggerVariants}
            initial="initial"
            animate="animate"
            custom={0}
          >
            <div className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4 shadow-sm">
              📬 Stay Updated
            </div>
            <h2 className="text-2xl mb-2 font-bold text-gray-900 dark:text-white">
              Join the DESIST Newsletter
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Get the latest updates on safety features, community stories, and platform news
            </p>
          </motion.div>
        </div>
        <div className="relative z-10 px-6 pb-6">
          {/* Upcoming Disclaimer */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Newsletter Coming Soon
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                  <p>
                    The DESIST Newsletter is currently under development and will be launching soon! 
                    Subscribe now to get notified when it goes live. We&apos;re working hard to bring you 
                    the best content about safety, community updates, and platform news.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {isSubmitted ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Welcome to the Community!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Thank you for subscribing! You&apos;ll receive your first newsletter within 24 hours.
              </p>
              <div className="flex justify-center gap-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm font-medium rounded-full">
                  ✓ Email confirmed
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-sm font-medium rounded-full">
                  ✓ Preferences saved
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6 opacity-50 pointer-events-none"
              variants={staggerVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              {/* Email Input */}
              <motion.div
                variants={staggerVariants}
                custom={0}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={true}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 cursor-not-allowed"
                />
              </motion.div>

              {/* Interest Selection */}
              <motion.div
                variants={staggerVariants}
                custom={1}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What interests you? (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => handleInterestToggle(option.id)}
                      disabled={true}
                      variants={staggerVariants}
                      custom={index + 2}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left cursor-not-allowed ${
                        interests.includes(option.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Privacy Notice */}
              <motion.div 
                className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                variants={staggerVariants}
                custom={8}
              >
                <p>
                  📋 By subscribing, you agree to receive email updates from DESIST. 
                  We respect your privacy and will never share your email with third parties. 
                  You can unsubscribe at any time.
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={staggerVariants}
                custom={9}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  disabled={true}
                  className="w-full bg-gray-400 cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    <span className="group-hover:text-blue-100">📬 Subscribe to Newsletter</span>
                  )}
                </button>
              </motion.div>

              {/* Benefits */}
              <motion.div 
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 rounded-lg border border-gray-100 dark:border-gray-700"
                variants={staggerVariants}
                custom={10}
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  What you&apos;ll get:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Weekly safety tips and best practices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Early access to new features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Community success stories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Exclusive event invitations
                  </li>
                </ul>
              </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  );
};
