'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useTranslation } from '../../context/TranslationContext';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: string;
  progress: number;
  totalParticipants: number;
  userParticipating: boolean;
  startDate: string;
  endDate: string;
  category: 'awareness' | 'fundraising' | 'action' | 'education';
  status: 'active' | 'upcoming' | 'completed';
  image: string;
  rewards: string[];
  steps: string[];
  impact: {
    metric: string;
    current: number;
    target: number;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  deadline: string;
  icon: string;
}

export default function CampaignsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'challenges'>('campaigns');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const campaigns: Campaign[] = [
    {
      id: 'stop-cyber-bullying-2025',
      title: 'Stop Cyberbullying Week 2025',
      description: 'Join our global movement to raise awareness about cyberbullying and share resources for prevention.',
      goal: 'Reach 1 million people with anti-bullying resources',
      progress: 75,
      totalParticipants: 15420,
      userParticipating: true,
      startDate: '2025-09-01',
      endDate: '2025-09-07',
      category: 'awareness',
      status: 'active',
      image: '/campaigns/cyberbullying-week.jpg',
      rewards: ['Digital Badge', 'DESIST Sticker Pack', 'Community Recognition'],
      steps: [
        'Share the campaign on social media',
        'Complete the cyberbullying awareness quiz',
        'Submit your anti-bullying story or tip',
        'Invite 3 friends to join DESIST'
      ],
      impact: {
        metric: 'People Reached',
        current: 750000,
        target: 1000000
      }
    },
    {
      id: 'safe-spaces-fund',
      title: 'Safe Spaces Emergency Fund',
      description: 'Help us provide emergency support grants to harassment victims who need immediate assistance.',
      goal: 'Raise $50,000 for emergency support grants',
      progress: 60,
      totalParticipants: 8920,
      userParticipating: false,
      startDate: '2025-08-15',
      endDate: '2025-10-15',
      category: 'fundraising',
      status: 'active',
      image: '/campaigns/safe-spaces-fund.jpg',
      rewards: ['Donor Badge', 'Thank You Letter', 'Impact Report Access'],
      steps: [
        'Make a donation of any amount',
        'Share the campaign with your network',
        'Write a message of support',
        'Follow impact updates'
      ],
      impact: {
        metric: 'Funds Raised',
        current: 30000,
        target: 50000
      }
    },
    {
      id: 'digital-rights-petition',
      title: 'Digital Rights Protection Act',
      description: 'Support legislation that would strengthen protections against online harassment and improve platform accountability.',
      goal: 'Collect 100,000 petition signatures',
      progress: 85,
      totalParticipants: 94300,
      userParticipating: true,
      startDate: '2025-07-01',
      endDate: '2025-09-30',
      category: 'action',
      status: 'active',
      image: '/campaigns/digital-rights.jpg',
      rewards: ['Activist Badge', 'Policy Updates', 'Capitol Hill Briefing Access'],
      steps: [
        'Sign the petition',
        'Contact your representatives',
        'Share petition on social media',
        'Attend virtual advocacy session'
      ],
      impact: {
        metric: 'Signatures Collected',
        current: 85240,
        target: 100000
      }
    },
    {
      id: 'mentor-training-program',
      title: 'Community Mentor Training',
      description: 'Join our program to become a certified peer support mentor and help others navigate harassment situations.',
      goal: 'Train 500 new community mentors',
      progress: 40,
      totalParticipants: 280,
      userParticipating: false,
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      category: 'education',
      status: 'active',
      image: '/campaigns/mentor-training.jpg',
      rewards: ['Mentor Certification', 'Exclusive Training Materials', 'Leadership Badge'],
      steps: [
        'Complete application form',
        'Attend 4-week training course',
        'Pass certification exam',
        'Complete 20 hours of mentoring'
      ],
      impact: {
        metric: 'Mentors Trained',
        current: 200,
        target: 500
      }
    }
  ];

  const challenges: Challenge[] = [
    {
      id: 'daily-kindness',
      title: 'Daily Kindness Challenge',
      description: 'Perform one act of digital kindness today',
      type: 'daily',
      difficulty: 'easy',
      points: 10,
      completed: true,
      deadline: '2025-09-01T23:59:59Z',
      icon: '💝'
    },
    {
      id: 'privacy-checkup',
      title: 'Privacy Settings Checkup',
      description: 'Review and update privacy settings on 3 social platforms',
      type: 'weekly',
      difficulty: 'medium',
      points: 50,
      completed: false,
      deadline: '2025-09-07T23:59:59Z',
      icon: '🔒'
    },
    {
      id: 'harassment-education',
      title: 'Complete Harassment Prevention Course',
      description: 'Finish our comprehensive online course about harassment prevention',
      type: 'monthly',
      difficulty: 'hard',
      points: 200,
      completed: false,
      deadline: '2025-09-30T23:59:59Z',
      icon: '🎓'
    },
    {
      id: 'story-sharing',
      title: 'Share Your Story',
      description: 'Share an anonymous story about overcoming harassment',
      type: 'weekly',
      difficulty: 'medium',
      points: 75,
      completed: false,
      deadline: '2025-09-07T23:59:59Z',
      icon: '📝'
    },
    {
      id: 'support-someone',
      title: 'Support Someone in Need',
      description: 'Provide encouragement to someone in the community forums',
      type: 'daily',
      difficulty: 'easy',
      points: 15,
      completed: false,
      deadline: '2025-09-01T23:59:59Z',
      icon: '🤝'
    }
  ];

  const filteredCampaigns = selectedCategory === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.category === selectedCategory);

  const difficultyColors = {
    easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    hard: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
  };

  const handleJoinCampaign = (campaignId: string) => {
    // Implement campaign joining logic
    console.log('Joining campaign:', campaignId);
  };

  const handleCompleteChallenge = (challengeId: string) => {
    // Implement challenge completion logic
    console.log('Completing challenge:', challengeId);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            {/* <Badge variant="default" className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
              Community Action
            </Badge> */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('campaigns.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('campaigns.hero.description')}
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 flex shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === 'campaigns'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('campaigns.tabs.campaigns')}
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === 'challenges'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('campaigns.tabs.challenges')}
            </button>
          </div>
        </div>

        {activeTab === 'campaigns' && (
          <div>
            {/* Campaign Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['all', 'awareness', 'fundraising', 'action', 'education'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-200 border ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t(`campaigns.filters.${category === 'all' ? 'all' : category}`)}
                </button>
              ))}
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {t(`campaigns.filters.${campaign.category}`)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        campaign.status === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {t(`campaigns.status.${campaign.status}`)}
                      </span>
                    </div>
                    {campaign.userParticipating && (
                      <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                        {t('campaigns.campaign.participating')}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl mb-2 font-semibold text-gray-900 dark:text-white">{campaign.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {campaign.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {campaign.impact.metric}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {campaign.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{campaign.impact.current.toLocaleString()}</span>
                      <span>{t('campaigns.campaign.goal')} {campaign.impact.target.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {campaign.totalParticipants.toLocaleString()} {t('campaigns.campaign.participants')}
                    </span>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {t('campaigns.campaign.howToParticipate')}
                    </h4>
                    <ul className="space-y-1">
                      {campaign.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rewards */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      {t('campaigns.campaign.rewards')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.rewards.map((reward, rewardIndex) => (
                        <span key={rewardIndex} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      campaign.userParticipating
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${campaign.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleJoinCampaign(campaign.id)}
                    disabled={campaign.status !== 'active'}
                  >
                    {campaign.userParticipating ? t('campaigns.campaign.continue') : t('campaigns.campaign.join')}
                  </button>

                  {/* Timeline */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div>
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-600 dark:text-gray-400">
                {t('campaigns.challenges.description')}
              </p>
            </motion.div>

            {/* Challenge Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {['daily', 'weekly', 'monthly'].map((type, index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
                >
                  <div className="text-2xl mb-2">
                    {type === 'daily' && '☀️'}
                    {type === 'weekly' && '📅'}
                    {type === 'monthly' && '🗓️'}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t(`campaigns.challenges.${type}`)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {challenges.filter(c => c.type === type).length} {t('campaigns.challenges.available')}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Challenges List */}
            <div className="grid grid-cols-1 gap-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl ${challenge.completed ? 'opacity-75 border border-blue-200 dark:border-blue-800' : ''}`}
                >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">
                            {challenge.completed ? '✅' : challenge.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {challenge.title}
                              </h3>
                              <Badge className={difficultyColors[challenge.difficulty]}>
                                {t(`campaigns.challenges.difficulty.${challenge.difficulty}`)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {challenge.type}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {challenge.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{challenge.points} {t('campaigns.challenges.points')}</span>
                            <span>⏰ {t('campaigns.challenges.due')} {new Date(challenge.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button
                            size="sm"
                            variant={challenge.completed ? 'outline' : 'primary'}
                            onClick={() => handleCompleteChallenge(challenge.id)}
                            disabled={challenge.completed}
                            className={challenge.completed ? '' : 'bg-blue-600 hover:bg-blue-700'}
                          >
                            {challenge.completed ? t('campaigns.challenges.completed') : t('campaigns.challenges.start')}
                          </Button>
                        </div>
                      </div>
                </motion.div>
              ))}
            </div>

            {/* Challenge Stats */}
            <motion.div 
              className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('campaigns.challenges.progressTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {challenges.filter(c => c.completed).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('campaigns.challenges.completedLabel')}
                      </div>
                    </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('campaigns.challenges.pointsEarned')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    7
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('campaigns.challenges.dayStreak')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    #42
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('campaigns.challenges.globalRank')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
