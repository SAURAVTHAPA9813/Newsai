# NewsAI - AI-Powered News Intelligence Platform

## Project Overview

NewsAI is a full-stack news aggregation and analysis platform that uses AI to provide personalized, intelligent news experiences. The platform combines real-time news from multiple providers with Google Gemini AI for analysis, offering features like fact-checking, market impact analysis, and personalized news feeds.

### Project Type
Full-Stack Web Application (MERN Stack + AI Integration)

### Quick Start

```bash
# Install dependencies
npm install
cd server && npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your API keys

# Start backend server (runs on port 5000)
cd server && npm start

# Start frontend (in separate terminal)
npm run dev
```

## Architecture

### Tech Stack

**Frontend:**
- React 18.3 + Vite
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- Recharts for data visualization

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multi-provider news aggregation
- Google Gemini AI integration
- Finnhub API for market data (optional)

**AI Features:**
- Google Gemini 1.5 Flash for article analysis
- Custom AI modules: Explain, Context Timeline, Market Impact, Perspectives
- Real-time fact-checking with source verification
- Sentiment analysis and bias detection
- Trending topics extraction with momentum scoring

### Project Structure

```
Newsai/
├── src/                                    # Frontend React application
│   ├── components/
│   │   ├── dashboard/                      # Main dashboard components
│   │   │   ├── ControlCenterPage.jsx       # Main dashboard orchestrator
│   │   │   ├── PersonalizationStrip.jsx    # Interest/category filtering UI
│   │   │   ├── RightPanelWellness.jsx      # User stats & trending topics
│   │   │   ├── HolographicArticleCard.jsx  # Article display card
│   │   │   ├── AICommandToolbar.jsx        # AI feature selection toolbar
│   │   │   ├── CommandPalette.jsx          # Quick actions command palette
│   │   │   └── TimeScrubber.jsx            # Reading mode selector (5m/15m/30m)
│   │   ├── aimodules/                      # AI analysis module UIs
│   │   │   ├── ExplainModule.jsx           # ELI5 explanations
│   │   │   ├── ContextTimelineModule.jsx   # Historical context & timeline
│   │   │   ├── MarketImpactModule.jsx      # Financial/economic impact
│   │   │   └── PerspectivesModule.jsx      # Multi-perspective analysis
│   │   ├── sidebar/                        # Navigation sidebar
│   │   │   ├── GlassSidebar.jsx            # Main sidebar navigation
│   │   │   ├── SidebarNavItem.jsx          # Individual nav items (with locked state support)
│   │   │   └── UserProfileDock.jsx         # User profile in sidebar
│   │   └── common/                         # Reusable UI components
│   ├── services/                           # API client services
│   │   ├── apiClient.js                    # Base Axios client with auth interceptors
│   │   ├── dashboardAPI.js                 # Dashboard data fetching
│   │   ├── newsAPI.js                      # News-specific endpoints
│   │   ├── intelligenceAPI.js              # Intelligence briefing endpoints
│   │   ├── aiAPI.js                        # AI analysis endpoints
│   │   └── authAPI.js                      # Authentication services
│   ├── context/                            # React context providers
│   │   └── AuthContext.jsx                 # User authentication state
│   └── pages/                              # Top-level page components
│       ├── ControlCenterPage.jsx           # Main dashboard page
│       └── LoginPage.jsx                   # Authentication page
│
├── server/                                 # Backend Node.js application
│   ├── models/                             # MongoDB Mongoose schemas
│   │   ├── User.js                         # User authentication & profile
│   │   └── UserStats.js                    # User activity & gamification
│   ├── routes/                             # Express API route handlers
│   │   ├── dashboard.js                    # Dashboard overview endpoint
│   │   ├── news.js                         # News fetching endpoints
│   │   ├── ai.js                           # AI analysis endpoints
│   │   ├── auth.js                         # Authentication endpoints
│   │   └── userStats.js                    # User statistics endpoints
│   ├── services/                           # Business logic layer
│   │   ├── newsService.js                  # Multi-provider news aggregation
│   │   ├── geminiService.js                # Google Gemini AI integration
│   │   ├── dashboardService.js             # Dashboard data orchestration
│   │   ├── trendAnalysisService.js         # Trending topics extraction
│   │   ├── articleAnalysisService.js       # Sentiment & volatility analysis
│   │   ├── intelligenceBriefingService.js  # AI briefing generation
│   │   └── marketDataService.js            # Finnhub market data (optional)
│   ├── middleware/                         # Express middleware
│   │   ├── auth.js                         # JWT authentication middleware
│   │   └── activityTracker.js              # User activity tracking
│   └── server.js                           # Express app entry point
│
├── public/                                 # Static assets
├── .env.example                            # Environment variable template
└── CLAUDE.md                               # This file
```

