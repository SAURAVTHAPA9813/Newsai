# Neural Analytics - Real API Implementation

## Summary

Replaced mock Neural Analytics API with fully functional backend integration for tracking reading sessions, cognitive load, and content patterns.

---

## What Was Implemented

### ✅ 1. Frontend Service Layer

**Created**: [newsai/src/services/neuralAnalyticsService.js](newsai/src/services/neuralAnalyticsService.js)

Real API service with endpoints:
- `getOverview(filters)` - KPIs, aggregates, metrics, insights
- `getTrends(filters)` - Topic trend timeline data
- `getIntegrity(filters)` - Content integrity breakdown
- `trackSession(sessionData)` - Track reading session
- `getSessions(filters)` - Get user's reading sessions
- `updateSession(sessionId, data)` - Update session with engagement events

### ✅ 2. Backend Data Model

**Created**: [server/models/ReadingSession.js](server/models/ReadingSession.js)

Comprehensive session tracking with:
- **Timing**: startedAt, endedAt, durationMinutes
- **Device**: mobile, tablet, desktop
- **Content**: topic (id, name, category), source (id, name, tier)
- **Reading Mode**: skim, standard, deep_dive, intentional
- **Wellness**: moodTag, selfReportedAnxiety (0-100)
- **Engagement**: Array of events (scroll, highlight, share, verify, etc.)
- **Computed Metrics**: verifyUsed, focusScore, completionRate

**Indexes**:
- User + startedAt (time-series queries)
- User + topic.id (topic filtering)
- User + readingMode (mode analysis)

### ✅ 3. Backend API Routes

**Created**: [server/routes/analytics.js](server/routes/analytics.js)

**Endpoints**:

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics/overview` | KPIs + aggregated metrics |
| GET | `/api/analytics/trends` | Topic trends over time |
| GET | `/api/analytics/integrity` | Verified vs opinion mix |
| POST | `/api/analytics/sessions` | Track new reading session |
| GET | `/api/analytics/sessions` | Get user's sessions |
| PUT | `/api/analytics/sessions/:id` | Update session |

**Query Filters**: timeRange (7d, 30d, 90d, all), device, topicId

**Registered**: [server/server.js:72](server/server.js#L72)

### ✅ 4. Aggregation & Scoring Logic

**KPIs Computed**:
- **Minutes Read**: Sum of all session durations
- **Focus Score**: Average focus from deep_dive/intentional sessions
- **Truth Score**: % of sessions using verify feature
- **Cognitive Load**: Average anxiety across sessions

**Daily Aggregates**:
- Minutes read per day
- Sessions count per day
- Average anxiety per day

**Topic Metrics**:
- Minutes per topic
- Sessions per topic
- Average anxiety per topic
- Top 10 topics by engagement

**Source Metrics**:
- Diversity score (unique source tiers)
- Tier distribution (premium, standard, basic)
- Reliability score (based on verification)

**Insights** (Auto-generated):
- Concentration alerts (focus score thresholds)
- Diversity recommendations (topic variety)
- Anxiety warnings (high anxiety detection)
- Verification prompts (low truth score)

### ✅ 5. Frontend Integration

**Updated**: [newsai/src/pages/NeuralAnalyticsPage.jsx](newsai/src/pages/NeuralAnalyticsPage.jsx)

Changes:
- Replaced mock imports with real `neuralAnalyticsService`
- Added error handling with `error` state
- Added `lastUpdated` timestamp tracking
- Changed filter format from `LAST_7_DAYS` to `7d` (backend format)
- Proper response unwrapping (`response.data`)

---

## Next Steps (TODO)

### 1. Reading Session Instrumentation

**Where**: Article reader component (need to locate)

**What to Track**:
```javascript
// On article open
const sessionStart = {
  startedAt: new Date(),
  articleId: article.id,
  articleTitle: article.title,
  articleUrl: article.url,
  device: detectDevice(), // mobile/tablet/desktop from user-agent
  topic: {
    id: article.topic.id,
    name: article.topic.name,
    category: article.category
  },
  source: {
    id: article.source.id,
    name: article.source.name,
    tier: article.source.tier
  },
  wordCount: article.wordCount,
  readingMode: 'standard', // or from user preference
  engagementEvents: []
};

// On article close
const sessionEnd = {
  ...sessionStart,
  endedAt: new Date(),
  durationMinutes: calculateDuration(sessionStart.startedAt, new Date()),
  moodTag: await promptForMood(), // Optional: quick mood selector
  selfReportedAnxiety: await promptForAnxiety(), // Optional: 0-100 slider
  completionRate: calculateScrollDepth()
};

