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

export interface Attorney {
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
} 