## Key Features & Implementation

### 1. Control Center Dashboard
**Location:** `src/pages/ControlCenterPage.jsx`

The main user interface for news consumption with AI-powered features.

**Key State Management:**
```javascript
- articles           // Current filtered articles based on reading mode
- allArticles        // Full article dataset before filtering
- activeInterest     // Currently selected category (null = all news)
- readingMode        // Time-based article limit: '5m'|'15m'|'30m'
- volatility         // Global news volatility index (0-100)
- trendingTopics     // Extracted trending entities with momentum
- marketData         // Real-time stock/crypto prices
- userStats          // User reading activity and XP
- globalVectors      // Trending news vectors with categories
```

**Reading Mode Behavior:**
- **5m mode:** Shows 6 articles, 2-sentence summaries
- **15m mode:** Shows 12 articles, 4-sentence summaries
- **30m mode:** Shows 20 articles, 6-sentence summaries
- Articles filtered **client-side** when mode changes (no API reload)
- allArticles stores full dataset for efficient filtering

**Interest Filtering Flow:**
1. User clicks interest chip (Finance, Tech, Healthcare, Markets, Global)
2. `activeInterest` state updated in ControlCenterPage
3. New API call to `/dashboard/overview?category={category}`
4. Backend maps category to NewsAPI format
5. Filtered articles returned and displayed
6. Active interest highlighted in PersonalizationStrip

### 2. Multi-Provider News System
**Location:** `server/services/newsService.js`

Resilient news aggregation with automatic failover across 5 providers.

**Provider Chain (priority order):**
```javascript
1. NewsAPI.org     → 100 req/day  | Quality: 100 | Primary provider
2. The Guardian    → 500 req/day  | Quality: 95  | High-quality fallback
3. GNews           → 100 req/day  | Quality: 75  | Secondary fallback
4. NewsData.io     → 200 req/day  | Quality: 70  | Tertiary fallback
5. Currents API    → 600 req/day  | Quality: 80  | Last resort
```

**Category Mapping:**
```javascript
// Frontend → Backend NewsAPI mapping
'finance'    → 'business'
'tech'       → 'technology'
'healthcare' → 'health'
'markets'    → 'business'
'global'     → 'general'
```

**Caching Strategy:**
- **Headlines:** 5-minute cache to reduce API usage
- **Cache Key Format:** `headlines:{page}:{limit}` or `{category}:{page}:{limit}`
- **Cleanup:** Automatic cache cleanup every 15 minutes
- **Cache Miss:** Triggers multi-provider fallback chain

**Key Functions:**
- `getHeadlines(page, limit)` - General news headlines
- `getNewsByCategory(category, page)` - Category-specific news
- `searchNews(query, page, limit)` - Search functionality
- `getArticleDetails(articleId)` - Single article retrieval

### 3. AI Analysis Modules
**Locations:**
- Frontend: `src/components/aimodules/`
- Backend: `server/services/geminiService.js`

**Available Modules:**

1. **Explain Module** (`/ai/explain`)
   - ELI5 explanations of complex topics
   - Adjustable reading level
   - Key terms with definitions
   - Related concepts

2. **Context Timeline Module** (`/ai/context-timeline`)
   - Historical background
   - Chronological timeline of events
   - Key milestones
   - How we got here narrative

3. **Market Impact Module** (`/ai/market-impact`)
   - Financial/economic impact analysis
   - Affected sectors and companies
   - Short-term and long-term implications
   - Market sentiment indicators

4. **Perspectives Module** (`/ai/perspectives`)
   - Multiple viewpoint analysis
   - Supporters' arguments
   - Critics' concerns
   - Analysts' perspectives
   - Balanced overview

