# Attorney Data Enrichment System

This system enhances basic attorney listings from OpenStreetMap with detailed information gathered through web scraping and Google Custom Search API.

## 🚀 Features

- **Multi-source Data Enrichment**: Combines OSM data with Google Search and website scraping
- **Intelligent Caching**: Reduces API calls and improves performance
- **Graceful Fallbacks**: Always returns data, even when external services fail
- **Rate Limiting**: Respects API limits and prevents abuse
- **Configurable**: Easy to enable/disable features via environment variables

## 🏗️ Architecture

```
User Request → AttorneysContext → API Route → Enrichment Pipeline
     ↓              ↓                ↓              ↓
Geolocation → fetchAttorneys() → /api/attorneys → Pipeline.processAttorneys()
     ↓              ↓                ↓              ↓
Location Data → API Call → Enrichment Service → Cache → Response
```

## 📁 File Structure

```
lib/scrapers/
├── attorneyEnrichment.ts    # Core enrichment service
├── attorneyCache.ts         # Caching mechanism
└── attorneyPipeline.ts     # Main orchestration pipeline

lib/config/
└── enrichment.ts           # Configuration settings

types/
└── attorney.ts             # Enhanced attorney interface
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install cheerio @types/cheerio --legacy-peer-deps
```

### 2. Configure Google Custom Search API

