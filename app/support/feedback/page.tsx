/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/TranslationContext';
import enTranslations from '../../translations/en.json';
import esTranslations from '../../translations/es.json';
// Removed Card and Button imports - using direct styling instead

interface FeedbackForm {
  type: 'bug' | 'feedback' | 'feature-request' | 'safety-concern';
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  email: string;
  userAgent: string;
  url: string;
  attachments: File[];
}

export default function FeedbackPage() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<FeedbackForm>({
    type: 'feedback',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    email: '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : '',
    attachments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'feedback', label: t('support.feedback.types.general.label'), icon: '💬', description: t('support.feedback.types.general.description') },
    { id: 'bug', label: t('support.feedback.types.bug.label'), icon: '🐛', description: t('support.feedback.types.bug.description') },
    { id: 'feature-request', label: t('support.feedback.types.feature.label'), icon: '💡', description: t('support.feedback.types.feature.description') },
    { id: 'safety-concern', label: t('support.feedback.types.safety.label'), icon: '🚨', description: t('support.feedback.types.safety.description') }
  ];

  // Get categories directly from translations based on current language
  const getCategories = (type: string): string[] => {
    const currentTranslations = language === 'en' ? enTranslations : esTranslations;
    const key = `support.feedback.categories.${type}`;
    const keys = key.split('.');
    let value: any = currentTranslations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return [];
      }
    }
    return Array.isArray(value) ? value : [];
  };

  const categories = {
    feedback: getCategories('feedback'),
    bug: getCategories('bug'),
    'feature-request': getCategories('feature-request'),
    'safety-concern': getCategories('safety-concern')
  };

  const priorities = [
    { id: 'low', label: t('support.feedback.priority.low.label'), description: t('support.feedback.priority.low.description') },
    { id: 'medium', label: t('support.feedback.priority.medium.label'), description: t('support.feedback.priority.medium.description') },
    { id: 'high', label: t('support.feedback.priority.high.label'), description: t('support.feedback.priority.high.description') },
    { id: 'critical', label: t('support.feedback.priority.critical.label'), description: t('support.feedback.priority.critical.description') }
  ];

  const getFeedbackTypeLabel = (type: string) => {
    switch(type) {
      case 'bug': return t('support.feedback.types.bug.label');
      case 'feature-request': return t('support.feedback.types.feature.label');
      case 'safety-concern': return t('support.feedback.types.safety.label');
      default: return t('support.feedback.types.general.label');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, this would submit to your API
    console.log('Feedback submitted:', form);
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({
        ...prev,
        attachments: Array.from(e.target.files || [])
      }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('support.feedback.success.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('support.feedback.success.message').replace('{type}', getFeedbackTypeLabel(form.type).toLowerCase())}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    type: 'feedback',
                    title: '',
                    description: '',
                    category: '',
                    priority: 'medium',
                    email: '',
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    url: typeof window !== 'undefined' ? window.location.href : '',
                    attachments: []
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                {t('support.feedback.success.another')}
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {t('support.feedback.success.home')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('support.feedback.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('support.feedback.description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Feedback Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('support.feedback.types.question')}
                </h2>
              </div>
              <div>
                <div className="grid md:grid-cols-2 gap-4">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, type: type.id as any, category: '' }))}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        form.type === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {type.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Level (for bugs and safety concerns) */}
            {(form.type === 'bug' || form.type === 'safety-concern') && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('support.feedback.priority.title')}
                  </h2>
                </div>
                <div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, priority: priority.id as any }))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          form.priority === priority.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`font-medium ${
                          priority.id === 'critical' ? 'text-red-600 dark:text-red-400' :
                          priority.id === 'high' ? 'text-orange-600 dark:text-orange-400' :
                          priority.id === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {priority.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {priority.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('support.feedback.details.title')}
                </h2>
              </div>
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.category')}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{t('support.feedback.details.categoryPlaceholder')}</option>
                    {categories[form.type].map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.title')}
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder={t('support.feedback.details.titlePlaceholder').replace('{type}', getFeedbackTypeLabel(form.type).toLowerCase())}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.description')}
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={6}
                    placeholder={
                      form.type === 'bug' 
                        ? t('support.feedback.details.descriptionPlaceholders.bug')
                        : form.type === 'feature-request'
                        ? t('support.feedback.details.descriptionPlaceholders.feature')
                        : form.type === 'safety-concern'
                        ? t('support.feedback.details.descriptionPlaceholders.safety')
                        : t('support.feedback.details.descriptionPlaceholders.general')
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.email.label')}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('support.feedback.details.email.placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('support.feedback.details.email.helper').replace('{type}', getFeedbackTypeLabel(form.type).toLowerCase())}
                  </p>
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.attachments.label')}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('support.feedback.details.attachments.helper').replace('{type}', getFeedbackTypeLabel(form.type).toLowerCase())}
                  </p>
                  {form.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('support.feedback.details.attachments.filesSelected')}:</p>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {form.attachments.map((file, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span>📎</span>
                            {file.name} ({Math.round(file.size / 1024)}KB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('support.feedback.details.technical.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('support.feedback.details.technical.description')}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.technical.url')}
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('support.feedback.details.technical.browser')}
                  </label>
                  <textarea
                    value={form.userAgent}
                    onChange={(e) => setForm(prev => ({ ...prev, userAgent: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      {t('support.feedback.details.privacy.title')}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {t('support.feedback.details.privacy.content')}
                    </p>
                  </div>
                </div>
              </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !form.title || !form.description || !form.category}
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {t('support.feedback.details.submit.submitting')}
                  </>
                ) : (
                  t('support.feedback.details.submit.button').replace('{type}', getFeedbackTypeLabel(form.type))
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