**AI Request Flow:**
```
User clicks AI button
  → AICommandToolbar dispatches request
  → aiAPI.analyze(articleId, moduleType, preferences)
  → Backend geminiService.js receives request
  → Constructs module-specific prompt
  → Calls Gemini 1.5 Flash API
  → Parses structured JSON response
  → Returns formatted analysis with sources
  → Frontend displays in module component
```

**Module Configuration:** See `server/services/geminiService.js:23-83` for data structures

### 4. Trending Topics & Global Vectors
**Location:** `server/services/trendAnalysisService.js`

Extracts trending topics from articles using entity recognition and keyword analysis.

**Algorithm:**
1. Fetch recent headlines (50 articles)
2. Extract tracked entities (OpenAI, Google, Tesla, etc.)
3. Score entities based on mention frequency + recency weight
4. Extract keyword phrases (bigrams/trigrams)
5. Combine and deduplicate trends
6. Calculate momentum percentage (change indicator)
7. Categorize trends (tech, economy, crypto, health, etc.)

**Output Format:**
```javascript
{
  name: "OpenAI",           // Entity or keyword phrase
  change: 125,              // Momentum percentage (upward trend)
  category: "tech",         // Category classification
  mentions: 8               // Number of mentions in recent articles
}
```

**Integration:** Called by `dashboardService.js` in `getGlobalVectors()` function

### 5. User Authentication & Gamification
**Models:** `server/models/User.js`, `server/models/UserStats.js`

**Authentication:**
- JWT-based with httpOnly cookies (TODO: full implementation)
- MongoDB User model with bcrypt password hashing
- Protected routes use `auth.js` middleware
- Session persistence in AuthContext

**Gamification System:**
```javascript
// XP Awards
- Read article:        +10 XP
- Complete AI module:  +25 XP
- Save article:        +5 XP
- Daily streak bonus:  +50 XP

// Level Progression
- XP per level: 100 XP
- Current level = Math.floor(totalXP / 100)

// Stats Tracked
- articlesRead
- aiModulesUsed
- savedArticles
- totalTimeSpent
- currentStreak
- longestStreak
```

**Activity Tracking:** `server/middleware/activityTracker.js` logs all interactions

### 6. Sidebar Navigation
**Location:** `src/components/sidebar/GlassSidebar.jsx`

**Navigation Items:**
```javascript
1. Control Center     → /dashboard           (Main dashboard)
2. Trending          → /trending             (Trending news)
3. Verify Hub        → /verify-hub           (Fact-checking)
4. IQ Lab            → /iq-lab               (Learning center)
5. Neural Analytics  → /neural-analytics     (Data viz)
6. Topic Matrix      → /topic-matrix         (LOCKED - Coming Soon)
```

**Locked Items:**
- Set `locked: true` in nav item config
- Renders as non-clickable div (not Link)
- Shows lock icon next to name
- "Coming Soon" description
- Grayed out with reduced opacity
- See `SidebarNavItem.jsx:67-81` for implementation

## Environment Variables

### Backend Required Variables

```bash
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/newsai

# JWT Authentication (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google Gemini AI (REQUIRED for AI features)
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio

# News Provider (At least ONE required)
NEWS_API_KEY=your-newsapi-org-api-key              # Recommended primary
GUARDIAN_API_KEY=your-guardian-api-key            # Optional backup
GNEWS_API_KEY=your-gnews-api-key                  # Optional backup
NEWSDATA_API_KEY=your-newsdata-api-key            # Optional backup
CURRENTS_API_KEY=your-currents-api-key            # Optional backup
```

### Backend Optional Variables

```bash
# Market Data (Optional - uses fallback if not set)
FINNHUB_API_KEY=your-finnhub-api-key              # For real-time stock prices

# Server Configuration
NODE_ENV=development                               # development | production
PORT=5000                                          # API server port
```

### Frontend Variables

```bash
# .env.local
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development
```

## Coding Conventions

### React Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ComponentName from './ComponentName';
import { apiFunction } from '../services/api';

// 2. Component Definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. State Hooks
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 4. Effect Hooks
  useEffect(() => {
    loadData();
  }, []);

  // 5. Event Handlers (prefix with 'handle')
  const handleClick = () => {
    // handler logic
  };

  // 6. Helper Functions
  const processData = (input) => {
    // processing logic
  };

  // 7. Render Logic
  if (loading) return <LoadingSpinner />;
  if (!data) return <EmptyState />;

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

