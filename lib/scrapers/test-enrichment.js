#!/usr/bin/env node

/**
 * Test script for Attorney Enrichment System
 * 
 * This script demonstrates how the enrichment pipeline works
 * Run with: node test-enrichment.js
 */

import AttorneyEnrichmentPipeline from './attorneyPipeline.js';
import { getAttorneyCache } from './attorneyCache.js';

async function testEnrichmentPipeline() {
  console.log('🧪 Testing Attorney Enrichment Pipeline\n');

  // Initialize pipeline with test configuration
  const pipeline = new AttorneyEnrichmentPipeline({
    enableEnrichment: true,
    enableCaching: true,
    maxConcurrentEnrichments: 2,
    fallbackToMock: true,
    cacheTTL: 60000 // 1 minute for testing
  });

  // Test coordinates (Karachi, Pakistan)
  const testCoords = {
    lat: 24.8607,
    lng: 67.0011,
    radius: 50
  };

  console.log(`📍 Testing with coordinates: ${testCoords.lat}, ${testCoords.lng}`);
  console.log(`🔍 Search radius: ${testCoords.radius}km\n`);

  try {
    // Test 1: First request (should hit OSM and enrich)
    console.log('🔄 Test 1: First request (OSM + Enrichment)');
    const startTime1 = Date.now();
    const attorneys1 = await pipeline.processAttorneys(
      testCoords.lat, 
      testCoords.lng, 
      testCoords.radius
    );
    const duration1 = Date.now() - startTime1;

    console.log(`✅ Found ${attorneys1.length} attorneys in ${duration1}ms`);
    console.log(`📊 Enrichment stats:`);
    console.log(`   - Verified: ${attorneys1.filter(a => a.verified).length}`);
    console.log(`   - With websites: ${attorneys1.filter(a => a.website).length}`);
    console.log(`   - With practice areas: ${attorneys1.filter(a => a.practiceAreas?.length).length}`);
    console.log(`   - With reviews: ${attorneys1.filter(a => a.reviews?.length).length}\n`);

    // Test 2: Second request (should hit cache)
    console.log('🔄 Test 2: Second request (Cache)');
    const startTime2 = Date.now();
    const attorneys2 = await pipeline.processAttorneys(
      testCoords.lat, 
      testCoords.lng, 
      testCoords.radius
    );
    const duration2 = Date.now() - startTime2;

    console.log(`✅ Found ${attorneys2.length} attorneys in ${duration2}ms`);
    console.log(`⚡ Cache performance: ${duration1}ms → ${duration2}ms (${Math.round((duration1 - duration2) / duration1 * 100)}% faster)\n`);

    // Test 3: Different location (should hit OSM again)
    console.log('🔄 Test 3: Different location (OSM + Enrichment)');
    const startTime3 = Date.now();
    const attorneys3 = await pipeline.processAttorneys(
      testCoords.lat + 0.1, 
      testCoords.lng + 0.1, 
      testCoords.radius
    );
    const duration3 = Date.now() - startTime3;

    console.log(`✅ Found ${attorneys3.length} attorneys in ${duration3}ms\n`);

    // Display sample enriched attorney
    if (attorneys1.length > 0) {
      console.log('📋 Sample Enriched Attorney:');
      const sample = attorneys1[0];
      console.log(`   Name: ${sample.name}`);
      console.log(`   Specialization: ${sample.specialization.join(', ')}`);
      console.log(`   Practice Areas: ${sample.practiceAreas?.join(', ') || 'N/A'}`);
      console.log(`   Website: ${sample.website || 'N/A'}`);
      console.log(`   Phone: ${sample.phone || 'N/A'}`);
      console.log(`   Verified: ${sample.verified ? '✅' : '❌'}`);
      console.log(`   Reviews: ${sample.reviews?.length || 0}`);
      console.log(`   Social Media: ${Object.keys(sample.socialMedia || {}).length} platforms\n`);
    }

    // Test 4: Pipeline statistics
    console.log('📈 Pipeline Statistics:');
    const stats = pipeline.getStats();
    console.log(`   Cache entries: ${stats.cache.size}/${stats.cache.maxSize}`);
    console.log(`   Enrichment enabled: ${stats.enrichment.enabled}`);
    console.log(`   Max concurrent: ${stats.enrichment.maxConcurrent}`);
    console.log(`   Cache healthy: ${stats.cache.size < stats.cache.maxSize * 0.9 ? '✅' : '⚠️'}\n`);

    // Test 5: Cache operations
    console.log('🗑️ Testing cache operations:');
    const cache = getAttorneyCache();
    const cacheStats = cache.getStats();
    console.log(`   Cache size: ${cacheStats.size}`);
    console.log(`   Cache entries: ${cacheStats.entries.length}`);
    
    // Test cache metadata
    const metadata = cache.getWithMetadata(testCoords.lat, testCoords.lng, testCoords.radius);
    if (metadata.metadata.cached) {
      console.log(`   Cache age: ${metadata.metadata.age}ms`);
      console.log(`   Expires at: ${metadata.metadata.expiresAt?.toISOString()}`);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEnrichmentPipeline()
    .then(() => {
      console.log('\n✨ Test suite completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test suite failed:', error);
      process.exit(1);
    });
}

export { testEnrichmentPipeline };