1. Go to [Google Custom Search Console](https://cse.google.com/)
2. Create a new Custom Search Engine
3. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
4. Set up environment variables:

```bash
# Create .env.local file
GOOGLE_SEARCH_API_KEY=your_api_key_here
GOOGLE_CSE_ID=your_search_engine_id_here
ENABLE_ATTORNEY_ENRICHMENT=true
ENABLE_ATTORNEY_CACHING=true
```

### 3. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_ATTORNEY_ENRICHMENT` | Enable/disable enrichment | `false` |
| `ENABLE_ATTORNEY_CACHING` | Enable/disable caching | `true` |
| `MAX_CONCURRENT_ENRICHMENTS` | Max concurrent requests | `3` |
| `ATTORNEY_CACHE_TTL` | Cache time-to-live (ms) | `86400000` (24h) |
| `GOOGLE_SEARCH_API_KEY` | Google API key | Required |
| `GOOGLE_CSE_ID` | Custom Search Engine ID | Required |

## 🔄 How It Works

### 1. Data Flow

1. **Location Request**: User provides lat/lng coordinates
2. **Cache Check**: System checks for cached data first
3. **OSM Query**: Fetches basic attorney data from OpenStreetMap
4. **Enrichment**: Enhances data using multiple sources:
   - Google Custom Search API
   - Website scraping
   - Social media extraction
5. **Caching**: Stores enriched data for future requests
6. **Response**: Returns sorted, enriched attorney data

### 2. Enrichment Process

```typescript
// Basic OSM data
{
  "name": "Ali Law Associates",
  "addr:city": "Karachi",
  "office": "lawyer"
}

// After enrichment
{
  "name": "Ali Law Associates",
  "specialization": ["Criminal Law", "Family Law"],
  "practiceAreas": ["Criminal Defense", "Traffic Violations"],
  "website": "https://alilawassociates.pk",
  "phone": "+92-21-1234567",
  "email": "info@alilawassociates.pk",
  "reviews": [...],
  "socialMedia": {...},
  "verified": true,
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### 3. Search Strategy

The system uses targeted Google searches:

```
"Ali Law Associates" Karachi lawyer attorney law firm 
site:.pk OR site:linkedin.com OR site:facebook.com OR site:justdial.com
```

## 🛠️ API Usage

### Basic Usage

```typescript
import AttorneyEnrichmentPipeline from './lib/scrapers/attorneyPipeline';

const pipeline = new AttorneyEnrichmentPipeline({
  enableEnrichment: true,
  enableCaching: true,
  maxConcurrentEnrichments: 3
});

const attorneys = await pipeline.processAttorneys(24.8607, 67.0011, 50);
```

### Configuration Options

```typescript
interface EnrichmentPipelineConfig {
  enableEnrichment: boolean;        // Enable/disable enrichment
  enableCaching: boolean;           // Enable/disable caching
  maxConcurrentEnrichments: number; // Max concurrent requests
  fallbackToMock: boolean;          // Use mock data on failure
  cacheTTL: number;                 // Cache time-to-live
}
```

## 📊 Data Sources

### 1. OpenStreetMap (Primary)
- Basic attorney listings
- Location data
- Contact information (when available)

### 2. Google Custom Search (Secondary)
- Practice areas
- Website URLs
- Contact information
- Reviews and ratings
- Social media links

### 3. Website Scraping (Tertiary)
- Detailed practice areas
- Education information
- Experience details
- Bar numbers
- Professional images

## 🎯 Enriched Data Fields

| Field | Source | Description |
|-------|--------|-------------|
| `practiceAreas` | Google Search + Website | Detailed practice areas |
| `website` | Google Search + OSM | Attorney/firm website |
| `phone` | Google Search + OSM | Contact phone number |
| `email` | Google Search + Website | Contact email |
| `reviews` | Google Search | Client reviews |
| `socialMedia` | Google Search | Social media profiles |
| `education` | Website Scraping | Educational background |
| `experience` | Website Scraping | Years of experience |
| `barNumber` | Website Scraping | Bar registration number |
| `verified` | System | Data validation status |

## 🚦 Rate Limiting & Best Practices

### Rate Limits
- **Google Custom Search**: 100 queries/day (free tier)
- **Website Scraping**: 1 second delay between requests
- **Concurrent Requests**: Maximum 3 simultaneous enrichments

### Best Practices
1. **Enable Caching**: Reduces API usage and improves performance
2. **Monitor Quotas**: Track Google API usage
3. **Respect Robots.txt**: Check website scraping permissions
4. **Error Handling**: Always have fallback data
5. **Data Validation**: Verify enriched data quality

## 🔍 Monitoring & Debugging

### Logs
The system provides detailed logging:

```
=== STARTING ENRICHED ATTORNEY SEARCH ===
Search parameters: { lat: 24.8607, lng: 67.0011, radius: 50 }
Found 3 basic attorney records
Starting data enrichment process...
Enrichment completed:
- Verified attorneys: 2/3
- With websites: 2
- With phone numbers: 3
- With practice areas: 3
Results cached successfully
Pipeline completed successfully. Returning 3 attorneys
```

### Cache Statistics
```typescript
const stats = pipeline.getStats();
console.log('Cache stats:', stats.cache);
console.log('Enrichment stats:', stats.enrichment);
```

## 🚨 Error Handling

The system has multiple fallback layers:

1. **Cache Miss**: Fetch from OSM
2. **OSM Failure**: Use mock data
3. **Enrichment Failure**: Return basic OSM data
4. **API Failure**: Return cached data or mock data

## 🔧 Troubleshooting

### Common Issues

1. **No Enriched Data**
   - Check Google API credentials
   - Verify Custom Search Engine is configured
   - Check rate limits

2. **Slow Performance**
   - Enable caching
   - Reduce concurrent requests
   - Check network connectivity

3. **Missing Data**
   - OSM data may be incomplete
   - Websites may not be scrapable
   - Google search may not find results

### Debug Mode
```typescript
const pipeline = new AttorneyEnrichmentPipeline({
  enableEnrichment: true,
  enableCaching: false, // Disable for debugging
  maxConcurrentEnrichments: 1 // Reduce for debugging
});
```

## 📈 Performance Metrics

### Typical Performance
- **Cache Hit**: < 50ms
- **OSM Query**: 1-3 seconds
- **Enrichment**: 5-15 seconds per attorney
- **Total Time**: 10-30 seconds (first request)

### Optimization Tips
1. Use caching for repeated requests
2. Implement background enrichment
3. Pre-populate popular locations
4. Use CDN for static assets

## 🔒 Security Considerations

1. **API Keys**: Store securely, never commit to version control
2. **Rate Limiting**: Respect service limits
3. **Data Privacy**: Handle personal information responsibly
4. **CORS**: Configure properly for production
5. **Validation**: Sanitize all scraped data

## 🚀 Future Enhancements

- [ ] Machine learning for better data extraction
- [ ] Real-time data updates
- [ ] Integration with more data sources
- [ ] Advanced caching strategies
- [ ] Data quality scoring
- [ ] Automated testing
- [ ] Performance monitoring dashboard