// 8. Export
export default MyComponent;
```

### Backend Service Pattern

```javascript
// Service exports object with methods
module.exports = {
  async functionName(params) {
    try {
      // Business logic
      console.log('🔍 Descriptive log message');
      const result = await operation();
      console.log('✅ Success message');
      return result;
    } catch (error) {
      console.error('❌ Error message:', error);
      throw new Error('Descriptive error for client');
    }
  }
};
```

### API Response Format

**Success Response:**
```javascript
{
  success: true,
  timestamp: "2025-01-15T10:30:00Z",
  data: { /* response data */ }
}
```

**Error Response:**
```javascript
{
  success: false,
  error: "Human-readable error message",
  timestamp: "2025-01-15T10:30:00Z"
}
```

### State Management Guidelines

1. **Local State:** Use `useState` for component-specific data
2. **Shared State:** Use Context API (AuthContext) for cross-component data
3. **Server State:** Fetch in parent, pass as props (or use React Query future)
4. **Derived State:** Calculate from existing state, don't store separately

### File Naming

- **Components:** PascalCase (`ControlCenterPage.jsx`)
- **Services:** camelCase (`dashboardService.js`)
- **Utilities:** camelCase (`formatDate.js`)
- **Constants:** UPPER_SNAKE_CASE in named files

## Git Workflow

### Commit Convention (Conventional Commits)

```bash
# Format
<type>(<scope>): <description>

# Types
feat:      New feature
fix:       Bug fix
refactor:  Code restructuring without behavior change
docs:      Documentation only
style:     Formatting, missing semicolons (no code change)
test:      Adding or updating tests
chore:     Maintenance tasks

