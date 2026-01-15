interface BaseAttorney {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: string | undefined;
  };
}

export interface EnrichedAttorney {
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
  barNumber?: string;
  education?: string[];
  experience?: string;
  lat?: number;
  lng?: number;
  // Enriched fields
  practiceAreas?: string[];
  reviews?: Review[];
  socialMedia?: SocialMedia;
  verified?: boolean;
  lastUpdated?: Date;
  // Civil Rights specific fields
  civilRightsFocus?: string[];
  proBonoWork?: boolean;
  immigrationServices?: string[];
  communityInvolvement?: string;
}

interface Review {
  rating: number;
  comment: string;
  source: string;
  date?: Date;
}

interface SocialMedia {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

// Default export for backward compatibility
export default class AttorneyEnrichmentService {
  // This is a placeholder class - the actual implementation would go here
  constructor() {
    // Initialize service
  }

  async enrichMultipleAttorneys(attorneys: BaseAttorney[]): Promise<EnrichedAttorney[]> {
    // Placeholder implementation - just return the attorneys as-is
    return attorneys as unknown as EnrichedAttorney[];
  }
}