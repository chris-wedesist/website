"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  children?: React.ReactNode;
  className?: string;
}

export const HeroSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  children,
  className = ''
}: HeroSectionProps) => {
  return (
    <section className={`relative min-h-[60vh] flex items-center ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            {description}
          </p>
          {children}
        </motion.div>
      </div>
    </section>
  );
}; 