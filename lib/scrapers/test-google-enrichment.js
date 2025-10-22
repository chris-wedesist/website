#!/usr/bin/env node

/**
 * Test script to demonstrate Google enrichment
 * Run with: node test-google-enrichment.js
 */

import AttorneyEnrichmentService from './attorneyEnrichment.js';

async function testGoogleEnrichment() {
  console.log('🧪 Testing Google Attorney Enrichment\n');

  // Initialize enrichment service
  const enrichmentService = new AttorneyEnrichmentService({
    enableGoogleSearch: true,
    enableWebsiteScraping: true,
    enableSocialMedia: true,
    maxConcurrentRequests: 2,
    requestDelay: 1000
  });

  // Test with a real Pakistani law firm
  const testAttorney = {
    id: 'test-1',
    name: 'Ali Law Associates',
    specialization: ['General Practice'],
    location: 'Karachi',
    detailedLocation: 'Karachi, Pakistan',
    rating: 4.0,
    cases: 100,
    image: '/images/attorneys/attorney1.jpg',
    languages: ['English'],
    featured: false,
    lat: 24.93,
    lng: 67.09
  };

  console.log('📋 Original Attorney Data:');
  console.log(JSON.stringify(testAttorney, null, 2));

  try {
    console.log('\n🔍 Starting Google enrichment...');
    const enrichedAttorney = await enrichmentService.enrichAttorneyData(testAttorney);
    
    console.log('\n✨ Enriched Attorney Data:');
    console.log(JSON.stringify(enrichedAttorney, null, 2));
    
    console.log('\n📊 Enrichment Results:');
    console.log(`- Practice Areas: ${enrichedAttorney.practiceAreas?.length || 0}`);
    console.log(`- Website: ${enrichedAttorney.website ? '✅' : '❌'}`);
    console.log(`- Phone: ${enrichedAttorney.phone ? '✅' : '❌'}`);
    console.log(`- Email: ${enrichedAttorney.email ? '✅' : '❌'}`);
    console.log(`- Reviews: ${enrichedAttorney.reviews?.length || 0}`);
    console.log(`- Social Media: ${Object.keys(enrichedAttorney.socialMedia || {}).length}`);
    console.log(`- Verified: ${enrichedAttorney.verified ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Enrichment failed:', error.message);
    console.log('\n💡 Make sure to set your Google API credentials:');
    console.log('GOOGLE_SEARCH_API_KEY=your_api_key');
    console.log('GOOGLE_CSE_ID=067300f0d12244cd4');
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGoogleEnrichment()
    .then(() => {
      console.log('\n🎉 Test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testGoogleEnrichment };
