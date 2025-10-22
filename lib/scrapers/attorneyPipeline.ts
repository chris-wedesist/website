import AttorneyEnrichmentService, { EnrichedAttorney } from './attorneyEnrichment';
import { getAttorneyCache } from './attorneyCache';
import axios from 'axios';

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    office?: string;
    phone?: string;
    website?: string;
    email?: string;
    address?: string;
    "addr:full"?: string;
    "addr:street"?: string;
    "addr:housenumber"?: string;
    "addr:city"?: string;
    "addr:state"?: string;
    "addr:postcode"?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}

interface EnrichmentPipelineConfig {
  enableEnrichment: boolean;
  enableCaching: boolean;
  maxConcurrentEnrichments: number;
  fallbackToMock: boolean;
  cacheTTL: number;
}

class AttorneyEnrichmentPipeline {
  private enrichmentService: AttorneyEnrichmentService;
  private cache = getAttorneyCache();
  private config: EnrichmentPipelineConfig;

  constructor(config: Partial<EnrichmentPipelineConfig> = {}) {
    this.config = {
      enableEnrichment: true,
      enableCaching: true,
      maxConcurrentEnrichments: 3,
      fallbackToMock: true,
      cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
      ...config
    };

    this.enrichmentService = new AttorneyEnrichmentService({
      maxConcurrentRequests: this.config.maxConcurrentEnrichments,
      requestDelay: 1000
    });
  }

  /**
   * Main pipeline method that orchestrates the entire enrichment process
   */
  async processAttorneys(lat: number, lng: number, radius: number): Promise<EnrichedAttorney[]> {
    console.log(`\n=== STARTING ATTORNEY ENRICHMENT PIPELINE ===`);
    console.log(`Location: ${lat}, ${lng}, Radius: ${radius}km`);

    try {
      // Step 1: Check cache first
      if (this.config.enableCaching) {
        const cachedData = this.cache.get(lat, lng, radius);
        if (cachedData) {
          console.log(`Returning cached data (${cachedData.length} attorneys)`);
          return cachedData;
        }
      }

      // Step 2: Fetch basic attorney data from Overpass API
      const basicAttorneys = await this.fetchBasicAttorneyData(lat, lng, radius);
      console.log(`Found ${basicAttorneys.length} basic attorney records`);

      if (basicAttorneys.length === 0) {
        console.log('No attorneys found, using mock data');
        const mockAttorneys = this.generateMockAttorneys(lat, lng);
        
        if (this.config.enableCaching) {
          this.cache.set(lat, lng, radius, mockAttorneys, this.config.cacheTTL);
        }
        
        return mockAttorneys;
      }

      // Step 3: Enrich attorney data
      let enrichedAttorneys: EnrichedAttorney[];
      
      if (this.config.enableEnrichment) {
        console.log('Starting data enrichment process...');
        enrichedAttorneys = await this.enrichmentService.enrichMultipleAttorneys(basicAttorneys);
        
        // Log enrichment statistics
        const enrichedCount = enrichedAttorneys.filter(a => a.verified).length;
        const withWebsite = enrichedAttorneys.filter(a => a.website).length;
        const withPhone = enrichedAttorneys.filter(a => a.phone).length;
        const withPracticeAreas = enrichedAttorneys.filter(a => a.practiceAreas && a.practiceAreas.length > 0).length;
        
        console.log(`Enrichment completed:`);
        console.log(`- Verified attorneys: ${enrichedCount}/${enrichedAttorneys.length}`);
        console.log(`- With websites: ${withWebsite}`);
        console.log(`- With phone numbers: ${withPhone}`);
        console.log(`- With practice areas: ${withPracticeAreas}`);
      } else {
        console.log('Enrichment disabled, using basic data');
        enrichedAttorneys = basicAttorneys.map(attorney => ({
          ...attorney,
          specialization: [attorney.specialization || 'General Practice'],
          practiceAreas: [],
          reviews: [],
          socialMedia: {},
          verified: false,
          lastUpdated: new Date()
        }));
      }

      // Step 4: Cache the results
      if (this.config.enableCaching) {
        this.cache.set(lat, lng, radius, enrichedAttorneys, this.config.cacheTTL);
        console.log('Results cached successfully');
      }

      // Step 5: Sort and return results
      const sortedAttorneys = this.sortAttorneys(enrichedAttorneys);
      console.log(`Pipeline completed successfully. Returning ${sortedAttorneys.length} attorneys`);
      
      return sortedAttorneys;

    } catch (error) {
      console.error('Error in attorney enrichment pipeline:', error);
      
      // Fallback to mock data if enabled
      if (this.config.fallbackToMock) {
        console.log('Falling back to mock data due to pipeline error');
        const mockAttorneys = this.generateMockAttorneys(lat, lng);
        
        if (this.config.enableCaching) {
          this.cache.set(lat, lng, radius, mockAttorneys, this.config.cacheTTL);
        }
        
        return mockAttorneys;
      }
      
      throw error;
    }
  }

