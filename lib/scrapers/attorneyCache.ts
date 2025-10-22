import { EnrichedAttorney } from './attorneyEnrichment';

interface CacheEntry {
  data: EnrichedAttorney[];
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cache entries
  cleanupInterval: number; // Cleanup interval in milliseconds
}

class AttorneyCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 1000,
      cleanupInterval: 60 * 60 * 1000, // 1 hour
      ...config
    };

    this.startCleanupTimer();
  }

  /**
   * Generate cache key from location parameters
   */
  private generateCacheKey(lat: number, lng: number, radius: number): string {
    // Round coordinates to reduce cache fragmentation
    const roundedLat = Math.round(lat * 1000) / 1000;
    const roundedLng = Math.round(lng * 1000) / 1000;
    const roundedRadius = Math.round(radius);
    
    return `attorneys_${roundedLat}_${roundedLng}_${roundedRadius}`;
  }

  /**
   * Get cached attorneys data
   */
  get(lat: number, lng: number, radius: number): EnrichedAttorney[] | null {
    const key = this.generateCacheKey(lat, lng, radius);
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`Cache miss for key: ${key}`);
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      console.log(`Cache expired for key: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`Cache hit for key: ${key}`);
    return entry.data;
  }

  /**
   * Set attorneys data in cache
   */
  set(lat: number, lng: number, radius: number, data: EnrichedAttorney[], ttl?: number): void {
    const key = this.generateCacheKey(lat, lng, radius);
    const now = Date.now();
    const expiresAt = now + (ttl || this.config.defaultTTL);

    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt
    };

    this.cache.set(key, entry);
    console.log(`Cached data for key: ${key}, expires at: ${new Date(expiresAt).toISOString()}`);

    // Check if we need to clean up old entries
    if (this.cache.size > this.config.maxSize) {
      this.cleanupOldEntries();
    }
  }

  /**
   * Check if data exists in cache and is not expired
   */
  has(lat: number, lng: number, radius: number): boolean {
    const key = this.generateCacheKey(lat, lng, radius);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove specific cache entry
   */
  delete(lat: number, lng: number, radius: number): boolean {
    const key = this.generateCacheKey(lat, lng, radius);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{
      key: string;
      timestamp: Date;
      expiresAt: Date;
      dataCount: number;
    }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: new Date(entry.timestamp),
      expiresAt: new Date(entry.expiresAt),
      dataCount: entry.data.length
    }));

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // This would need to be tracked separately
      entries
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanupOldEntries(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} expired cache entries`);
    }

    // If still over max size, remove oldest entries
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
      
      console.log(`Removed ${toRemove.length} oldest cache entries to stay under limit`);
    }
  }

  /**
   * Start periodic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupOldEntries();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * Get cache entry with metadata
   */
  getWithMetadata(lat: number, lng: number, radius: number): {
    data: EnrichedAttorney[] | null;
    metadata: {
      cached: boolean;
      timestamp?: Date;
      expiresAt?: Date;
      age?: number;
    };
  } {
    const key = this.generateCacheKey(lat, lng, radius);
    const entry = this.cache.get(key);

    if (!entry) {
      return {
        data: null,
        metadata: { cached: false }
      };
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return {
        data: null,
        metadata: { cached: false }
      };
    }

    return {
      data: entry.data,
      metadata: {
        cached: true,
        timestamp: new Date(entry.timestamp),
        expiresAt: new Date(entry.expiresAt),
        age: now - entry.timestamp
      }
    };
  }

  /**
   * Preload cache with data
   */
  preload(lat: number, lng: number, radius: number, data: EnrichedAttorney[]): void {
    this.set(lat, lng, radius, data);
  }

  /**
   * Check if cache is healthy
   */
  isHealthy(): boolean {
    const stats = this.getStats();
    return stats.size < stats.maxSize * 0.9; // Healthy if under 90% capacity
  }
}

// Singleton instance
let cacheInstance: AttorneyCacheService | null = null;

export function getAttorneyCache(): AttorneyCacheService {
  if (!cacheInstance) {
    cacheInstance = new AttorneyCacheService();
  }
  return cacheInstance;
}

export default AttorneyCacheService;
