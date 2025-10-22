#!/usr/bin/env node

/**
 * Debug Google Enrichment System
 */

console.log('🔍 Debugging Google Enrichment System\n');

// Test 1: Check if we can import the enrichment service
console.log('📦 Test 1: Importing enrichment service...');
try {
  const AttorneyEnrichmentService = require('./attorneyEnrichment.ts');
  console.log('✅ Successfully imported AttorneyEnrichmentService');
} catch (error) {
  console.log('❌ Failed to import AttorneyEnrichmentService:', error.message);
}

// Test 2: Check environment variables
console.log('\n🔧 Test 2: Environment Variables');
console.log('GOOGLE_SEARCH_API_KEY:', process.env.GOOGLE_SEARCH_API_KEY ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CSE_ID:', process.env.GOOGLE_CSE_ID || '❌ Missing');
console.log('ENABLE_ATTORNEY_ENRICHMENT:', process.env.ENABLE_ATTORNEY_ENRICHMENT || '❌ Missing');

// Test 3: Check if we can create an instance
console.log('\n🏗️ Test 3: Creating enrichment service instance...');
try {
  const enrichmentService = new AttorneyEnrichmentService({
    enableGoogleSearch: true,
    enableWebsiteScraping: true,
    enableSocialMedia: true,
    maxConcurrentRequests: 1,
    requestDelay: 1000
  });
  console.log('✅ Successfully created enrichment service instance');
} catch (error) {
  console.log('❌ Failed to create enrichment service instance:', error.message);
}

// Test 4: Test Google API call directly
console.log('\n🌐 Test 4: Testing Google API call...');
if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_CSE_ID) {
  const axios = require('axios');
  const testQuery = 'Ali Law Associates Karachi lawyer';
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${encodeURIComponent(testQuery)}`;
  
  console.log('API URL:', apiUrl);
  
  axios.get(apiUrl)
    .then(response => {
      console.log('✅ Google API call successful');
      console.log('Results:', response.data.items?.length || 0);
    })
    .catch(error => {
      console.log('❌ Google API call failed:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    });
} else {
  console.log('❌ Cannot test Google API - missing credentials');
}

console.log('\n🎯 Debug completed!');