await neuralAnalyticsService.trackSession(sessionEnd);
```

**Engagement Events** to capture:
- Scroll progress
- Verify button clicked
- Decompress mode used
- Explain feature used
- Perspectives opened
- Article saved/shared

### 2. UX Polish

**Add to NeuralAnalyticsPage**:

```javascript
// Display last updated time
{lastUpdated && (
  <div className="text-xs text-text-secondary">
    Last updated: {lastUpdated.toLocaleTimeString()}
  </div>
)}

// Display errors
{error && (
  <div className="p-4 rounded-lg bg-red-50 border border-red-300 text-red-700">
    {error}
  </div>
)}

// Empty state when no data
{analyticsData?.kpis?.minutesRead === 0 && (
  <div className="text-center py-12">
    <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-text-dark mb-2">No Data Yet</h3>
    <p className="text-text-secondary">
      Start reading articles to see your analytics
    </p>
  </div>
)}

// Refresh button
<button onClick={loadAnalyticsData} className="...">
  <FiRefreshCw className="w-4 h-4" />
  Refresh
</button>
```

**Filter Persistence**:
```javascript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('neuralAnalyticsFilters', JSON.stringify(filters));
}, [filters]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('neuralAnalyticsFilters');
  if (saved) {
    setFilters(JSON.parse(saved));
  }
}, []);
```

**Debounce Filter Changes**:
```javascript
import { useDebounce } from '../hooks/useDebounce';

const debouncedFilters = useDebounce(filters, 300);

useEffect(() => {
  loadAnalyticsData();
}, [debouncedFilters]);
```

### 3. Testing

**Seed Test Data**:
```javascript
// Create sample sessions for testing
const sampleSessions = [
  {
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    durationMinutes: 30,
    device: 'desktop',
    topic: { id: 'tech', name: 'Technology', category: 'tech' },
    source: { id: 'nyt', name: 'NYT', tier: 'premium' },
    readingMode: 'deep_dive',
    moodTag: 'focused',
    selfReportedAnxiety: 20,
    engagementEvents: [
      { type: 'verify', timestamp: new Date(), metadata: {} }
    ]
  },
  // ... more sessions
];

// POST to /api/analytics/sessions for each
```

**Unit Tests** (analytics.js):
```javascript
describe('Analytics Aggregation', () => {
  it('should calculate KPIs correctly', () => {
    // Test KPI calculation logic
  });

  it('should generate insights based on thresholds', () => {
    // Test insight generation rules
  });

  it('should filter by time range', () => {
    // Test date range filtering
  });
});
```

**Integration Tests**:
```javascript
describe('GET /api/analytics/overview', () => {
  it('should return overview data for authenticated user', async () => {
    // Test with auth token
  });

  it('should filter by device', async () => {
    // Test device filter
  });

  it('should return 401 without auth', async () => {
    // Test auth protection
  });
});
```

---

## Architecture Flow

```
User reads article
  ↓
Article reader tracks session
  ↓
POST /api/analytics/sessions
  ↓
ReadingSession saved to MongoDB
  ↓
UserStats.readingStats updated
  ↓
User opens Neural Analytics page
  ↓
GET /api/analytics/overview (with filters)
  ↓
Backend aggregates sessions
  ↓
Computes KPIs, metrics, insights
  ↓
Frontend displays charts/cards
```

---

## Files Created/Modified

### Created:
- ✅ `newsai/src/services/neuralAnalyticsService.js` - Frontend API service
- ✅ `server/models/ReadingSession.js` - MongoDB schema
- ✅ `server/routes/analytics.js` - Backend API routes

### Modified:
- ✅ `server/server.js` - Registered analytics routes
- ✅ `newsai/src/pages/NeuralAnalyticsPage.jsx` - Updated to use real API

---

## Testing Instructions

1. **Restart Backend Server**:
   ```bash
   cd server
   npm start
   ```

2. **Create Test Session**:
   ```bash
   curl -X POST http://localhost:5000/api/analytics/sessions \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "startedAt": "2025-12-13T10:00:00Z",
       "endedAt": "2025-12-13T10:30:00Z",
       "durationMinutes": 30,
       "device": "desktop",
       "topic": {"id": "tech", "name": "Technology", "category": "tech"},
       "source": {"id": "nyt", "name": "NYT", "tier": "premium"},
       "readingMode": "deep_dive",
       "moodTag": "focused",
       "selfReportedAnxiety": 20,
       "engagementEvents": []
     }'
   ```

3. **View Analytics**:
   - Navigate to `/neural-analytics` page
   - Should see KPIs, charts with real data
   - Try changing filters (time range, device)

4. **Check Backend Logs**:
   - Should see session tracking logs
   - No errors in aggregation

---

## Current Status

✅ **Ready for Testing** - Core functionality complete
🔄 **In Progress** - Session instrumentation
⏳ **Pending** - UX polish and QA

All backend infrastructure is in place and ready to receive reading session data!