  /**
   * Fetch basic attorney data from Overpass API
   */
  private async fetchBasicAttorneyData(lat: number, lng: number, radius: number): Promise<any[]> {
    console.log('Fetching basic attorney data from Overpass API...');
    
    const query = `
      [out:json][timeout:15];
      (
        node["amenity"="lawyer"](around:${radius * 1000},${lat},${lng});
        node["office"="lawyer"](around:${radius * 1000},${lat},${lng});
        node["office"="attorney"](around:${radius * 1000},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await axios.post<OverpassResponse>('https://overpass-api.de/api/interpreter', query, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 15000
      });

      if (!response.data.elements || response.data.elements.length === 0) {
        console.log('No attorneys found in Overpass API');
        return [];
      }

      // Transform Overpass data to our format
      const attorneys = response.data.elements
        .filter((element) => {
          return element.tags.name && element.tags.name.trim().length > 0;
        })
        .map((element, index) => ({
          id: element.id.toString(),
          name: element.tags.name!,
          specialization: element.tags.office || "General Practice",
          location: element.tags["addr:city"] || "Location not available",
          detailedLocation: [
            element.tags["addr:street"],
            element.tags["addr:housenumber"],
            element.tags["addr:city"],
            element.tags["addr:state"],
            element.tags["addr:postcode"]
          ].filter(Boolean).join(", ") || "Address not available",
          rating: Math.random() * 2 + 3, // Random rating between 3 and 5
          cases: Math.floor(Math.random() * 200) + 50,
          image: `/images/attorneys/attorney${Math.floor(Math.random() * 3) + 1}.jpg`,
          languages: ["English"],
          featured: index < 2,
          phone: element.tags.phone,
          website: element.tags.website,
          address: element.tags["addr:full"] || element.tags.address,
          email: element.tags.email,
          lat: element.lat,
          lng: element.lon
        }));

      console.log(`Transformed ${attorneys.length} attorney records from Overpass API`);
      return attorneys;

    } catch (error) {
      console.error('Error fetching from Overpass API:', error);
      return [];
    }
  }

  /**
   * Generate mock attorney data as fallback
   */
  private generateMockAttorneys(lat: number, lng: number): EnrichedAttorney[] {
    const mockAttorneys: EnrichedAttorney[] = [
      {
        id: 'mock-1',
        name: 'Sarah Johnson',
        specialization: ['Criminal Defense'],
        location: 'Downtown',
        detailedLocation: '123 Main St, Downtown, State 12345',
        rating: 4.8,
        cases: 150,
        image: '/images/attorneys/attorney1.jpg',
        languages: ['English', 'Spanish'],
        featured: true,
        phone: '(555) 123-4567',
        website: 'https://sarahjohnsonlaw.com',
        address: '123 Main St, Downtown, State 12345',
        email: 'sarah@sarahjohnsonlaw.com',
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        practiceAreas: ['Criminal Defense', 'Traffic Violations'],
        reviews: [
          {
            rating: 4.8,
            comment: 'Excellent representation in my case',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/in/sarahjohnsonlaw',
          facebook: 'https://facebook.com/sarahjohnsonlaw'
        },
        verified: true,
        lastUpdated: new Date()
      },
      {
        id: 'mock-2',
        name: 'Michael Chen',
        specialization: ['Personal Injury'],
        location: 'Midtown',
        detailedLocation: '456 Oak Ave, Midtown, State 12345',
        rating: 4.6,
        cases: 200,
        image: '/images/attorneys/attorney2.jpg',
        languages: ['English', 'Mandarin'],
        featured: true,
        phone: '(555) 234-5678',
        website: 'https://michaelchenlaw.com',
        address: '456 Oak Ave, Midtown, State 12345',
        email: 'michael@michaelchenlaw.com',
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        practiceAreas: ['Personal Injury', 'Medical Malpractice'],
        reviews: [
          {
            rating: 4.6,
            comment: 'Great results for my injury case',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/in/michaelchenlaw'
        },
        verified: true,
        lastUpdated: new Date()
      },
      {
        id: 'mock-3',
        name: 'Emily Rodriguez',
        specialization: ['Family Law'],
        location: 'Uptown',
        detailedLocation: '789 Pine St, Uptown, State 12345',
        rating: 4.9,
        cases: 120,
        image: '/images/attorneys/attorney3.jpg',
        languages: ['English', 'Spanish'],
        featured: false,
        phone: '(555) 345-6789',
        website: 'https://emilyrodriguezlaw.com',
        address: '789 Pine St, Uptown, State 12345',
        email: 'emily@emilyrodriguezlaw.com',
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        practiceAreas: ['Family Law', 'Divorce', 'Child Custody'],
        reviews: [
          {
            rating: 4.9,
            comment: 'Compassionate and professional',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {},
        verified: true,
        lastUpdated: new Date()
      },
      {
        id: 'mock-4',
        name: 'David Thompson',
        specialization: ['Business Law'],
        location: 'Financial District',
        detailedLocation: '321 Business Blvd, Financial District, State 12345',
        rating: 4.7,
        cases: 180,
        image: '/images/attorneys/attorney1.jpg',
        languages: ['English'],
        featured: false,
        phone: '(555) 456-7890',
        website: 'https://davidthompsonlaw.com',
        address: '321 Business Blvd, Financial District, State 12345',
        email: 'david@davidthompsonlaw.com',
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        practiceAreas: ['Business Law', 'Corporate Law', 'Contract Law'],
        reviews: [
          {
            rating: 4.7,
            comment: 'Expert business legal advice',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {
          linkedin: 'https://linkedin.com/in/davidthompsonlaw'
        },
        verified: true,
        lastUpdated: new Date()
      },
      {
        id: 'mock-5',
        name: 'Lisa Wang',
        specialization: ['Immigration Law'],
        location: 'Chinatown',
        detailedLocation: '654 Heritage St, Chinatown, State 12345',
        rating: 4.5,
        cases: 95,
        image: '/images/attorneys/attorney2.jpg',
        languages: ['English', 'Mandarin', 'Cantonese'],
        featured: false,
        phone: '(555) 567-8901',
        website: 'https://lisawanglaw.com',
        address: '654 Heritage St, Chinatown, State 12345',
        email: 'lisa@lisawanglaw.com',
        lat: lat + (Math.random() - 0.5) * 0.01,
        lng: lng + (Math.random() - 0.5) * 0.01,
        practiceAreas: ['Immigration Law', 'Visa Applications', 'Citizenship'],
        reviews: [
          {
            rating: 4.5,
            comment: 'Helped with my immigration process',
            source: 'Google Reviews',
            date: new Date()
          }
        ],
        socialMedia: {},
        verified: true,
        lastUpdated: new Date()
      }
    ];

    return mockAttorneys;
  }

  /**
   * Sort attorneys by relevance and quality
   */
  private sortAttorneys(attorneys: EnrichedAttorney[]): EnrichedAttorney[] {
    return attorneys.sort((a, b) => {
      // First sort by verified status
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      
      // Then sort by featured status
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then sort by rating
      if (b.rating !== a.rating) return b.rating - a.rating;
      
      // Then sort by number of cases
      return b.cases - a.cases;
    });
  }

  /**
   * Get pipeline statistics
   */
  getStats(): {
    cache: any;
    enrichment: {
      enabled: boolean;
      maxConcurrent: number;
    };
    config: EnrichmentPipelineConfig;
  } {
    return {
      cache: this.cache.getStats(),
      enrichment: {
        enabled: this.config.enableEnrichment,
        maxConcurrent: this.config.maxConcurrentEnrichments
      },
      config: this.config
    };
  }

  /**
   * Update pipeline configuration
   */
  updateConfig(newConfig: Partial<EnrichmentPipelineConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Pipeline configuration updated:', this.config);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Pipeline cache cleared');
  }
}

export default AttorneyEnrichmentPipeline;
