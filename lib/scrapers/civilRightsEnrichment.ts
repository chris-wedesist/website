
/**
 * Civil Rights Attorney Enrichment Service
 * Specialized for finding civil rights, immigration, and social justice lawyers
 */

interface BaseAttorney {
  id: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface CivilRightsAttorney {
  id: string;
  name: string;
  specialization: string[];
  location: string;
  detailedLocation: string;
  rating: number;
  cases: number;
  image: string;
  languages: string[];
  featured: boolean;
  phone?: string;
  website?: string;
  address?: string;
  email?: string;
  lat?: number;
  lng?: number;
  // Civil rights specific fields
  practiceAreas: string[];
  reviews: Review[];
  socialMedia: SocialMedia;
  verified: boolean;
  lastUpdated: Date;
  // Civil rights specific
  civilRightsFocus: string[];
  immigrationServices: string[];
  proBonoWork: boolean;
  communityInvolvement: string[];
  languagesSpoken: string[];
}

export interface Review {
  rating: number;
  comment: string;
  source: string;
  date?: Date;
}

export interface SocialMedia {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

// Civil rights specific practice areas
// const CIVIL_RIGHTS_PRACTICE_AREAS = [
//   'Civil Rights Law',
//   'Immigration Law',
//   'Constitutional Law',
//   'Police Misconduct',
//   'Discrimination Law',
//   'Asylum & Refugee Law',
//   'Deportation Defense',
//   'First Amendment Rights',
//   'Voting Rights',
//   'Employment Discrimination',
//   'Housing Discrimination',
//   'Education Law',
//   'Disability Rights',
//   'LGBTQ+ Rights',
//   'Women\'s Rights',
//   'Racial Justice',
//   'Criminal Justice Reform',
//   'Prisoners\' Rights',
//   'Environmental Justice',
//   'Immigrant Rights'
// ];

// // Pakistani civil rights keywords
// const PAKISTANI_CIVIL_RIGHTS_KEYWORDS = [
//   'human rights',
//   'asylum',
//   'refugee',
//   'women rights',
//   'minority rights',
//   'blasphemy',
//   'forced conversion',
//   'honor killing',
//   'domestic violence',
//   'child marriage',
//   'forced marriage',
//   'acid attack',
//   'religious freedom',
//   'freedom of speech',
//   'press freedom',
//   'political asylum',
//   'refugee status',
//   'deportation',
//   'discrimination',
//   'equality'
// ];

class CivilRightsAttorneyEnrichmentService {
  private googleApiKey?: string;
  private googleCseId?: string;

  constructor() {
    // Temporarily disabled due to quota
    this.googleApiKey = undefined;
    this.googleCseId = undefined;
  }

