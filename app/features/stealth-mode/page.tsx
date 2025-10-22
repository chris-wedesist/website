'use client';

import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { AppDownloadCTA } from '../../components/AppDownloadCTA';

export default function StealthModePage() {
  const features = [
    {
      icon: '🔒',
      title: 'Hidden App Icon',
      description: 'Disguise the DESIST app to look like a calculator, weather app, or other innocuous utility.'
    },
    {
      icon: '🛡️',
      title: 'Secure PIN Access',
      description: 'Access your safety tools and resources through a secret PIN that only you know.'
    },
    {
      icon: '📱',
      title: 'Panic Mode',
      description: 'Quickly exit to a decoy screen if someone unexpectedly looks at your phone.'
    },
    {
      icon: '🔄',
      title: 'Quick Switch',
      description: 'Instantly switch between stealth mode and normal mode based on your safety needs.'
    },
    {
      icon: '📞',
      title: 'Emergency Contacts',
      description: 'Access emergency contacts and safety resources even in stealth mode.'
    },
    {
      icon: '🤐',
      title: 'No Notifications',
      description: 'All notifications are disabled in stealth mode to maintain your privacy and safety.'
    }
  ];

  const scenarios = [
    {
      title: 'Workplace Harassment',
      description: 'Document incidents discreetly while maintaining professional appearances.',
      icon: '🏢'
    },
    {
      title: 'Domestic Situations',
      description: 'Access safety resources without raising suspicion in your living environment.',
      icon: '🏠'
    },
    {
      title: 'Public Transportation',
      description: 'Report incidents and access help while appearing to use a normal app.',
      icon: '🚌'
    },
    {
      title: 'Social Settings',
      description: 'Get support and document experiences without drawing unwanted attention.',
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
                Privacy & Safety Feature
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Stealth Mode
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Protect yourself with discretion. DESIST&apos;s Stealth Mode lets you access support 
                and document events without anyone knowing you&apos;re using a safety app.
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
              How Stealth Mode Protects You
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Your safety is our priority. Stealth Mode ensures you can access help and document incidents 
              without putting yourself at additional risk.
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
              When to Use Stealth Mode
          </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Stealth Mode is designed for situations where using an obvious safety app could put you at risk.
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
              Setting Up Stealth Mode
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Follow these simple steps to enable and configure Stealth Mode on your device.
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Download the DESIST App',
                    description: 'Install the DESIST app on your smartphone from the App Store or Google Play.'
                  },
                  {
                    step: 2,
                    title: 'Complete Initial Setup',
                    description: 'Create your account and complete the safety assessment to personalize your experience.'
                  },
                  {
                    step: 3,
                    title: 'Enable Stealth Mode',
                    description: 'Go to Settings > Privacy & Safety > Stealth Mode and toggle it on.'
                  },
                  {
                    step: 4,
                    title: 'Choose Your Disguise',
                    description: 'Select what type of app you want DESIST to appear as (calculator, weather, etc.).'
                  },
                  {
                    step: 5,
                    title: 'Set Your PIN',
                    description: 'Create a secure PIN that will be used to access DESIST features in stealth mode.'
                  },
                  {
                    step: 6,
                    title: 'Test the Feature',
                    description: 'Practice switching in and out of stealth mode to ensure you\'re comfortable with the process.'
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
                Important Safety Considerations
              </h3>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
              <p>
                <strong>Trust Your Instincts:</strong> If you feel unsafe using any technology, prioritize your immediate safety over documentation.
              </p>
              <p>
                <strong>Practice First:</strong> Familiarize yourself with stealth mode features before you need them in a real situation.
              </p>
              <p>
                <strong>Have Backup Plans:</strong> Stealth mode is one tool among many. Always have multiple safety strategies.
              </p>
              <p>
                <strong>Stay Updated:</strong> Keep the app updated to ensure you have the latest security and privacy features.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                If you are in immediate danger, call 911 or your local emergency services. 
                Technology tools should supplement, not replace, traditional safety measures.
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
              Ready to Get Protected?
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
              Download the DESIST app today and take control of your safety with discretion and confidence.
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