# Examples
feat(ai): add market impact analysis module
fix(dashboard): resolve category filtering timeout issue
refactor(news): optimize multi-provider fallback logic
docs(readme): update setup instructions
```

### Branch Strategy

```bash
main              # Production-ready code (default branch)
feature/*         # New features: feature/ai-streaming
fix/*             # Bug fixes: fix/category-filter-timeout
refactor/*        # Code refactoring: refactor/dashboard-state
```

## Common Development Tasks

### Adding a New AI Module

**1. Backend Configuration** (`server/services/geminiService.js`):
```javascript
// Add to MODULE_CONFIGS
MARKET_SENTIMENT: {
  systemPrompt: "You are a financial sentiment analyst...",
  temperature: 0.3,
  schema: {
    sentiment: "bullish | bearish | neutral",
    confidence: "number 0-100",
    keyFactors: ["string"],
    implications: "string"
  }
}
```

**2. Backend Route** (if custom logic needed in `server/routes/ai.js`):
```javascript
router.post('/market-sentiment', auth, async (req, res) => {
  // Custom handling if needed
});
```

**3. Frontend Service** (`src/services/aiAPI.js`):
```javascript
export const analyzeMarketSentiment = (articleId) => {
  return apiClient.post(`/ai/market-sentiment`, { articleId });
};
```

**4. Frontend Component** (`src/components/aimodules/MarketSentimentModule.jsx`):
```javascript
// Create component with loading/error/success states
// Handle module-specific data structure
// Add to AICommandToolbar button list
```

### Adding a New News Provider

**1. Get API Key** from provider's website

**2. Add to `.env.example`** and your local `.env`:
```bash
NEW_PROVIDER_API_KEY=your-api-key
```

**3. Add Provider Config** (`server/services/newsService.js`):
```javascript
const PROVIDERS = [
  // ... existing providers
  {
    name: 'newprovider',
    priority: 6,
    quality: 85,
    enabled: !!process.env.NEW_PROVIDER_API_KEY,
    adapter: async (page, limit, category) => {
      const response = await axios.get('provider-api-url', {
        params: { /* provider-specific params */ }
      });

      // Normalize to standard format
      return response.data.articles.map(article => ({
        id: article.id,
        title: article.headline,
        description: article.summary,
        url: article.link,
        imageUrl: article.image,
        source: article.publisher,
        publishedAt: article.date,
        category: category || 'general'
      }));
    }
  }
];
```

**4. Test Fallback Chain:** Disable other providers to verify it works

### Debugging Common Issues

#### "API Error: timeout of 30000ms exceeded"
**Causes:**
- Backend server not running on port 5000
- MongoDB connection failed
- Service layer throwing unhandled errors
- Missing required environment variables

**Debug Steps:**
1. Check `server` terminal for error logs
2. Verify MongoDB connection: `MongoDB Connected Successfully`
3. Check for service errors (especially trendAnalysisService)
4. Verify `.env` file has all required keys
5. Check backend logs for specific function errors

#### "trendAnalysisService.getTrendingTopics is not a function"
**Cause:** Missing function export in service file

**Fix:**
1. Verify function exists in `server/services/trendAnalysisService.js`
2. Check `module.exports` includes the function
3. Restart server after adding function

#### Category Filtering Not Working
**Debug Flow:**
1. Check browser console: "🎯 Interest clicked: Tech"
2. Verify API call: "🔍 Dashboard Overview Request: { category: 'tech' }"
3. Check backend mapping: tech → technology
4. Verify NewsAPI response has category articles
5. Check frontend state update: `setActiveInterest('Tech')`

**Common Issue:** Category name mismatch between frontend and backend

#### Articles Not Loading
**Debug Steps:**
1. Open browser Network tab
2. Check `/dashboard/overview` request status
3. If 500: Check backend logs for error
4. If timeout: Check service layer (likely news provider issue)
5. Verify at least one NEWS_API_KEY is configured

### Performance Optimization Checklist

**Backend:**
- [ ] Enable response caching (5min for headlines)
- [ ] Add database indexes for frequent queries
- [ ] Implement request debouncing for AI calls
- [ ] Use connection pooling for MongoDB
- [ ] Add rate limiting middleware

**Frontend:**
- [ ] Use React.memo for expensive components
- [ ] Implement virtualization for long article lists
- [ ] Add code splitting for AI modules (React.lazy)
- [ ] Optimize images with lazy loading
- [ ] Use useMemo/useCallback for derived values

## Testing Strategy

### Manual Testing Checklist

**Dashboard Functionality:**
- [ ] Articles load on page mount
- [ ] Reading mode changes: 5m→6 articles, 15m→12, 30m→20
- [ ] Interest filter shows category-specific news
- [ ] Interest filter deselects when clicked again (shows all)
- [ ] AI toolbar buttons trigger correct modules
- [ ] User stats display correctly
- [ ] Global vectors show trending topics

**AI Modules:**
- [ ] Explain module loads ELI5 content
- [ ] Context Timeline shows chronological events
- [ ] Market Impact displays financial analysis
- [ ] Perspectives shows multiple viewpoints
- [ ] All modules handle loading states
- [ ] Error messages display properly

**Error Handling:**
- [ ] Graceful fallback when API keys missing
- [ ] Multi-provider fallback works correctly
- [ ] Timeout errors show user-friendly message
- [ ] Invalid category returns all news

### Automated Testing (TODO)

```bash
# Backend
npm run test                  # Run all tests
npm run test:watch            # Watch mode
npm run test:coverage         # Coverage report

# Frontend
npm run test                  # Run all tests
npm run test:e2e              # End-to-end tests
```

## Known Issues & Roadmap

### Critical (Fix ASAP)
- [ ] Implement proper JWT authentication with httpOnly cookies
- [ ] Fix Mongoose duplicate schema index warnings
- [ ] Add request rate limiting to prevent API abuse
- [ ] Implement proper error boundaries in React

### High Priority
- [ ] Add AI response streaming for better UX
- [ ] Implement article pagination (infinite scroll)
- [ ] Create user preferences/settings page
- [ ] Add email verification for registration
- [ ] Implement article bookmarking system

### Medium Priority
- [ ] Add search functionality within dashboard
- [ ] Create mobile-responsive design
- [ ] Implement sharing functionality
- [ ] Add article read history
- [ ] Create trending page (/trending route)
- [ ] Build fact-checking Verify Hub (/verify-hub)

### Low Priority / Nice-to-Have
- [ ] Dark mode support
- [ ] Export articles to PDF/Markdown
- [ ] Social features (comments, discussions)
- [ ] Newsletter generation
- [ ] Browser extension
- [ ] Mobile apps (React Native)

## Deployment Notes

### Production Checklist

**Environment:**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (64+ chars)
- [ ] Configure production MongoDB cluster
- [ ] Set up CORS with specific origins
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting

**Build:**
```bash
# Frontend
npm run build                 # Creates dist/ folder