  /**
   * Determine if an attorney specializes in civil rights based on their name and description
   */
  determineCivilRightsSpecialization(name: string, description?: string): string[] {
    const nameLower = name.toLowerCase();
    const descLower = (description || '').toLowerCase();
    const combinedText = `${nameLower} ${descLower}`;
    
    const specializations: string[] = [];
    
    // Check for civil rights keywords
    if (combinedText.includes('civil rights') || combinedText.includes('human rights')) {
      specializations.push('Civil Rights Law');
    }
    
    if (combinedText.includes('immigration') || combinedText.includes('asylum') || combinedText.includes('refugee')) {
      specializations.push('Immigration Law');
      specializations.push('Asylum & Refugee Law');
    }
    
    if (combinedText.includes('constitutional') || combinedText.includes('constitution')) {
      specializations.push('Constitutional Law');
    }
    
    if (combinedText.includes('police') || combinedText.includes('misconduct')) {
      specializations.push('Police Misconduct');
    }
    
    if (combinedText.includes('discrimination') || combinedText.includes('equality')) {
      specializations.push('Discrimination Law');
    }
    
    if (combinedText.includes('employment') && combinedText.includes('discrimination')) {
      specializations.push('Employment Discrimination');
    }
    
    if (combinedText.includes('housing') && combinedText.includes('discrimination')) {
      specializations.push('Housing Discrimination');
    }
    
    if (combinedText.includes('education') && combinedText.includes('law')) {
      specializations.push('Education Law');
    }
    
    if (combinedText.includes('disability') || combinedText.includes('accessibility')) {
      specializations.push('Disability Rights');
    }
    
    if (combinedText.includes('lgbt') || combinedText.includes('lgbtq') || combinedText.includes('transgender')) {
      specializations.push('LGBTQ+ Rights');
    }
    
    if (combinedText.includes('women') && combinedText.includes('rights')) {
      specializations.push('Women\'s Rights');
    }
    
    if (combinedText.includes('racial') || combinedText.includes('race')) {
      specializations.push('Racial Justice');
    }
    
    if (combinedText.includes('criminal') && combinedText.includes('justice')) {
      specializations.push('Criminal Justice Reform');
    }
    
    if (combinedText.includes('prisoner') || combinedText.includes('prison')) {
      specializations.push('Prisoners\' Rights');
    }
    
    if (combinedText.includes('environmental') && combinedText.includes('justice')) {
      specializations.push('Environmental Justice');
    }
    
    // Pakistani specific civil rights issues
    if (combinedText.includes('blasphemy')) {
      specializations.push('Constitutional Law');
      specializations.push('Religious Freedom');
    }
    
    if (combinedText.includes('honor killing') || combinedText.includes('honour killing')) {
      specializations.push('Women\'s Rights');
      specializations.push('Criminal Justice Reform');
    }
    
    if (combinedText.includes('forced conversion') || combinedText.includes('forced marriage')) {
      specializations.push('Religious Freedom');
      specializations.push('Women\'s Rights');
    }
    
    if (combinedText.includes('acid attack')) {
      specializations.push('Women\'s Rights');
      specializations.push('Criminal Justice Reform');
    }
    
    // If no specific civil rights specialization found, check if it's a general civil rights firm
    if (specializations.length === 0) {
      // Check for general civil rights indicators
      if (combinedText.includes('rights') || combinedText.includes('justice') || combinedText.includes('equality')) {
        specializations.push('Civil Rights Law');
      }
    }
    
    return specializations;
  }

  /**
   * Filter attorneys to only include those with civil rights focus
   */
  filterCivilRightsAttorneys(attorneys: BaseAttorney[]): CivilRightsAttorney[] {
    return attorneys
      .map(attorney => {
        const civilRightsFocus = this.determineCivilRightsSpecialization(attorney.name, attorney.description);
        
        return {
          id: attorney.id.toString(),
          name: (attorney.tags as { name?: string })?.name || 'Unknown Attorney',
          specialization: civilRightsFocus.length > 0 ? civilRightsFocus : ['General Practice'],
          location: 'Location not available',
          detailedLocation: 'Address not available',
          rating: Math.random() * 2 + 3, // Random rating between 3 and 5
          cases: Math.floor(Math.random() * 200) + 50,
          image: `/images/attorneys/attorney${Math.floor(Math.random() * 3) + 1}.jpg`,
          languages: ['English', 'Urdu'],
          featured: false,
          lat: typeof attorney.lat === 'number' ? attorney.lat : undefined,
          lng: typeof attorney.lon === 'number' ? attorney.lon : undefined,
          practiceAreas: civilRightsFocus,
          reviews: [],
          socialMedia: {},
          languagesSpoken: ['English', 'Urdu'],
          civilRightsFocus,
          immigrationServices: civilRightsFocus.includes('Immigration Law') ? ['Asylum', 'Refugee Status', 'Deportation Defense'] : [],
          proBonoWork: civilRightsFocus.length > 0,
          communityInvolvement: civilRightsFocus.length > 0 ? ['Human Rights Advocacy', 'Community Legal Aid'] : [],
          verified: civilRightsFocus.length > 0,
          lastUpdated: new Date()
        };
      })
      .filter(attorney => attorney.civilRightsFocus.length > 0); // Only return civil rights attorneys
  }

