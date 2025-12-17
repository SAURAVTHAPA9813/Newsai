# NewsAI System Design

## Goals
- Deliver reliable, real-time news with AI enrichment and personalization.
- Provide analytics/reading telemetry without impacting UX.
- Scale horizontally as traffic and providers grow; degrade gracefully when providers rate-limit.
- Keep data quality high across multiple news providers.

## Core Domains
- **Ingestion**: Multi-provider headlines/search (NewsAPI, Guardian, GNews) with normalization, category mapping, quality weighting, and provider fallback.
- **Content Enrichment**: AI summaries (Gemini), stress/credibility scoring, trend extraction, topic matrix filters/firewall.
- **User Content**: Saved articles, personalized feeds, preferences, topic matrix state, AI preferences.
- **Analytics**: Reading sessions, engagement, integrity metrics, source diversity, KPIs, trends.
- **Control Center / Trending / Neural Analytics**: Frontend experiences powered by the above services.

## High-Level Architecture
- **Frontend (React/Tailwind/Vite)**: Pages (ControlCenter, Trending, NeuralAnalytics) consume REST APIs. Client caches + staggered fetches to reduce bursts.
- **API Gateway (Express)**: Routes `/api/*`, auth (JWT), rate limiting, input validation, response shaping.
- **Services (modular within Express)**:
  - `newsService`: Multi-provider fetch, normalization, category mapping, caching, fallback rotation.
  - `articleAnalysisService`: Stress/source scoring; attaches metadata to articles.
  - `trendAnalysisService`: Extract trending topics, market placeholders.
  - `aiSummaryService`: Gemini-based summaries (batch + single).
  - `analytics`: Reading sessions, KPIs, trends, integrity, source diversity.
  - `topicMatrixService`: Firewall/priority filters for personalization.
- **Data Stores**:
  - **MongoDB**: Users, Articles, SavedArticles, ReadingSessions, Preferences/TopicMatrix, UserStats.
  - **Cache (in-memory, future: Redis)**: News responses per provider/query, trend data, AI summary cache.
  - **Object Store (future)**: Persist generated assets/snapshots if needed.
- **Messaging (future)**: Queue (e.g., RabbitMQ/Kafka/SQS) for async AI summaries, analytics aggregation, and provider retries.

## Data Model (key collections)
- `User`: auth, profile, preferences, savedArticles refs.
- `Article`: normalized fields (title, url, urlToImage, source {id,name}, category, publishedAt, provider, qualityWeight, fetchedAt).
- `SavedArticle`: user + article ref + snapshot data.
- `ReadingSession`: user, startedAt/endedAt, durationMinutes, device, topic {id,name,category}, source {id,name,tier}, mood/selfReportedAnxiety, engagementEvents, completionRate, focusScore.
- `Preferences/TopicMatrix/UserStats`: personalization and aggregated stats.

## Request Flows
- **Headlines/Trending**: Client → `/api/news/headlines|trending-topics`; service checks cache → provider adapter with mapping/validation → normalize + enrich (scores) → cache → Mongo upsert (history).
- **Search/Category**: Same path with mapped category/query params; fallback to next provider on failure/empty.
- **AI Summaries**: Batch endpoint; enqueue (future) → Gemini → update article payloads → cache.
- **Reading Analytics**: Client posts `/api/analytics/sessions` (auth required) → validate → store → update UserStats (async in future) → exposed via overview/trends/integrity endpoints.
- **Topic Matrix**: Fetch preferences; apply firewall/priority boosts when returning feeds.

## Scaling & Performance
- **Caching**: Short-TTL per provider+query; serve stale-on-error to dodge rate limits. Introduce Redis for multi-instance coherence.
- **Provider Fallback**: Priority order with graceful degradation; tag articles with `provider`.
- **Batching**: Batch AI summaries; batch provider requests where supported.
- **Pagination/PageSize**: Default 10–20 items to reduce API spend and payload size.
- **Staggered Fetches**: Frontend loads critical data first, defers non-critical calls; reuse cached state.
- **CDN**: For static assets and images (proxy untrusted external images through an image proxy/CDN to avoid timeouts/mixed-content).

## Resilience & Quality
- **Validation**: Per-provider schema checks (title/url/publishedAt/urlToImage); drop or default malformed items.
- **Category Mapping**: Centralized mapping (UI ↔ provider ↔ internal) with fallback to `general`.
- **Logging/Tracing**: Log provider used, cache hit/miss, counts of accepted/rejected articles, errors. Add `provider` and `servedFromCache` flags in responses.
- **Rate Limits**: Separate public vs. auth routes; higher dev limits; NewsAPI daily guard rails with cache/DB fallback.
- **Graceful Degradation**: If providers fail, serve cached/DB history; if AI fails, return original articles.

## Security & Privacy
- JWT auth for protected routes; sanitize inputs; helmet/xss-clean/mongo-sanitize already in use.
- Limit PII: store minimal profile data; avoid logging sensitive info.
- RBAC (future) for admin/ops dashboards.

## Observability
- Metrics: provider success/fail rates, cache hit rate, AI latency, analytics write rate, 4xx/5xx by route.
- Dashboards/alerts on error spikes, provider outages, and rate-limit thresholds.
- Tracing (future): request IDs across gateway/services.

## Roadmap / Future Advancements
- Provider diversification: add more free providers; rotate per user/region; A/B test provider priority.
- Offline resilience: prefetch/cache headlines; background sync for analytics.
- Personalized ranking: train a lightweight model using reading sessions + topic matrix + source credibility.
- Notifications/digests: scheduled briefs per user preferences.
- Governance: content integrity scoring surfaced to users; manual override lists.
- Frontend UX: provider badges, “served from cache” hints, retries with backoff, image proxy to eliminate timeouts.
- Messaging/Workers: offload AI and heavy analytics to workers; compute rollups asynchronously.

## What Users Should Focus On (MVP → Growth)
- Fast, reliable headlines/trending with minimal errors.
- Clear source/provider visibility and basic personalization (topic matrix).
- Useful analytics: reading time, focus/anxiety, source diversity, integrity.
- Smooth UX under load: cached responses, graceful fallbacks, no hard errors. 
