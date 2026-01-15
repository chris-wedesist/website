'use client';

import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { AppDownloadCTA } from '../../components/AppDownloadCTA';
import { useTranslation } from '../../context/TranslationContext';

export default function StealthModePage() {
  const { t } = useTranslation();
  const features = [
    {
      icon: '🔒',
      title: t('stealthMode.features.hiddenIcon.title'),
      description: t('stealthMode.features.hiddenIcon.description')
    },
    {
      icon: '🛡️',
      title: t('stealthMode.features.securePin.title'),
      description: t('stealthMode.features.securePin.description')
    },
    {
      icon: '📱',
      title: t('stealthMode.features.panicMode.title'),
      description: t('stealthMode.features.panicMode.description')
    },
    {
      icon: '🔄',
      title: t('stealthMode.features.quickSwitch.title'),
           description: t('stealthMode.features.quickSwitch.description')
    },
    {
      icon: '📞',
      title: t('stealthMode.features.emergencyContacts.title'),
      description: t('stealthMode.features.emergencyContacts.description')
    },
    {
      icon: '🤐',
      title: t('stealthMode.features.noNotifications.title'),
      description: t('stealthMode.features.noNotifications.description')
    }
  ];

  const scenarios = [
    {
      title: t('stealthMode.scenarios.workplace.title'),
      description: t('stealthMode.scenarios.workplace.description'),
      icon: '🏢'
    },
    {
      title: t('stealthMode.scenarios.domestic.title'),
      description: t('stealthMode.scenarios.domestic.description'),
      icon: '🏠'
    },
    {
      title: t('stealthMode.scenarios.transportation.title'),
      description: t('stealthMode.scenarios.transportation.description'),
      icon: '🚌'
    },
    {
      title: t('stealthMode.scenarios.social.title'),
      description: t('stealthMode.scenarios.social.description'),
      icon: '👥'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Badge variant="default" className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                {t('stealthMode.hero.badge')}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('stealthMode.hero.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {t('stealthMode.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {/* <Link href="/support/emergency">
                  <button className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Emergency Resources
                  </button>
                </Link> */}
                <AppDownloadCTA />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Stealth Mode Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('stealthMode.features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('stealthMode.features.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Use Stealth Mode */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('stealthMode.scenarios.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('stealthMode.scenarios.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('stealthMode.setup.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('stealthMode.setup.description')}
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: t('stealthMode.setup.steps.download.title'),
                    description: t('stealthMode.setup.steps.download.description')
                  },
                  {
                    step: 2,
                    title: t('stealthMode.setup.steps.setup.title'),
                    description: t('stealthMode.setup.steps.setup.description')
                  },
                  {
                    step: 3,
                    title: t('stealthMode.setup.steps.enable.title'),
                    description: t('stealthMode.setup.steps.enable.description')
                  },
                  {
                    step: 4,
                    title: t('stealthMode.setup.steps.disguise.title'),
                    description: t('stealthMode.setup.steps.disguise.description')
                  },
                  {
                    step: 5,
                    title: t('stealthMode.setup.steps.pin.title'),
                    description: t('stealthMode.setup.steps.pin.description')
                  },
                  {
                    step: 6,
                    title: t('stealthMode.setup.steps.test.title'),
                    description: t('stealthMode.setup.steps.test.description')
                  }
                ].map((instruction, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {instruction.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {instruction.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {instruction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Important Safety Notice */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {t('stealthMode.safety.title')}
              </h3>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <p>
                <strong>{t('stealthMode.safety.trustInstincts').split(':')[0]}:</strong> {t('stealthMode.safety.trustInstincts').split(':').slice(1).join(':')}
              </p>
              <p>
                <strong>{t('stealthMode.safety.practiceFirst').split(':')[0]}:</strong> {t('stealthMode.safety.practiceFirst').split(':').slice(1).join(':')}
              </p>
              <p>
                <strong>{t('stealthMode.safety.backupPlans').split(':')[0]}:</strong> {t('stealthMode.safety.backupPlans').split(':').slice(1).join(':')}
              </p>
              <p>
                <strong>{t('stealthMode.safety.stayUpdated').split(':')[0]}:</strong> {t('stealthMode.safety.stayUpdated').split(':').slice(1).join(':')}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {t('stealthMode.safety.notice')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {t('stealthMode.cta.title')}
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
              {t('stealthMode.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppDownloadCTA />
              {/* <Link href="/support/emergency">
                <button className="py-3 px-6 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                  Emergency Resources
                </button>
              </Link> */}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