  /**
   * Search for civil rights attorneys using specialized queries
   */
  async searchCivilRightsAttorneys(location: string): Promise<CivilRightsAttorney[]> {
    console.log(`🔍 Searching for civil rights attorneys in ${location}`);
    
    // For now, return mock civil rights attorneys since Google API quota is exceeded
    return this.generateMockCivilRightsAttorneys(location);
  }

  /**
   * Generate mock civil rights attorneys for testing
   */
  generateMockCivilRightsAttorneys(location: string): CivilRightsAttorney[] {
    const mockAttorneys: CivilRightsAttorney[] = [
      {
        id: 'civil-1',
        name: 'Karachi Human Rights Legal Aid Center',
        specialization: ['Civil Rights Law', 'Immigration Law', 'Women\'s Rights'],
        location: location,
        detailedLocation: `${location}, Pakistan`,
        rating: 4.8,
        cases: 150,
        image: '/images/attorneys/civil-rights-1.jpg',
        languages: ['English', 'Urdu', 'Sindhi'],
        featured: true,
        phone: '+92-21-1234567',
        website: 'https://khrlac.org.pk',
        email: 'info@khrlac.org.pk',
        lat: 24.93,
        lng: 67.09,
        practiceAreas: ['Civil Rights Law', 'Immigration Law', 'Women\'s Rights', 'Asylum & Refugee Law'],
        reviews: [
          {
            rating: 5.0,
            comment: 'Excellent help with asylum case',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          facebook: 'https://facebook.com/khrlac',
          twitter: 'https://twitter.com/khrlac'
        },
        verified: true,
        lastUpdated: new Date(),
        civilRightsFocus: ['Civil Rights Law', 'Immigration Law', 'Women\'s Rights'],
        immigrationServices: ['Asylum', 'Refugee Status', 'Deportation Defense'],
        proBonoWork: true,
        communityInvolvement: ['Human Rights Advocacy', 'Women\'s Rights Campaign'],
        languagesSpoken: ['English', 'Urdu', 'Sindhi', 'Punjabi']
      },
      {
        id: 'civil-2',
        name: 'Pakistan Immigration & Refugee Legal Services',
        specialization: ['Immigration Law', 'Asylum & Refugee Law', 'Constitutional Law'],
        location: location,
        detailedLocation: `${location}, Pakistan`,
        rating: 4.6,
        cases: 200,
        image: '/images/attorneys/civil-rights-2.jpg',
        languages: ['English', 'Urdu', 'Arabic'],
        featured: true,
        phone: '+92-21-2345678',
        website: 'https://pirlegal.org',
        email: 'help@pirlegal.org',
        lat: 24.94,
        lng: 67.10,
        practiceAreas: ['Immigration Law', 'Asylum & Refugee Law', 'Constitutional Law', 'Deportation Defense'],
        reviews: [
          {
            rating: 4.8,
            comment: 'Helped with refugee status application',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/company/pirlegal',
          facebook: 'https://facebook.com/pirlegal'
        },
        verified: true,
        lastUpdated: new Date(),
        civilRightsFocus: ['Immigration Law', 'Asylum & Refugee Law', 'Constitutional Law'],
        immigrationServices: ['Asylum', 'Refugee Status', 'Deportation Defense', 'Family Reunification'],
        proBonoWork: true,
        communityInvolvement: ['Refugee Support', 'Immigrant Rights Advocacy'],
        languagesSpoken: ['English', 'Urdu', 'Arabic', 'Pashto']
      },
      {
        id: 'civil-3',
        name: 'Women\'s Rights Legal Foundation',
        specialization: ['Women\'s Rights', 'Domestic Violence', 'Discrimination Law'],
        location: location,
        detailedLocation: `${location}, Pakistan`,
        rating: 4.9,
        cases: 120,
        image: '/images/attorneys/civil-rights-3.jpg',
        languages: ['English', 'Urdu'],
        featured: true,
        phone: '+92-21-3456789',
        website: 'https://wrlfoundation.pk',
        email: 'support@wrlfoundation.pk',
        lat: 24.92,
        lng: 67.08,
        practiceAreas: ['Women\'s Rights', 'Domestic Violence', 'Discrimination Law', 'Employment Discrimination'],
        reviews: [
          {
            rating: 5.0,
            comment: 'Life-saving help with domestic violence case',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          facebook: 'https://facebook.com/wrlfoundation',
          instagram: 'https://instagram.com/wrlfoundation'
        },
        verified: true,
        lastUpdated: new Date(),
        civilRightsFocus: ['Women\'s Rights', 'Domestic Violence', 'Discrimination Law'],
        immigrationServices: [],
        proBonoWork: true,
        communityInvolvement: ['Women\'s Rights Campaign', 'Domestic Violence Support'],
        languagesSpoken: ['English', 'Urdu', 'Sindhi']
      },
      {
        id: 'civil-4',
        name: 'Minority Rights Legal Aid Society',
        specialization: ['Religious Freedom', 'Constitutional Law', 'Discrimination Law'],
        location: location,
        detailedLocation: `${location}, Pakistan`,
        rating: 4.7,
        cases: 80,
        image: '/images/attorneys/civil-rights-4.jpg',
        languages: ['English', 'Urdu', 'Sindhi'],
        featured: false,
        phone: '+92-21-4567890',
        website: 'https://mrllegal.org',
        email: 'legal@mrllegal.org',
        lat: 24.91,
        lng: 67.07,
        practiceAreas: ['Religious Freedom', 'Constitutional Law', 'Discrimination Law', 'First Amendment Rights'],
        reviews: [
          {
            rating: 4.6,
            comment: 'Strong advocate for religious freedom',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          twitter: 'https://twitter.com/mrllegal',
          facebook: 'https://facebook.com/mrllegal'
        },
        verified: true,
        lastUpdated: new Date(),
        civilRightsFocus: ['Religious Freedom', 'Constitutional Law', 'Discrimination Law'],
        immigrationServices: [],
        proBonoWork: true,
        communityInvolvement: ['Religious Freedom Advocacy', 'Minority Rights Support'],
        languagesSpoken: ['English', 'Urdu', 'Sindhi', 'Punjabi']
      },
      {
        id: 'civil-5',
        name: 'Criminal Justice Reform Initiative',
        specialization: ['Criminal Justice Reform', 'Prisoners\' Rights', 'Constitutional Law'],
        location: location,
        detailedLocation: `${location}, Pakistan`,
        rating: 4.5,
        cases: 90,
        image: '/images/attorneys/civil-rights-5.jpg',
        languages: ['English', 'Urdu'],
        featured: false,
        phone: '+92-21-5678901',
        website: 'https://cjri.pk',
        email: 'info@cjri.pk',
        lat: 24.90,
        lng: 67.06,
        practiceAreas: ['Criminal Justice Reform', 'Prisoners\' Rights', 'Constitutional Law', 'Police Misconduct'],
        reviews: [
          {
            rating: 4.4,
            comment: 'Dedicated to criminal justice reform',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/company/cjri',
          twitter: 'https://twitter.com/cjri_pk'
        },
        verified: true,
        lastUpdated: new Date(),
        civilRightsFocus: ['Criminal Justice Reform', 'Prisoners\' Rights', 'Constitutional Law'],
        immigrationServices: [],
        proBonoWork: true,
        communityInvolvement: ['Criminal Justice Reform', 'Prisoners\' Rights Advocacy'],
        languagesSpoken: ['English', 'Urdu', 'Punjabi']
      }
    ];

    return mockAttorneys;
  }
}

export default CivilRightsAttorneyEnrichmentService;
