Newsai
AI-assisted news intelligence dashboard built with React + Vite. It ships multiple workspaces (Control Center, Verify Hub, Topic Matrix, IQ Lab, Neural Analytics, Trending, and Profile) plus a marketing-style landing page.

Live demo
https://sauravthapa9813.github.io/Newsai
Features
Modular dashboards for verification, topic exploration, cognitive drills, neural analytics, and trending insights
Polished landing experience with hero, pricing, social proof, FAQs, and CTA
Mock service layer and sample data for local development
Hash-based routing configured for GitHub Pages static hosting
Tech stack
React 19, Vite
React Router (HashRouter)
Tailwind CSS + PostCSS + Autoprefixer
Framer Motion, Recharts, React Icons
GitHub Pages via gh-pages
Getting started
Prereqs: Node 18+ and npm.

npm install
npm run dev
<<<<<<< HEAD
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run deploy` — build and publish `dist/` to GitHub Pages (`predeploy` runs automatically)

## Project structure (what each piece does)
- `vite.config.js` — Vite config with GitHub Pages base path.
- `package.json` — scripts (dev/build/deploy) and dependencies.
- `src/main.jsx` — app entry, mounts React with `AuthProvider`.
- `src/App.jsx` — HashRouter routes and layout wiring.
=======
Scripts
npm run dev — start Vite dev server
npm run build — production build to dist/
npm run preview — preview production build locally
npm run deploy — build and publish dist/ to GitHub Pages (predeploy runs automatically)
<<<<<<< HEAD
>>>>>>> eeadefee222309f07b1711720049e7719760cc4d

Project structure (what each piece does)
vite.config.js — Vite config with GitHub Pages base path.
package.json — scripts (dev/build/deploy) and dependencies.
src/main.jsx — app entry, mounts React with AuthProvider.
src/App.jsx — HashRouter routes and layout wiring.
Layouts

src/layouts/PublicLayout.jsx — wraps public pages with navbar/footer.
src/layouts/DashboardLayout.jsx — wraps app pages with sidebar shell.
Pages

src/pages/HomePage.jsx — marketing landing experience.
src/pages/AboutPage.jsx — about content for the product.
src/pages/LoginPage.jsx — auth screen.
src/pages/ControlCenterPage.jsx — main dashboard view.
src/pages/VerifyHubPage.jsx — verification workspace.
src/pages/TopicMatrixPage.jsx — topic exploration.
src/pages/IQLabPage.jsx — cognitive drills/learning area.
src/pages/NeuralAnalyticsPage.jsx — analytics & metrics.
src/pages/TrendingPage.jsx — trending items and signals.
src/pages/UserProfilePage.jsx — profile/settings view.
Context

src/context/AuthContext.jsx — auth state provider and hooks.
Data

src/data/mockNews.json — sample news data.
Services (mock APIs)

src/services/mockDashboardAPI.js — dashboard data mocks.
src/services/mockIQLabAPI.js — IQ Lab data mocks.
src/services/mockNeuralAnalyticsAPI.js — neural analytics mocks.
src/services/mockTopicMatrixAPI.js — topic matrix mocks.
src/services/mockVerifyAPI.js — verification mocks.
Styles

src/styles/index.css — global styles and Tailwind imports.
Utilities

src/utils/badgeIcons.jsx — badge icon lookup/helper.
Components (by area)

src/components/common/Icon.jsx — generic icon wrapper.

src/components/common/IconButton.jsx — styled icon button.

src/components/common/StatusIcon.jsx — status indicator icon.

src/components/sidebar/GlassSidebar.jsx — glassmorphism sidebar.

src/components/sidebar/SidebarNavItem.jsx — nav link item.

src/components/sidebar/UserProfileDock.jsx — compact profile summary.

src/components/dashboard/AICommandDrawer.jsx — drawer for AI commands.

<<<<<<< HEAD
- `src/components/dashboard` landing/marketing set:
  - `DailyBrief.jsx` — daily brief section.
  - `FAQ.jsx` — FAQ accordion/section.
  - `FeatureSection.jsx` — product features.
  - `FinalCTA.jsx` — closing call-to-action.
  - `Footer.jsx` — site footer.
  - `HeroV1.jsx` — hero section.
  - `LatestNews.jsx` — latest news teaser.
  - `Navbar.jsx` — top navigation.
  - `PersonalizationSection.jsx` — personalization pitch.
  - `Pricing.jsx` — pricing plans.
  - `ProductPreview.jsx` — product preview layout.
  - `SocialProof.jsx` — testimonials/logos.
  - `StockSection.jsx` — stock highlights.
  - `UseCases.jsx` — use case highlights.
=======
src/components/dashboard/AICommandToolbar.jsx — toolbar for AI actions.
>>>>>>> eeadefee222309f07b1711720049e7719760cc4d

src/components/dashboard/AIOrb.jsx — animated AI orb visual.

src/components/dashboard/CommandPalette.jsx — command palette UI.

src/components/dashboard/DecompressMode.jsx — decompress/relaxation mode panel.

src/components/dashboard/FocusZenMode.jsx — focus/zen mode experience.

src/components/dashboard/HolographicArticleCard.jsx — holo-styled article card.

src/components/dashboard/ImpactTags.jsx — impact tag badges.

src/components/dashboard/LiveIntelligenceBriefing.jsx — live briefing feed.

src/components/dashboard/PersonalizationStrip.jsx — personalization controls.

src/components/dashboard/RightPanelWellness.jsx — wellness side panel.

src/components/dashboard/SourceScoreBar.jsx — source scoring bar.

src/components/dashboard/StressGuard.jsx — stress guard widget.

src/components/dashboard/TimeScrubber.jsx — time scrubber control.

src/components/dashboard/TrendRadarBar.jsx — trend radar visualization.

src/components/dashboard/VerificationBadge.jsx — verification badge display.

src/components/aimodules/ContextTimelineModule.jsx — context timeline module.

src/components/aimodules/ExplainModule.jsx — explanation module.

src/components/aimodules/MarketImpactModule.jsx — market impact insights.

src/components/aimodules/PerspectivesModule.jsx — perspectives/angles module.

src/components/verify/TruthDialGauge.jsx — truth dial gauge widget.

src/components/verify/VerificationInputArea.jsx — input area for verification.

src/components/verify/VerifyTabNavigation.jsx — tab navigation for verify.

src/components/verify/tabs/* — tab-specific content for verify (see files).

src/components/topicmatrix/AIInstructionsCard.jsx — AI instructions card.

src/components/topicmatrix/ContextProfileCard.jsx — context profile card.

src/components/topicmatrix/FirewallCard.jsx — firewall/guard card.

src/components/topicmatrix/RelatedTopicsStrip.jsx — related topics strip.

src/components/topicmatrix/TopicCard.jsx — topic card item.

src/components/topicmatrix/TopicControlsBar.jsx — topic control bar.

src/components/topicmatrix/TopicDetailCard.jsx — topic detail view.

src/components/topicmatrix/TopicMatrixGrid.jsx — topic matrix grid layout.

src/components/iqlab/AchievementBadges.jsx — achievement badge display.

src/components/iqlab/DailyCognitiveDrill.jsx — daily drill module.

src/components/iqlab/NeuralProficiencyMatrix.jsx — proficiency matrix.

src/components/iqlab/PhilosophyModule.jsx — philosophy/reflection module.

src/components/iqlab/StreakMonitor.jsx — streak tracking widget.

src/components/neural-analytics/CognitiveImpactChart.jsx — impact chart.

src/components/neural-analytics/InsightsCard.jsx — insight card UI.

src/components/neural-analytics/IntegrityMonitor.jsx — integrity monitor.

src/components/neural-analytics/KpiCard.jsx — KPI metric card.

src/components/neural-analytics/RadarDietMap.jsx — radar/diet map chart.

src/components/neural-analytics/SessionLogTable.jsx — session log table.

src/components/neural-analytics/SourceDiversityDonut.jsx — diversity donut chart.

src/components/neural-analytics/TopicTrendTimeline.jsx — topic trend timeline chart.

src/components/dashboard landing/marketing set:

DailyBrief.jsx — daily brief section.
FAQ.jsx — FAQ accordion/section.
FeatureSection.jsx — product features.
FinalCTA.jsx — closing call-to-action.
Footer.jsx — site footer.
HeroV1.jsx — hero section.
LatestNews.jsx — latest news teaser.
Navbar.jsx — top navigation.
PersonalizationSection.jsx — personalization pitch.
Pricing.jsx — pricing plans.
ProductPreview.jsx — product preview layout.
SocialProof.jsx — testimonials/logos.
StockSection.jsx — stock highlights.
UseCases.jsx — use case highlights. =======
Project structure
src/App.jsx — routes (HashRouter) and layout wiring
src/pages/ — page-level screens (landing, dashboard workspaces)
src/layouts/ — public and dashboard shells
src/components/ — UI building blocks, dashboard modules, shared UI
src/services/ — mock API/service facades
src/context/AuthContext.jsx — auth state provider
src/styles/index.css — global styles
f3c30fc82623fe78f1025dfbe10adfb6f988cd91

Deployment (GitHub Pages)
The project is set up for static hosting:

vite.config.js uses base: '/Newsai/' to match the repository name.
Routing uses HashRouter in src/App.jsx so client-side navigation works on GitHub Pages.
Publish with npm run deploy (runs build then pushes dist/ to the gh-pages branch).
After deployment, the site will be served from https://<username>.github.io/Newsai/.
