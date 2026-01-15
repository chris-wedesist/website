#!/usr/bin/env node

/**
 * Debug Google Enrichment Issues
 */

const axios = require('axios');

async function testGoogleEnrichment() {
  console.log('🔍 Debugging Google Enrichment Issues\n');

  // Test 1: Direct Google API call
  console.log('📡 Test 1: Direct Google API Call');
  const apiKey = 'AIzaSyCTlDmvu5yDc_UrMdaeUaxZ1t1ZYrIyB34';
  const cseId = '067300f0d12244cd4';
  const query = 'Al Haqq Law Firm Karachi lawyer';
  
  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: apiKey,
        cx: cseId,
        q: query
      }
    });
    
    console.log('✅ Google API Success');
    console.log('Results:', response.data.items?.length || 0);
    if (response.data.items && response.data.items.length > 0) {
      console.log('First result:', response.data.items[0].title);
      console.log('URL:', response.data.items[0].link);
    }
  } catch (error) {
    console.log('❌ Google API Error:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }

  // Test 2: Check API quota
  console.log('\n📊 Test 2: API Quota Check');
  try {
    const quotaResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: apiKey,
        cx: cseId,
        q: 'test'
      }
    });
    console.log('✅ API Quota Available');
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('❌ API Quota Exceeded');
    } else {
      console.log('❌ Other API Error:', error.response?.status);
    }
  }

  // Test 3: Test with different query
  console.log('\n🔍 Test 3: Different Query');
  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: apiKey,
        cx: cseId,
        q: 'lawyer Karachi Pakistan'
      }
    });
    
    console.log('✅ Different Query Success');
    console.log('Results:', response.data.items?.length || 0);
  } catch (error) {
    console.log('❌ Different Query Error:', error.response?.status);
  }
}

testGoogleEnrichment()
  .then(() => {
    console.log('\n🎯 Debug completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Debug failed:', error);
    process.exit(1);
  });