# Backend
# No build needed, runs directly with Node
```

**Environment Variables:**
- Never commit `.env` files
- Use hosting platform's env var management
- Rotate API keys periodically
- Use separate keys for dev/staging/prod

## Notes for AI Assistants (Claude Code)

### ⚠️ CRITICAL: Task Initiation Protocol

**Before starting ANY task, you MUST:**

> Before you start the task, review all inputs and ask me any questions you need to improve the chances of successfully producing the output I am looking for. Number all the questions and if possible, make them yes or no answers so I can quickly, easily, and clearly answer the questions.

**Guidelines for Questions:**
- **Always ask before implementing** (don't assume requirements)
- **Number all questions** for easy reference (1., 2., 3., etc.)
- **Prefer yes/no format** when possible for quick answers
- **Ask about:**
  - Ambiguous requirements or multiple valid approaches
  - Missing implementation details
  - User preferences (UI/UX choices, library selection, etc.)
  - Scope confirmation (what's in/out of scope)
  - Edge cases or error handling expectations
  - Performance vs. simplicity trade-offs

**Example:**
```
User: "Add user profile editing"

Claude: Before I implement this, I have a few questions:

1. Should users be able to change their email address? (yes/no)
2. Should we require current password verification for changes? (yes/no)
3. Do you want inline editing or a separate edit page?
4. Should profile changes be saved automatically or require a "Save" button? (auto/manual)
5. Should we add profile picture upload in this task? (yes/no)
```

### Project Context Priorities

1. **This is an AI-first platform:** AI features are core value, not add-ons
2. **Multi-provider resilience:** Never rely on single news source
3. **User experience first:** Loading states, error handling, fallbacks
4. **Performance matters:** Caching, client-side filtering, optimized queries

### Before Making Changes

1. **Read relevant files:** Understand current implementation
2. **Check dependencies:** Map state flow and data dependencies
3. **Consider impact:** Will this affect other components/services?
4. **Review conventions:** Follow established patterns in codebase

### When Implementing Features

**DO:**
- Add comprehensive logging with emojis (🔍 ✅ ❌ ⚠️)
- Implement loading and error states
- Use existing service layer patterns
- Add try/catch blocks with meaningful errors
- Update this CLAUDE.md if adding new patterns

**DON'T:**
- Mix business logic in route handlers (use services)
- Bypass the multi-provider fallback chain
- Hardcode values that should be configurable
- Skip error handling "for now"
- Create new state when existing state can be derived

### Common Development Patterns

**Adding Dashboard Data:**
1. Add to `dashboardService.getDashboardOverview()`
2. Include in dashboard API response
3. Add state in `ControlCenterPage.jsx`
4. Pass as props to child components

**Category Filtering:**
1. Frontend label → Backend category mapping required
2. New API call with category param
3. Backend maps to provider format
4. Always test with console logs enabled

**AI Module Development:**
1. Define data structure in geminiService.js
2. Create specialized prompt template
3. Build frontend component
4. Add to AICommandToolbar
5. Test with various articles

### Debug Workflow

```
Issue Reported
  → Reproduce locally
  → Check browser console
  → Check Network tab
  → Check backend logs
  → Identify error source
  → Fix root cause (not symptom)
  → Test fix thoroughly
  → Add safeguards to prevent recurrence
```

### State Management Reference

**ControlCenterPage.jsx State:**
```javascript
articles        // Filtered by reading mode (client-side)
allArticles     // Full dataset from API
activeInterest  // Current category filter (triggers API call)
readingMode     // '5m' | '15m' | '30m'
volatility      // 0-100 score
trendingTopics  // Array of {name, change, category}
marketData      // {SP500, BTC, VIX}
userStats       // {xp, level, streak, articlesRead}
globalVectors   // Trending news with titles
```

**When to Reload from API:**
- Initial page load
- Category filter change (activeInterest)
- Manual refresh

**When to Filter Client-Side:**
- Reading mode change
- Sorting
- View toggles

---

**Last Updated:** 2025-01-15
**Maintained By:** Development Team
**Claude Code Compatible:** Yes
**Version:** 1.0.0
