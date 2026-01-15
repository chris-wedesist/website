import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "../context/TranslationContext";

interface CallToActionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  pageType?: 'incidents' | 'about' | 'contact' | 'default';
}

export const CallToAction = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  pageType = 'default',
}: CallToActionProps) => {
  const { t } = useTranslation();
  
  const renderVisualElement = () => {
    switch (pageType) {
      case 'incidents':
        return (
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br dark:from-gray-700 from-gray-900 to-gray-500 dark:to-gray-800/40 p-1">
            {/* Map Background */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-red-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />

            {/* Map Pins */}
            <div className="absolute inset-0 p-8">
              {/* Main Pin */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                whileInView={{ scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                </div>
              </motion.div>

              {/* Secondary Pins */}
              {[
                  // { x: '20%', y: '30%', delay: 0.3, status: 'active' },
                  // { x: '75%', y: '40%', delay: 0.4, status: 'resolved' },
                  // { x: '35%', y: '70%', delay: 0.5, status: 'investigating' },
                  // { x: '80%', y: '65%', delay: 0.6, status: 'active' }
              ].map((pin, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  // transition={{ duration: 0.3, delay: pin.delay }}
                  className="absolute"
                  // style={{ left: pin.x, top: pin.y }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45" />
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${
                      // pin.status === 'active' ? 'bg-red-500 text-white' :
                      // pin.status === 'resolved' ? 'bg-green-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {/* {pin.status} */}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  d="M50% 50% L20% 30% M50% 50% L75% 40% M50% 50% L35% 70% M50% 50% L80% 65%"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Content Box */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-white/80">{description}</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <div className="bg-white/10 rounded-lg px-4 py-2">
                        <div className="text-white font-bold">100+</div>
                        <div className="text-white/60 text-sm">Active Reports</div>
                      </div>
                      <div className="bg-white/10 rounded-lg px-4 py-2">
                        <div className="text-white font-bold">24/7</div>
                        <div className="text-white/60 text-sm">Monitoring</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br dark:from-gray-700 from-gray-900 to-gray-500 dark:to-gray-800/40 p-1">
            {/* About page visual element */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Interactive Elements */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-between">
              {/* Top Section with Icons */}
              <div className="w-full flex justify-center items-center gap-8 mt-8">
                {[
                  { icon: "👥", label: "Community" },
                  { icon: "🤝", label: "Partnership" },
                  { icon: "💪", label: "Strength" },
                  { icon: "🌟", label: "Impact" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex flex-col items-center justify-center backdrop-blur-lg border border-blue-400/20">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-blue-400 text-xs mt-2">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Content Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/20 w-4/5 mb-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">{title}</h3>
                  <p className="text-blue-300/80">{description}</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                      <div className="text-blue-400 font-bold">10K+</div>
                      <div className="text-blue-300/60 text-sm">Members</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                      <div className="text-blue-400 font-bold">50+</div>
                      <div className="text-blue-300/60 text-sm">Partners</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br dark:from-gray-700 from-gray-900 to-gray-500 dark:to-gray-800/40 p-1">
            {/* Contact page visual element */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />

            {/* Interactive Elements */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-between">
              {/* Top Section with Contact Methods */}
              <div className="w-full flex justify-center items-center gap-8 mt-8">
                {[
                  { icon: "📱", label: "Phone", value: "1-800-555-0000" },
                  { icon: "📧", label: "Email", value: "support@wedesist.com" },
                  { icon: "📍", label: "Office", value: "San Francisco, CA" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-4 border border-green-400/20 text-center">
                      <span className="text-2xl block mb-2">{item.icon}</span>
                      <span className="text-green-400 text-sm block">{item.label}</span>
                      <span className="text-green-300/60 text-xs block mt-1">{item.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Content Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-400/20 w-4/5 mb-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-400 mb-2">{title}</h3>
                  <p className="text-green-300/80">{description}</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="bg-green-500/20 rounded-lg px-4 py-2">
                      <div className="text-green-400 font-bold">24/7</div>
                      <div className="text-green-300/60 text-sm">Support</div>
                    </div>
                    <div className="bg-green-500/20 rounded-lg px-4 py-2">
                      <div className="text-green-400 font-bold">15min</div>
                      <div className="text-green-300/60 text-sm">Response</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br dark:from-gray-700 from-gray-900 to-gray-500 dark:to-gray-800/40 p-1">
            {/* Default visual element */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Interactive Elements */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-between">
              {/* Top Section with Lightning Bolt */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-lg border border-blue-400/20">
                  <svg className="w-16 h-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </motion.div>

              {/* Content Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/20 w-4/5 mb-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">{title}</h3>
                  <p className="text-blue-300/80">{description}</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                      <div className="text-blue-400 font-bold">100K+</div>
                      <div className="text-blue-300/60 text-sm">Users</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg px-4 py-2">
                      <div className="text-blue-400 font-bold">4.9/5</div>
                      <div className="text-blue-300/60 text-sm">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm">
                  {t('cta.readyToStart')}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  {title}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Link
                  href={primaryAction.href}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl overflow-hidden transition-all duration-300 hover:bg-blue-700"
                >
                  <span className="relative z-10 font-semibold">{primaryAction.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute right-0 w-12 h-full bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Link>

                {secondaryAction && (
                  <Link
                    href={secondaryAction.href}
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span className="relative z-10 font-semibold">{secondaryAction.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {renderVisualElement()}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 