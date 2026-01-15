#!/usr/bin/env node

/**
 * Civil Rights Attorney Search System
 * Specialized search for civil rights, immigration, and social justice lawyers
 */

const axios = require('axios');

// Civil rights specific search terms
const CIVIL_RIGHTS_TERMS = [
  'civil rights lawyer',
  'immigration attorney', 
  'constitutional lawyer',
  'police misconduct attorney',
  'discrimination lawyer',
  'asylum lawyer',
  'refugee attorney',
  'deportation defense',
  'first amendment lawyer',
  'voting rights attorney',
  'employment discrimination',
  'housing discrimination',
  'education law attorney',
  'disability rights lawyer',
  'LGBTQ rights attorney',
  'women rights lawyer',
  'racial justice attorney',
  'criminal justice reform',
  'prisoners rights',
  'environmental justice'
];

// Pakistani civil rights organizations and keywords
const PAKISTANI_CIVIL_RIGHTS_KEYWORDS = [
  'human rights commission pakistan',
  'asylum pakistan',
  'refugee rights pakistan',
  'women rights pakistan',
  'minority rights pakistan',
  'blasphemy law defense',
  'forced conversion',
  'honor killing defense',
  'domestic violence',
  'child marriage',
  'forced marriage',
  'acid attack',
  'religious freedom',
  'freedom of speech',
  'press freedom',
  'political asylum',
  'refugee status',
  'deportation defense pakistan'
];

async function searchCivilRightsAttorneys(location = 'Karachi') {
  console.log('🔍 Searching for Civil Rights Attorneys in Pakistan\n');
  
  const results = [];
  
  // Search strategy 1: Direct civil rights terms
  console.log('📋 Strategy 1: Direct Civil Rights Search');
  for (const term of CIVIL_RIGHTS_TERMS.slice(0, 5)) { // Limit to avoid quota
    try {
      const searchQuery = `${term} ${location} pakistan`;
      console.log(`Searching: ${searchQuery}`);
      
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: 'AIzaSyCTlDmvu5yDc_UrMdaeUaxZ1t1ZYrIyB34',
          cx: '067300f0d12244cd4',
          q: searchQuery
        }
      });
      
      if (response.data.items) {
        response.data.items.forEach(item => {
          results.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            searchTerm: term,
            strategy: 'direct'
          });
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error searching "${term}":`, error.response?.status);
      if (error.response?.status === 429) {
        console.log('⚠️ Quota exceeded, stopping search');
        break;
      }
    }
  }
  
  // Search strategy 2: Pakistani civil rights organizations
  console.log('\n🏛️ Strategy 2: Pakistani Civil Rights Organizations');
  for (const keyword of PAKISTAN_CIVIL_RIGHTS_KEYWORDS.slice(0, 3)) {
    try {
      const searchQuery = `${keyword} lawyer attorney legal help`;
      console.log(`Searching: ${searchQuery}`);
      
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: 'AIzaSyCTlDmvu5yDc_UrMdaeUaxZ1t1ZYrIyB34',
          cx: '067300f0d12244cd4',
          q: searchQuery
        }
      });
      
      if (response.data.items) {
        response.data.items.forEach(item => {
          results.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            searchTerm: keyword,
            strategy: 'organization'
          });
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error searching "${keyword}":`, error.response?.status);
      if (error.response?.status === 429) {
        console.log('⚠️ Quota exceeded, stopping search');
        break;
      }
    }
  }
  
  return results;
}

async function testCivilRightsSearch() {
  try {
    const results = await searchCivilRightsAttorneys('Karachi');
    
    console.log('\n📊 Search Results:');
    console.log(`Total results: ${results.length}`);
    
    // Group by strategy
    const directResults = results.filter(r => r.strategy === 'direct');
    const orgResults = results.filter(r => r.strategy === 'organization');
    
    console.log(`Direct civil rights searches: ${directResults.length}`);
    console.log(`Organization searches: ${orgResults.length}`);
    
    // Show sample results
    console.log('\n🎯 Sample Results:');
    results.slice(0, 5).forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Search: ${result.searchTerm}`);
      console.log(`   Strategy: ${result.strategy}`);
    });
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
}

// Run test
testCivilRightsSearch()
  .then(() => {
    console.log('\n🎉 Civil rights attorney search completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Search failed:', error);
    process.exit(1);
  });
