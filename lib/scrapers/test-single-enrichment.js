#!/usr/bin/env node

/**
 * Test Google Enrichment with a single attorney
 */

import AttorneyEnrichmentService from './attorneyEnrichment.js';

async function testSingleAttorneyEnrichment() {
  console.log('🔍 Testing Google Enrichment with Single Attorney\n');

  // Initialize enrichment service
  const enrichmentService = new AttorneyEnrichmentService({
    enableGoogleSearch: true,
    enableWebsiteScraping: true,
    enableSocialMedia: true,
    maxConcurrentRequests: 1,
    requestDelay: 1000
  });

  // Test with a real Pakistani law firm
  const testAttorney = {
    id: 'test-1',
    name: 'Al Haqq Law Firm - Advocates, Barristers, Lawyers, Legal & Tax Consultants Karachi, Pakistan',
    specialization: ['Tax Law'],
    location: 'Karachi',
    detailedLocation: 'Five Star Chowrangi, Suite A-2, 1st Floor, JF Plaza, Block D North Nazimabad Town, Karachi',
    rating: 3.0,
    cases: 51,
    image: '/images/attorneys/attorney3.jpg',
    languages: ['English'],
    featured: false,
    lat: 24.9420586,
    lng: 67.0462594
  };

  console.log('📋 BEFORE Google Enrichment:');
  console.log(JSON.stringify(testAttorney, null, 2));

  try {
    console.log('\n🔍 Starting Google enrichment...');
    console.log('This will search Google for: "Al Haqq Law Firm" Karachi lawyer...');
    
    const enrichedAttorney = await enrichmentService.enrichAttorneyData(testAttorney);
    
    console.log('\n✨ AFTER Google Enrichment:');
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
    console.log('\n💡 This might be due to:');
    console.log('1. Google API quota exceeded');
    console.log('2. Network connectivity issues');
    console.log('3. Invalid API credentials');
  }
}

// Run test
testSingleAttorneyEnrichment()
  .then(() => {
    console.log('\n🎉 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
