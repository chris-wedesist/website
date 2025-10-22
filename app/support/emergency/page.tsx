'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/Badge';
import { AppDownloadCTA } from '../../components/AppDownloadCTA';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  type: 'hotline' | 'text' | 'chat' | 'local';
  available: string;
  languages?: string[];
  specialties?: string[];
}

export default function EmergencyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: '24/7 confidential support for domestic violence survivors and their loved ones.',
      type: 'hotline',
      available: '24/7',
      languages: ['English', 'Spanish', '200+ languages via interpretation'],
      specialties: ['Domestic Violence', 'Safety Planning', 'Local Resources']
    },
    {
      id: '2',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text message.',
      type: 'text',
      available: '24/7',
      languages: ['English', 'Spanish'],
      specialties: ['Crisis Support', 'Emotional Support', 'Mental Health']
    },
    {
      id: '3',
      name: 'RAINN National Sexual Assault Hotline',
      number: '1-800-656-4673',
      description: 'Confidential support for sexual assault survivors.',
      type: 'hotline',
      available: '24/7',
      languages: ['English', 'Spanish'],
      specialties: ['Sexual Assault', 'Counseling', 'Legal Information']
    },
    {
      id: '4',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: 'Free and confidential emotional support for people in suicidal crisis.',
      type: 'hotline',
      available: '24/7',
      languages: ['English', 'Spanish'],
      specialties: ['Suicide Prevention', 'Mental Health Crisis', 'Emotional Support']
    },
    {
      id: '5',
      name: 'LGBT National Hotline',
      number: '1-888-843-4564',
      description: 'Confidential support for LGBTQ+ individuals facing harassment or discrimination.',
      type: 'hotline',
      available: 'Mon-Fri 4pm-12am, Sat 12pm-5pm EST',
      languages: ['English'],
      specialties: ['LGBTQ+ Issues', 'Harassment', 'Discrimination']
    },
    {
      id: '6',
      name: 'National Human Trafficking Hotline',
      number: '1-888-373-7888',
      description: 'Report suspected human trafficking and get help for victims.',
      type: 'hotline',
      available: '24/7',
      languages: ['English', 'Spanish', '200+ languages via interpretation'],
      specialties: ['Human Trafficking', 'Victim Services', 'Reporting']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: '📞' },
    { id: 'hotline', label: 'Phone Hotlines', icon: '☎️' },
    { id: 'text', label: 'Text Support', icon: '💬' },
    { id: 'chat', label: 'Online Chat', icon: '💻' },
    { id: 'local', label: 'Local Resources', icon: '📍' }
  ];

  const filteredContacts = selectedCategory === 'all' 
    ? emergencyContacts 
    : emergencyContacts.filter(contact => contact.type === selectedCategory);

  const safetyTips = [
    {
      icon: '🔒',
      title: 'Use a Safe Device',
      description: 'Use a device that your abuser doesn\'t have access to when seeking help.'
    },
    {
      icon: '🔄',
      title: 'Clear Your History',
      description: 'Clear your browser history and use incognito/private browsing mode.'
    },
    {
      icon: '📱',
      title: 'Have a Safety Plan',
      description: 'Develop a safety plan for leaving dangerous situations quickly.'
    },
    {
      icon: '👥',
      title: 'Tell Someone You Trust',
      description: 'Let a trusted friend or family member know about your situation.'
    }
  ];

  return (
    <>
      {/* Emergency Alert Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="font-medium">
            If you are in immediate danger, call 911 or your local emergency services immediately
          </p>
        </div>
      </div>

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
                Crisis Support Available
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Emergency Resources & Support
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Access immediate help and support. You&apos;re not alone, and help is available 24/7.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Numbers */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-2xl mb-2">🚨</div>
              <h3 className="font-bold text-blue-600 dark:text-blue-400">Emergency</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">911</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-2xl mb-2">☎️</div>
              <h3 className="font-bold text-blue-600 dark:text-blue-400">Domestic Violence</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">1-800-799-7233</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-bold text-blue-600 dark:text-blue-400">Crisis Text</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">HOME to 741741</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 border ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Emergency Contacts */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {contact.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {contact.type === 'hotline' ? '☎️' : contact.type === 'text' ? '💬' : '💻'}
                    </span>
                  </div>
                  <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {contact.number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Available: {contact.available}
                    </p>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {contact.description}
                  </p>

                  {contact.specialties && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {contact.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {contact.languages && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Languages:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.languages.join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button 
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      Call Now
                    </button>
                    {contact.type === 'text' && (
                      <button 
                        className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => window.open(`sms:${contact.number.split(' ').pop()}`)}
                      >
                        Send Text
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Digital Safety Tips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Protect yourself while seeking help online or through digital resources.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Take Safety With You Everywhere
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Download the DESIST app for discreet access to emergency resources, 
              documentation tools, and safety features wherever you go.
            </p>
            <AppDownloadCTA />
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                Important: Your Safety Comes First
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-400">
              If you are in immediate physical danger, call 911 immediately. If your internet activity is being monitored, 
              consider using a safer computer or device. Clear your browser history after visiting safety resources.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
