"use client";
import { HeroSection } from "./components/HeroSection";
import { StatsDisplay } from "./components/StatsDisplay";
import { FeatureGrid } from "./components/FeatureGrid";
import { CallToAction } from "./components/CallToAction";
import FeaturedNews from './components/FeaturedNews';
import { NewsletterSignup } from "./components/NewsletterSignup";
import { AnnouncementSystem } from "./components/AnnouncementSystem";
import { useTranslation } from "./context/TranslationContext";

export default function JoinPage() {
  const { t } = useTranslation();

  const impactStats = [
    {
      value: t('home.impact.stats.members.value'),
      label: t('home.impact.stats.members.label'),
      icon: "👥",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      value: t('home.impact.stats.partners.value'),
      label: t('home.impact.stats.partners.label'),
      icon: "🤝",
      color: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      value: t('home.impact.stats.supported.value'),
      label: t('home.impact.stats.supported.label'),
      icon: "❤️",
      color: "bg-red-100 dark:bg-red-900/30"
    },
    {
      value: t('home.impact.stats.support.value'),
      label: t('home.impact.stats.support.label'),
      icon: "🌟",
      color: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  const volunteerFeatures = [
    {
      icon: "✋",
      title: t('home.volunteer.features.outreach.title'),
      description: t('home.volunteer.features.outreach.description'),
      link: {
        label: t('home.volunteer.features.outreach.link'),
        href: "#outreach"
      }
    },
    {
      icon: "📅",
      title: t('home.volunteer.features.events.title'),
      description: t('home.volunteer.features.events.description'),
      link: {
        label: t('home.volunteer.features.events.link'),
        href: "#events"
      }
    },
    {
      icon: "📦",
      title: t('home.volunteer.features.resources.title'),
      description: t('home.volunteer.features.resources.description'),
      link: {
        label: t('home.volunteer.features.resources.link'),
        href: "#resources"
      }
    }
  ];

  const partnerFeatures = [
    {
      icon: "🤝",
      title: t('home.partner.features.organizations.title'),
      description: t('home.partner.features.organizations.description'),
      link: {
        label: t('home.partner.features.organizations.link'),
        href: "#partner"
      }
    },
    {
      icon: "🔄",
      title: t('home.partner.features.sharing.title'),
      description: t('home.partner.features.sharing.description'),
      link: {
        label: t('home.partner.features.sharing.link'),
        href: "#share"
      }
    },
    {
      icon: "🎯",
      title: t('home.partner.features.initiatives.title'),
      description: t('home.partner.features.initiatives.description'),
      link: {
        label: t('home.partner.features.initiatives.link'),
        href: "#initiatives"
      }
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Announcement System */}
      <AnnouncementSystem position="top" maxVisible={2} />

      {/* Hero Section */}
      <HeroSection
        title={t('home.hero.title')}
        description={t('home.hero.description')}
        imageSrc="/images/community/community-hero.jpg"
        imageAlt="DESIST Community"
      >
      </HeroSection>

      {/* Impact Stats */}
      <StatsDisplay
        title={t('home.impact.title')}
        description={t('home.impact.description')}
        stats={impactStats}
      />

      {/* Volunteer Opportunities */}
      <FeatureGrid
        title={t('home.volunteer.title')}
        description={t('home.volunteer.description')}
        features={volunteerFeatures}
        columns={3}
        variant="bordered"
      />

      {/* Partnership Opportunities */}
      <FeatureGrid
        title={t('home.partner.title')}
        description={t('home.partner.description')}
        features={partnerFeatures}
        columns={3}
        variant="minimal"
      />

      {/* Add FeaturedNews after the hero section */}
      <div className="container mx-auto px-4 py-12">
        <FeaturedNews />
      </div>

      {/* Newsletter Signup */}
      <div className="container mx-auto px-4 py-12">
        <NewsletterSignup />
      </div>

      {/* Mobile App Section */}
      <CallToAction
        title={t('home.mobile.title')}
        description={t('home.mobile.description')}
        primaryAction={{
          label: t('home.mobile.download'),
          href: "#download"
        }}
        secondaryAction={{
          label: t('home.mobile.learnMore'),
          href: "/about"
        }}
        pageType="default"
      />
    </div>
  );
} 
