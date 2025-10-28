"use client";
import React from "react";
import { motion } from "framer-motion";
import { CallToAction } from "../components/CallToAction";
import { FeatureGrid } from "../components/FeatureGrid";
import { HeroSection } from "../components/HeroSection";
import { useTranslation } from "../context/TranslationContext";

export default function SupportPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setStatus({ type: 'success', message: "Message sent successfully! We'll get back to you soon." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to send message' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const supportStats = [
  //   {
  //     value: "24/7",
  //     label: "Support Available",
  //     icon: "🕒",
  //     color: "bg-blue-100 dark:bg-blue-900/30"
  //   },
  //   {
  //     value: "15min",
  //     label: "Avg. Response Time",
  //     icon: "⚡",
  //     color: "bg-yellow-100 dark:bg-yellow-900/30"
  //   },
  //   {
  //     value: "50+",
  //     label: "Support Agents",
  //     icon: "👥",
  //     color: "bg-green-100 dark:bg-green-900/30"
  //   },
  //   {
  //     value: "100%",
  //     label: "Confidential",
  //     icon: "🔒",
  //     color: "bg-purple-100 dark:bg-purple-900/30"
  //   }
  // ];

  // const supportFeatures = [
  //   {
  //     icon: "💬",
  //     title: "Chat Support",
  //     description: "Connect with a trained support specialist instantly through our secure chat.",
  //     link: {
  //       label: "Start Chat",
  //       href: "#chat"
  //     }
  //   },
  //   {
  //     icon: "📞",
  //     title: "Phone Support",
  //     description: "Speak directly with our support team for immediate assistance.",
  //     link: {
  //       label: "Call Now",
  //       href: "tel:1-800-555-0000"
  //     }
  //   },
  //   {
  //     icon: "👩‍⚖️",
  //     title: "Legal Support",
  //     description: "Get legal advice and representation from our trusted partners.",
  //     link: {
  //       label: "See Lawyers List",
  //       href: "/legal-help"
  //     }
  //   },
  //   {
  //     icon: "🏥",
  //     title: "Crisis Support",
  //     description: "Immediate assistance for crisis situations and emergencies.",
  //     link: {
  //       label: "Get Help",
  //       href: "#crisis"
  //     }
  //   },
  //   {
  //     icon: "📚",
  //     title: "Resources",
  //     description: "Access our library of resources and educational materials.",
  //     link: {
  //       label: "Browse Resources",
  //       href: "/resources"
  //     }
  //   },
  //   {
  //     icon: "👥",
  //     title: "Community Support",
  //     description: "Connect with others and share experiences in a safe space.",
  //     link: {
  //       label: "Join Community",
  //       href: "/community"
  //     }
  //   }
  // ];

  const immediateServices = [
    {
      icon: "🚨",
      title: t('support.immediate.crisis.title'),
      description: t('support.immediate.crisis.description')
    },
    {
      icon: "🤝",
      title: t('support.immediate.advocacy.title'),
      description: t('support.immediate.advocacy.description')
    },
    {
      icon: "🏠",
      title: t('support.immediate.housing.title'),
      description: t('support.immediate.housing.description')
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection
        title={t('support.hero.title')}
        description={t('support.hero.description')}
        imageSrc="/images/support/support-center.jpg"
        imageAlt="Support team ready to help"
      >
        <div className="flex flex-col gap-6">
          {/* <div className="flex gap-4">
            <motion.a
              href="#chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              {t('support.hero.chatButton')}
            </motion.a>
            <motion.a
              href="#call"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              {t('support.hero.callButton')}
            </motion.a>
          </div> */}

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{t('support.emergency.title')}</h2>
            <div className="grid md:grid-cols-2 gap-4 text-white">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold">{t('support.emergency.services.title')}</div>
                <div className="text-xl">{t('support.emergency.services.number')}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-bold">{t('support.emergency.crisis.title')}</div>
                <div className="text-xl">{t('support.emergency.crisis.number')}</div>
              </div>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* Stats Section */}
      {/* <StatsDisplay stats={supportStats} /> */}

      {/* Support Services */}
      {/* <FeatureGrid
        title="Support Services"
        description="Comprehensive support options tailored to your needs"
        features={supportFeatures}
        columns={3}
        variant="bordered"
      /> */}

      {/* Immediate Services */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('support.immediate.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              {t('support.immediate.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {immediateServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl">{service.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section (moved from Contact page) */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">{t('contact.form.title')}</h2>
              {status.type && (
                <div className={`p-4 rounded-lg mb-6 ${status.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{status.message}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.name.label')}</label>
                    <input id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('contact.form.name.placeholder')} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.email.label')}</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('contact.form.email.placeholder')} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.subject.label')}</label>
                  <input id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('contact.form.subject.placeholder')} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.form.message.label')}</label>
                  <textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t('contact.form.message.placeholder')} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className={`px-6 py-3 rounded-lg text-white font-medium ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}</button>
                </div>
              </form>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">{t('contact.contactInfo.title')}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('contact.contactInfo.email.label')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t('contact.contactInfo.email.value')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Support */}
      <CallToAction
        title={t('support.mobile.title')}
        description={t('support.mobile.description')}
        primaryAction={{
          label: t('support.mobile.download'),
          href: "#download"
        }}
        secondaryAction={{
          label: t('support.mobile.learnMore'),
          href: "/about"
        }}
        pageType="default"
      />
    </main>
  );
} 