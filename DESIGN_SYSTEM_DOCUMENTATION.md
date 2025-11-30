# NEWS AI Design System Documentation

## Table of Contents
1. [UI/UX Specifications](#uiux-specifications)
2. [Color Mapping](#color-mapping)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Key Files Reference](#key-files-reference)

---

## UI/UX Specifications

### 🔧 Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React | 19.2.0 |
| **Routing** | React Router DOM | 7.9.6 |
| **Build Tool** | Vite | 7.2.2 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Icons** | React Icons | 5.5.0 |

### 📦 Component Inventory

#### Core Layout Components

##### 1. Navbar
**Location:** `newsai\src\components\Navbar.jsx`

**Features:**
- Fixed positioning with glassmorphism backdrop effect
- Responsive mobile hamburger menu with slide animation
- Conditional rendering (authenticated vs public view)
- Floating notification dropdown card
- Smooth scroll navigation for anchor links
- Hover effects on navigation items

**Key Classes:**
```jsx
// Container
className="fixed top-0 w-full z-50 backdrop-blur-md bg-navbar-bg border-b border-brand-blue/10"

// Nav Links
className="text-[15px] font-medium text-text-secondary hover:text-brand-blue relative group"
```

##### 2. Footer
**Location:** `newsai\src\components\Footer.jsx`

**Features:**
- 4-column responsive grid layout
- Logo, Quick Links, Social Media, Newsletter sections
- Email subscription form with validation
- Social media icon buttons with hover effects
- Smooth scroll links

**Layout Structure:**
- Logo column (Brand identity)
- Quick Links column (Site navigation)
- Social Media column (External links)
- Newsletter column (Email capture)

**Key Classes:**
```jsx
// Grid container
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
```

---

#### Landing Page Sections

##### 3. HeroV1
**Location:** `newsai\src\components\HeroV1.jsx`

**Features:**
- Multi-screen hero section with scroll snap
- Large typography using Cinzel font
- 3D globe image with floating glassmorphism cards
- Massive gradient "NEWS AI" text display
- Badge with beta indicator
- Dual CTA buttons

**Layout:**
- Two-column layout (text + visual)
- Decorative ring patterns
- Floating cards with animation

**Typography:**
```jsx
<h1 className="font-cinzel text-3xl md:text-5xl lg:text-[56px] font-bold text-text-primary leading-tight">
  STAY INFORMED WITH REAL-TIME, AI-CURATED NEWS
</h1>
```

##### 4. SocialProof
**Location:** `newsai\src\components\SocialProof.jsx`

**Features:**
- Statistics display in 3-column grid
- Icon + number + description layout
- Trust indicators for credibility

**Pattern:**
```jsx
{/* Icon */}
<div className="text-4xl mb-4">{icon}</div>
{/* Number */}
<div className="text-3xl font-bold text-text-dark">{stat}</div>
{/* Description */}
<div className="text-text-secondary">{description}</div>
```

##### 5. ProblemSolution
**Location:** `newsai\src\components\ProblemSolution.jsx`

**Features:**
- Two-card comparison layout
- Problem card with red accent
- Solution card with green checkmarks
- Side-by-side presentation

**Color Coding:**
- Problem: Red icon background (`bg-red-500/20`)
- Solution: Green icon background (`bg-green-500/20`)

##### 6. FeatureSection
**Location:** `newsai\src\components\FeatureSection.jsx`

**Features:**
- Asymmetrical header layout (50/50 split)
- 3-column layout with center phone mockup
- 4 feature cards with gradient icon boxes
- Hover scale effects on icons
- Left/right feature alignment

**Icon Box Gradient:**
```jsx
className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
```

##### 7. DailyBrief
**Location:** `newsai\src\components\DailyBrief.jsx`

**Features:**
- Decorative wireframe ring patterns
- 2-column layout (Key Insights vs Trending Topics)
- Topic pills with hover effects
- Timestamp indicator
- Glassmorphism cards

**Pill Pattern:**
```jsx
className="px-4 py-2 bg-white/50 rounded-full text-sm text-text-secondary hover:bg-white/80 transition-all cursor-pointer"
```

##### 8. LatestNews
**Location:** `newsai\src\components\LatestNews.jsx`

**Features:**
- 3-column responsive grid
- Image + badge + content cards
- Hover lift animation
- Gradient card backgrounds
- Category badges

**Card Animation:**
```jsx
className="card-news group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
```

##### 9. PersonalizationSection
**Location:** `newsai\src\components\PersonalizationSection.jsx`

**Features:**
- Circular image with decorative elements
- Numbered steps (1-2-3) with descriptions
- 2-column layout (image + steps)
- Step-by-step guide presentation

**Step Pattern:**
```jsx
<div className="flex gap-4 items-start">
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-bold text-xl">
    {number}
  </div>
  <div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
</div>
```

##### 10. UseCases
**Location:** `newsai\src\components\UseCases.jsx`

**Features:**
- 2×2 grid (4 cards total)
- Gradient icon boxes (unique colors per card)
- Hover scale animation
- Target audience identification

**Card Colors:**
1. Blue gradient: Individual Investors
2. Orange to Red gradient: Business Professionals
3. Purple gradient: Researchers
4. Cyan to Blue gradient: Traders

##### 11. ProductPreview
**Location:** `newsai\src\components\ProductPreview.jsx`

**Features:**
- Mock dashboard UI with news cards
- Sample brief content
- Play button overlay on hover
- 2-column layout (text + preview)

##### 12. StockSection
**Location:** `newsai\src\components\StockSection.jsx`

**Features:**
- 3 glassmorphism cards
- Gradient icon boxes
- Hover scale effects
- Market-related features

##### 13. Pricing
**Location:** `newsai\src\components\Pricing.jsx`

**Features:**
- Single centered card with border accent
- Beta badge in corner
- Feature list with green checkmarks
- Free pricing model
- CTA button

**Pricing Card:**
```jsx
className="relative max-w-md mx-auto p-8 bg-white/90 rounded-3xl border-2 border-brand-blue/20 shadow-lg"
```

##### 14. FAQ
**Location:** `newsai\src\components\FAQ.jsx`

**Features:**
- Expandable/collapsible accordion items
- Chevron rotation animation
- 6 FAQ items covering key topics
- Smooth expand/collapse transitions

**Accordion Pattern:**
```jsx
// Chevron rotation
<FiChevronDown className={`text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
```

##### 15. FinalCTA
**Location:** `newsai\src\components\FinalCTA.jsx`

**Features:**
- Gradient background
- Trust badges
- Dual button layout (primary + secondary)
- Decorative blur elements
- Strong call-to-action messaging

---

#### Page Components

##### 16. HomePage
**Location:** `newsai\src\pages\HomePage.jsx`

**Composition:**
Orchestrates all landing page sections in order:
1. HeroV1
2. SocialProof
3. ProblemSolution
4. FeatureSection
5. PersonalizationSection
6. UseCases
7. ProductPreview
8. StockSection
9. Pricing
10. FAQ
11. FinalCTA

---

### 🎨 Homepage CSS Gradients Reference

#### Background Gradients

**1. HeroV1 - Text Gradient (Massive "NEWS AI" Display)**
```css
background: linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
- Start: `#4169E1` (Royal Blue)
- End: `#5B8DEF` (Lighter Blue)
- Direction: 135deg (diagonal)
- Applied to: Massive display text via WebKit clip

**2. SocialProof, FeatureSection, UseCases, Pricing - Background**
```css
background: linear-gradient(to bottom, #F8F9FF 0%, #E7EBFF 100%);
```
- Start: `#F8F9FF` (Very light blue-white)
- End: `#E7EBFF` (Light blue)
- Direction: Top to bottom
- Used in: 4 different sections for consistency

**3. ProblemSolution - Complex Background**
```css
background: linear-gradient(147deg,
  rgba(255, 255, 255, 1) 0%,
  rgba(194, 213, 255, 1) 65%,
  rgba(194, 213, 255, 1) 59%,
  rgba(255, 255, 255, 1) 100%
);
```
- Start: White `#FFFFFF` (0%)
- Mid: Light blue `#C2D5FF` (59-65%)
- End: White `#FFFFFF` (100%)
- Direction: 147deg (diagonal)
- Creates soft blue band in middle

**4. PersonalizationSection - Radial Background**
```css
background: radial-gradient(circle,
  rgba(255, 255, 255, 1) 0%,
  rgba(196, 205, 242, 1) 51%,
  rgba(196, 205, 242, 1) 51%,
  rgba(255, 255, 255, 1) 100%
);
```
- Center: White `#FFFFFF` (0%)
- Mid: Light blue `#C4CDF2` (51%)
- Edge: White `#FFFFFF` (100%)
- Type: Radial gradient (circle from center)

**5. PersonalizationSection - Image Fallback**
```css
background: linear-gradient(135deg, #3D66E3 0%, #6181CC 100%);
```
- Start: `#3D66E3` (Darker blue)
- End: `#6181CC` (Lighter blue)
- Used when image fails to load

**6. ProductPreview - Complex 3-Stop Background**
```css
background: linear-gradient(335deg,
  rgba(223, 224, 240, 1) 2%,
  rgba(196, 205, 242, 1) 51%,
  rgba(242, 245, 255, 1) 100%
);
```
- Start: `#DFE0F0` (Light gray-blue, 2%)
- Mid: `#C4CDF2` (Light blue, 51%)
- End: `#F2F5FF` (Very light blue, 100%)
- Direction: 335deg (diagonal)

**7. FAQ - Complex 5-Stop Background**
```css
background: linear-gradient(335deg,
  rgba(255, 255, 255, 1) 0%,
  rgba(207, 222, 255, 1) 29%,
  rgba(196, 205, 242, 1) 51%,
  rgba(196, 205, 242, 1) 51%,
  rgba(255, 255, 255, 1) 100%
);
```
- Start: White `#FFFFFF` (0%)
- 29%: Light blue `#CFDEff`
- 51%: Light blue `#C4CDF2`
- End: White `#FFFFFF` (100%)
- Direction: 335deg (diagonal)

**8. FinalCTA - Centered Highlight Gradient**
```css
background: linear-gradient(135deg, #4169E1 0%, #8AAAF7 50%, #4169E1 100%);
```
- Start: `#4169E1` (Royal Blue)
- Mid: `#8AAAF7` (Light Blue, 50% - creates center highlight)
- End: `#4169E1` (Royal Blue)
- Direction: 135deg (diagonal)
- Effect: Brighter in center, darker on edges

#### Icon Box Gradients

**Standard Brand Blue**
```css
className="bg-gradient-to-br from-brand-blue to-blue-600"
```
- From: `#4169E1` (brand-blue)
- To: `#2563EB` (blue-600)
- Direction: Bottom-right diagonal
- Used in: SocialProof, FeatureSection, Pricing badge

**UseCases - Four Unique Gradients**

1. **Technology (Blue-Cyan):**
```css
className="bg-gradient-to-br from-blue-500 to-cyan-500"
```
- From: `#3B82F6` (blue-500)
- To: `#06B6D4` (cyan-500)

2. **Finance (Purple-Pink):**
```css
className="bg-gradient-to-br from-purple-500 to-pink-500"
```
- From: `#A855F7` (purple-500)
- To: `#EC4899` (pink-500)

3. **Research (Green-Emerald):**
```css
className="bg-gradient-to-br from-green-500 to-emerald-500"
```
- From: `#22C55E` (green-500)
- To: `#10B981` (emerald-500)

4. **Trading (Orange-Red):**
```css
className="bg-gradient-to-br from-orange-500 to-red-500"
```
- From: `#F97316` (orange-500)
- To: `#EF4444` (red-500)

**StockSection - Three Gradients**

1. **Blue:** `from-blue-500 to-blue-600` (#3B82F6 → #2563EB)
2. **Purple:** `from-purple-500 to-purple-600` (#A855F7 → #9333EA)
3. **Green:** `from-green-500 to-green-600` (#22C55E → #16A34A)

#### Gradient Direction Reference

```css
/* Common directions used */
to bottom        /* Vertical: top → bottom */
135deg          /* Diagonal: top-left → bottom-right */
147deg          /* Diagonal: custom angle */
335deg          /* Diagonal: custom angle */
to-br           /* Tailwind: bottom-right diagonal */
circle          /* Radial: center outward */
```

---

### 🎨 Homepage Color Palette Extensions

#### New Background Colors

```css
#F8F9FF  /* Very light blue-white - Section backgrounds */
#E7EBFF  /* Light blue - Gradient ends */
#C2D5FF  /* Light blue - ProblemSolution gradient */
#C4CDF2  /* Light blue - Multiple sections (PersonalizationSection, ProductPreview, FAQ) */
#DFE0F0  /* Light gray-blue - ProductPreview gradient start */
#F2F5FF  /* Very light blue - ProductPreview gradient end */
#CFDEff  /* Light blue - FAQ gradient */
```

#### New Accent Colors

```css
#3D66E3  /* Darker blue - PersonalizationSection fallback */
#6181CC  /* Medium blue - PersonalizationSection fallback */
#5B8DEF  /* Lighter blue - HeroV1 text gradient end */
#8AAAF7  /* Light blue - FinalCTA gradient midpoint */
```

#### Glassmorphism Variations

```css
/* HeroV1 Floating Cards */
bg-white/30 border-white/20  /* 30% white bg, 20% white border */

/* ProblemSolution Cards */
bg-white/40 border-white/50  /* 40% white bg, 50% white border */

/* ProductPreview Brief Card */
bg-white/60 border-white/80  /* 60% white bg, 80% white border */

/* UseCases Cards */
bg-white/60 border-white/80  /* Same as ProductPreview */

/* Pricing Card */
bg-white/60 border-4 border-brand-blue  /* 60% white bg, solid blue border */
```

---

### 📐 Homepage Animation Specifications

#### Drop Shadows & Effects

**HeroV1 Globe:**
```css
filter: drop-shadow(0 0 60px rgba(65, 105, 225, 0.4));
```
- Blur: 60px
- Color: Brand blue at 40% opacity
- Creates glowing effect

**FeatureSection Phone:**
```css
filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25));
transform: perspective(1000px) rotateY(-5deg);
```
- Drop shadow: 25px offset, 50px blur, 25% black
- 3D perspective: 1000px depth, -5deg Y rotation

#### Pulse Animations

**PersonalizationSection Decorative Circles:**
```jsx
className="animate-pulse"
style={{ animationDelay: '1s' }}
```
- Animation: Tailwind's pulse (opacity 1 → 0.5)
- Delay: Staggered 1s delay for layered effect
- Multiple circles create depth

#### Accordion Animations

**FAQ Chevron Rotation:**
```jsx
className={`transition-transform duration-300 ${
  openIndex === index ? 'rotate-180' : ''
}`}
```
- Property: Transform (rotate)
- Duration: 300ms
- Rotation: 0deg → 180deg

**FAQ Content Expand:**
```jsx
className={`overflow-hidden transition-all duration-300 ${
  openIndex === index ? 'max-h-96' : 'max-h-0'
}`}
```
- Property: max-height
- Duration: 300ms
- Range: 0 → 384px (24rem)

#### Hover Transitions

**Card Scale:**
```jsx
className="hover:scale-105 transition-all duration-300"
```
- Transform: scale 1.0 → 1.05
- Duration: 300ms

**Button Animations:**
```jsx
/* Primary CTA */
className="hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"

/* Arrow Icon Inside Button */
className="group-hover:translate-x-1 transition-transform duration-300"
```

---

### 🔤 Homepage Typography Extensions

#### Custom Font: Fauna One

**Usage:**
```jsx
className="font-[Fauna One] text-lg"
```
- Used in: HeroV1 subheading
- Imported via: Google Fonts or local

#### Massive Display Text Sizes

**Custom Sizing Scale:**
```jsx
/* Responsive massive text */
className="text-[80px] md:text-[150px] lg:text-[200px] xl:text-[280px]"
```

**Breakdown:**
- Mobile: 80px
- Tablet (md): 150px
- Laptop (lg): 200px
- Desktop (xl): 280px
- Font: Cinzel Bold
- Applied to: "NEWS AI" massive display in HeroV1

#### Standard Custom Sizes

```jsx
text-[56px]  /* Large headings on desktop */
text-[80px]  /* Massive text mobile */
text-[150px] /* Massive text tablet */
text-[200px] /* Massive text laptop */
text-[280px] /* Massive text desktop */
```

---

### 🧩 Component-Specific Design Details

#### PersonalizationSection

**Decorative Elements:**
- Circular image container: 500x500px max
- 2 decorative blur circles with pulse animation
- Circle borders: `border-4 border-white/30`
- Circle backgrounds: `bg-white/10`, `bg-white/15`, `bg-white/20`
- Numbered step badges: 1, 2, 3 with `bg-brand-blue`

**Radial Gradient Center:**
- Creates spotlight effect on center image
- Fades to white at edges

#### ProductPreview

**Category Badge System:**
```jsx
/* Technology */
bg-blue-100 text-blue-700

/* Finance */
bg-green-100 text-green-700

/* World News */
bg-purple-100 text-purple-700
```

**Mock Dashboard Elements:**
- Traffic light dots: Red, Yellow, Green (top-left)
- Window controls styling
- News cards with glassmorphism layers

**Play Button Overlay:**
```css
/* Hover reveals play button */
opacity-0 hover:opacity-100 transition-opacity duration-300
```

#### FAQ

**Accordion Pattern:**
- State management: `useState` for `openIndex`
- 6 FAQ items total
- Smooth expand/collapse with max-height transition
- Chevron icon rotates 180deg when open

#### FinalCTA

**Decorative Background Elements:**
```jsx
/* Top-left blur circle */
<div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl
     -translate-x-1/2 -translate-y-1/2"></div>

/* Bottom-right blur circle */
<div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl
     translate-x-1/2 translate-y-1/2"></div>
```
- Creates depth and visual interest
- Subtle white glow at 10% opacity
- Extra large blur (3xl)

##### 17. LoginPage
**Location:** `newsai\src\pages\LoginPage.jsx`

**Features:**
- Neural network canvas animation background
- Sliding panel animation (Sign In ↔ Sign Up)
- Glassmorphism form cards
- AI orb with pulsing circles
- Dual forms (Sign In / Sign Up)
- Form validation
- Animated transitions

**Special Effects:**
- Canvas particle animation with connected nodes
**Detailed Design Specifications:**

#### Background Design

**Main Page Gradient:**
```css
background: linear-gradient(4deg,
  rgba(255, 255, 255, 1) 0%,      /* Pure white bottom */
  rgba(241, 234, 249, 1) 40%,     /* Light lavender #F1EAF9 */
  rgba(205, 216, 245, 1) 79%      /* Soft blue #CDD8F5 */
)
```

**Neural Network Canvas Animation:**
- **Particle System:** 100 animated particles
- **Particle Colors:** Radial gradient from `#0099FF` (80% opacity) to `#00D4FF` (20% opacity)
- **Connection Lines:** Blue `rgba(0, 153, 255, 0-0.3)` with 1px width
- **Max Distance:** 150px (particles connect within range)
- **Animation:** 60 FPS smooth movement

#### Glassmorphism Card

**Main Authentication Card:**
```css
background: rgba(255, 255, 255, 0.4);           /* 40% white */
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.5);    /* 50% white border */
box-shadow: 0 8px 32px 0 rgba(0, 153, 255, 0.25); /* Blue-tinted shadow */
border-radius: 1.5rem;                          /* rounded-3xl (24px) */
max-width: 72rem;                               /* 6xl (1152px) */
min-height: 600px;
```

#### AI Orb Animation

**4-Layer Concentric Pulsing Circles:**

```css
/* Layer 1 (Outermost) */
border: 4px solid rgba(255, 255, 255, 0.3);
background: radial-gradient(circle,
  rgba(255, 255, 255, 0.3) 0%,
  rgba(99, 172, 212, 0.2) 20%,
  rgba(122, 195, 255, 0.1) 50%
);

/* Layer 4 (Core) */
background: radial-gradient(circle,
  rgba(255, 255, 255, 1) 0%,
  rgba(99, 172, 212, 1) 20%,
  rgba(122, 195, 255, 1) 50%
);
box-shadow: 0 0 60px rgba(122, 195, 255, 0.8); /* Glow effect */
```

**Pulse Animation:**
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.6; }
}
animation: pulse 1.5s ease-in-out infinite;
/* Staggered delays: 0ms, 100ms, 200ms, 300ms */
```

#### Typography

**Page Headings:**
```jsx
className="font-cinzel text-3xl font-bold text-text-dark mb-2"
```
- Font: Cinzel (serif)
- Size: 3xl (1.875rem / 30px)
- Weight: Bold (700)
- Color: #2C3142 (text-dark)

**Subtitle Text:**
```jsx
className="text-text-secondary mb-8"
```
- Color: #5C6378 (text-secondary)
- Size: Base (1rem / 16px)

**Overlay Panel Text:**
```jsx
className="font-cinzel text-3xl font-bold mb-4"       /* Heading */
className="mb-8 text-black/90 leading-relaxed"        /* Body */
```

#### Form Elements

**Input Fields:**
```jsx
/* Normal State */
className="w-full pl-12 pr-4 py-3 rounded-lg
           bg-white/40 border border-white/50
           text-text-dark placeholder-text-secondary/60"

/* Focus State */
className="focus:outline-none focus:border-brand-blue
           focus:ring-2 focus:ring-brand-blue/20 transition-all"
```

**Input Specifications:**
- Background: `rgba(255, 255, 255, 0.4)` (40% white)
- Border: `rgba(255, 255, 255, 0.5)` (50% white)
- Focus Border: `#4169E1` (brand-blue)
- Focus Ring: 2px `rgba(65, 105, 225, 0.2)` (brand-blue at 20%)
- Icon Color: `#5C6378` (text-secondary)
- Icon Size: 20x20px (w-5 h-5)

**Primary Button (Sign In/Sign Up):**
```jsx
className="w-full py-3 rounded-lg bg-brand-blue text-white font-semibold
           hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
```
- Normal: `#4169E1` (brand-blue) background
- Hover: `#1D4ED8` (blue-700) background
- Shadow: Large → Extra Large on hover

**Secondary Button (Overlay):**
```jsx
className="px-8 py-3 rounded-lg border-2 border-white text-black
           font-semibold hover:bg-white hover:text-brand-blue transition-all"
```
- Normal: Transparent background, 2px white border
- Hover: White background, brand-blue text

#### Color Palette

**Blues (Primary):**
- `#0099FF` - Particle gradient start, connection lines
- `#00D4FF` - Particle gradient end (cyan)
- `#4169E1` - Brand blue (buttons, focus, links)
- `#1D4ED8` - Blue-700 (button hover)
- `#63ACD4` - Orb gradient mid-tone
- `#7AC3FF` - Orb gradient outer, glow

**Neutrals:**
- `#FFFFFF` - Pure white (background start, orb center)
- `rgba(255, 255, 255, 0.4)` - Input backgrounds
- `rgba(255, 255, 255, 0.5)` - Card borders, input borders
- `#2C3142` - text-dark (headings)
- `#5C6378` - text-secondary (body text, icons)

**Accents:**
- `#F1EAF9` - Light lavender (background gradient 40%)
- `#CDD8F5` - Soft blue (background gradient 79%)

#### Animations & Transitions

**Form Slide Animation:**
```jsx
/* Sign In → Sign Up transition */
className="transition-all duration-700"
transform: isSignUp ? 'md:translate-x-full opacity-0' : 'translate-x-0 opacity-100'
```
- Duration: 700ms
- Easing: Default (ease)
- Properties: Transform (translateX) + opacity

**Overlay Panel Slide:**
```jsx
className="transition-all duration-700 ease-in-out"
position: isSignUp ? 'left-0' : 'md:left-1/2 left-0'
```

**All Interactive Elements:**
- Standard transition: 300ms (Tailwind default)
- Buttons, inputs, links: `transition-all`

#### Responsive Design

**Mobile (<768px):**
- Forms stack vertically
- Full-width card with `p-6` padding
- Overlay panel visible above forms

**Desktop (≥768px):**
- Side-by-side layout (forms 50%, overlay 50%)
- Card padding: `md:p-12`
- Sliding animation between states
- Overlay slides: `md:left-1/2`

**Responsive Classes:**
```jsx
"p-6 md:p-12"              /* Card padding */
"w-full md:w-1/2"          /* Form width */
"md:translate-x-full"      /* Desktop slide */
```

#### Unique Design Elements

**Neural Network Canvas:**
- Live animated particle system
- 100 interactive particles with dynamic connections
- Gradient-colored particles
- Smooth 60 FPS animation
- Responsive to window resize

**AI Orb:**
- 4-layer concentric pulsing circles
- Staggered animation delays (0ms, 100ms, 200ms, 300ms)
- Radial gradients from white to blue
- 60px glow effect
- Creates AI/technology aesthetic

**Sliding Panel System:**
- Smooth form transition (700ms)
- Dual-state: Sign In ↔ Sign Up
- Grid pattern overlay background
- Opacity + transform combined animation

##### 18. Additional Pages
- **AboutPage**: Information about the platform
- **TrendingPage**: Trending news display (authenticated)
- **CategoriesPage**: News categories (authenticated)
- **SummariesPage**: News summaries (authenticated)
- **UserProfilePage**: User profile management (authenticated)

---

### 🎨 Layout Patterns

#### Container System

**Main Container:**
```css
.container-custom {
  max-width: 1280px; /* 7xl */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem; /* 6 */
  padding-right: 1.5rem; /* 6 */
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 3rem; /* 12 */
    padding-right: 3rem; /* 12 */
  }
}
```

**Section Padding:**
```css
.section-padding {
  padding-top: 4rem;    /* 16 - mobile */
  padding-bottom: 4rem; /* 16 - mobile */
}

@media (min-width: 768px) {
  .section-padding {
    padding-top: 5rem;    /* 20 */
    padding-bottom: 5rem; /* 20 */
  }
}

@media (min-width: 1024px) {
  .section-padding {
    padding-top: 6rem;    /* 24 */
    padding-bottom: 6rem; /* 24 */
  }
}
```

#### Grid Patterns

**3-Column Responsive Grid:**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```
- Mobile: 1 column
- Tablet (768px+): 2 columns
- Desktop (1024px+): 3 columns

**4-Column Footer Grid:**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
```

**50/50 Split:**
```jsx
className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
```
- Mobile: Stacked
- Desktop: Side by side

#### Card Patterns

**Glassmorphism Card:**
```css
.card-glassy {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

**News Card:**
```css
.card-news {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card-news:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

**Feature Card with Icon:**
```jsx
<div className="group">
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center mb-6">
    <Icon className="text-3xl text-white" />
  </div>
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

---

### ✨ Design Patterns & Conventions

#### Interaction Patterns

**Smooth Scroll Navigation:**
```css
html {
  scroll-behavior: smooth;
}
```

**Hover Lift Animation:**
```css
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

**Hover Scale Animation:**
```css
.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

**Icon Hover:**
```css
.icon-hover {
  transition: transform 0.3s ease;
}

.icon-hover:hover {
  transform: scale(1.10);
}
```

**Standard Transition Duration:**
- Fast: `duration-300` (300ms) - Hovers, small interactions
- Medium: `duration-500` (500ms) - Larger animations
- Slow: `duration-700` (700ms) - Page transitions, slides

#### Animation Patterns

**Slide Animation (LoginPage):**
```jsx
transition: 'transform 0.7s ease-in-out'
transform: isSignUp ? 'translateX(100%)' : 'translateX(0)'
```

**Pulse Animation:**
```css
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.pulse-animation {
  animation: pulse 1.5s ease-in-out infinite;
}
```

**Neural Network Canvas:**
- Particle animation with connected nodes
- Mouse interaction (particles move away from cursor)
- Gradient colors from blue to cyan
- 60 FPS animation loop

**Rotating Logo Icon:**
```jsx
className="inline-block group-hover:rotate-12 transition-transform duration-300"
```

#### Visual Hierarchy

**Spacing Scale:**
- **Extra Tight:** `gap-2` (0.5rem / 8px)
- **Tight:** `gap-4` (1rem / 16px)
- **Normal:** `gap-6` (1.5rem / 24px)
- **Comfortable:** `gap-8` (2rem / 32px)
- **Loose:** `gap-12` (3rem / 48px)

**Border Radius Scale:**
- **Small:** `rounded-lg` (0.5rem / 8px) - Buttons, inputs
- **Medium:** `rounded-xl` (0.75rem / 12px) - Cards
- **Large:** `rounded-2xl` (1rem / 16px) - Feature cards
- **Extra Large:** `rounded-3xl` (1.5rem / 24px) - Hero cards
- **Full:** `rounded-full` - Badges, pills, avatars

---

### 🎯 User Interaction Flows

#### Public User Flow
```
Landing Page
    ↓
Browse Features & Benefits
    ↓
Review Pricing (Free Beta)
    ↓
Sign Up (LoginPage)
    ↓
Authenticated Dashboard
```

**Navigation Structure (Public):**
- Home → Product → Use Cases → Pricing → About

**CTA Hierarchy:**
1. Primary CTAs: "Get Started Free" (multiple locations)
2. Secondary CTAs: "Learn More", "View Demo"
3. Tertiary CTAs: Navigation links, footer links

#### Authenticated User Flow
```
Login/Sign Up
    ↓
User Dashboard/Home
    ↓
Browse News (Trending/Categories/Summaries)
    ↓
Manage Profile
```

**Navigation Structure (Authenticated):**
- Home → Trending → Categories → Summaries → About → Profile

#### Form Interactions

**Login/Sign Up Flow:**
1. Land on LoginPage
2. Default: Sign In form visible
3. Click "Sign Up" → Panel slides, Sign Up form visible
4. Fill form → Validation → Submit
5. Success → Redirect to authenticated area

**Newsletter Subscription:**
1. Enter email in footer form
2. Click "Subscribe"
3. Success message display
4. Email added to list

---

### 📱 Responsive Design Approaches

#### Breakpoints (Tailwind Defaults)

```javascript
{
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px'
}
```

#### Mobile-First Strategy

**Core Principles:**
1. Design for mobile first (320px base)
2. Progressive enhancement for larger screens
3. Touch-friendly targets (44×44px minimum)
4. Simplified navigation (hamburger menu)
5. Optimized images and assets

**Mobile Navigation:**
```jsx
{/* Desktop Navigation */}
<div className="hidden lg:flex items-center gap-8">
  {/* Nav links */}
</div>

{/* Mobile Menu Button */}
<button className="lg:hidden">
  <FiMenu />
</button>

{/* Mobile Menu Panel */}
<div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
  {/* Mobile nav */}
</div>
```

#### Responsive Techniques

**Flexbox Direction Changes:**
```jsx
className="flex flex-col md:flex-row gap-8"
```
- Mobile: Stacked vertically
- Tablet+: Horizontal row

**Grid Column Adjustments:**
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
```
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Padding/Margin Scaling:**
```jsx
className="p-6 md:p-8 lg:p-12"
```
- Mobile: 1.5rem padding
- Tablet: 2rem padding
- Desktop: 3rem padding

**Typography Scaling:**
```jsx
className="text-3xl md:text-4xl lg:text-5xl"
```
- Mobile: 1.875rem (30px)
- Tablet: 2.25rem (36px)
- Desktop: 3rem (48px)

**Order Changes:**
```jsx
{/* Text first on mobile, second on desktop */}
<div className="order-2 lg:order-1">{text}</div>
{/* Image second on mobile, first on desktop */}
<div className="order-1 lg:order-2">{image}</div>
```

**Hidden Elements:**
```jsx
{/* Hidden on mobile, visible on desktop */}
className="hidden lg:block"

{/* Visible on mobile, hidden on desktop */}
className="block lg:hidden"
```

**Responsive Images:**
```jsx
className="w-full h-auto object-cover"
```

---

## Color Mapping

### 🎨 Color Usage Throughout Application

#### Primary Brand Color: #4169E1 (Royal Blue)

**Usage Locations:**

1. **Logo & Branding**
   - Logo text color
   - Logo icon color
   - Brand mark

2. **Navigation**
   - Active navigation links: `text-brand-blue`
   - Hover states: `hover:text-brand-blue`
   - Underline effects: `bg-brand-blue`
   - Focus states on inputs

3. **Buttons**
   - Primary action buttons: `bg-brand-blue`
   - Button borders: `border-brand-blue`
   - Hover states: `hover:bg-blue-600`

4. **Interactive Elements**
   - Links: `text-brand-blue hover:underline`
   - CTA text
   - Focus rings: `focus:ring-brand-blue/20`

5. **Gradient Effects**
   - Text gradients (start color)
   - Background gradients (primary color)
   - Icon box gradients: `from-brand-blue to-blue-600`

6. **Badges & Pills**
   - Badge accents
   - Category badges
   - Beta indicators

7. **Borders & Dividers**
   - Card borders: `border-brand-blue/20`
   - Section dividers: `border-brand-blue/10`

---

#### Dark Neutrals

**Text Primary (#3D4457):**
- Main headings
- Section titles
- Important text
- Card titles

**Text Secondary (#5C6378):**
- Body paragraphs
- Descriptions
- Supporting text
- Navigation default state
- Metadata

**Text Dark (#2C3142):**
- Emphasis text
- Strong headings
- High-contrast text
- Statistics numbers

**Button Dark (#2C3142):**
- Dark buttons (secondary style)
- Hover state: `#3D4457`

---

#### Background Colors

**Page Background (rgb(237, 241, 255)):**
```css
/* Light blue-tinted white */
body {
  background-color: rgb(237, 241, 255);
}
```
- Main page background
- Creates soft, professional feel
- Reduces eye strain

**Navbar Background (rgba(240, 243, 255, 0.8)):**
```css
.navbar {
  background-color: rgba(240, 243, 255, 0.8);
  backdrop-filter: blur(16px);
}
```
- Semi-transparent with blur
- Glassmorphism effect
- Allows content to show through

**Hero Backgrounds:**
- `hero-bg`: rgb(206, 217, 245) - Main hero section
- `hero-alt-bg`: rgb(220, 227, 245) - Alternative hero areas
- Subtle gradients for depth

**Section Background (rgb(220, 227, 245)):**
- Alternating sections
- Creates visual separation
- Maintains light, airy feel

**Card Backgrounds:**
- `card-bg`: rgba(255, 255, 255, 0.95) - Solid cards
- `glassy-card`: rgba(255, 255, 255, 0.7) - Glassmorphism cards
- White with varying opacity for depth

---

#### Component-Specific Color Usage

##### Navbar
```jsx
// Container
className="backdrop-blur-md bg-navbar-bg border-b border-brand-blue/10"

// Links
className="text-text-secondary hover:text-brand-blue"

// Active Link Underline
className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"

// Primary Button
className="px-6 py-2 bg-brand-blue text-white rounded-lg"

// Secondary Button
className="px-6 py-2 border-2 border-brand-blue text-brand-blue rounded-lg"
```

##### Hero Section
```jsx
// Background
className="bg-hero-bg"

// Glassmorphism Cards
className="p-6 rounded-3xl bg-white/30 backdrop-blur-md border border-white/20"

// Badge
className="inline-block px-4 py-2 rounded-full bg-badge-bg text-badge-text"

// Primary Button
className="px-8 py-4 bg-button-dark hover:bg-button-hover text-white"

// Gradient Text
style={{
  background: 'linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}
```

##### Feature Icons
```jsx
// Icon Container
className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center"

// Icon
className="text-3xl text-white"
```

##### Problem/Solution Cards
```jsx
// Problem Card
<div className="p-8 bg-white/90 rounded-2xl">
  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
    <FiAlertCircle className="text-3xl text-red-600" />
  </div>
</div>

// Solution Card
<div className="p-8 bg-white/90 rounded-2xl">
  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
    <FiCheckCircle className="text-3xl text-green-600" />
  </div>
  {/* Checkmarks */}
  <FiCheck className="text-green-600" />
</div>
```

##### Pricing
```jsx
// Card Border
className="border-2 border-brand-blue/20"

// Beta Badge
className="absolute top-4 right-4 px-4 py-1 bg-gradient-to-br from-brand-blue to-blue-600 text-white text-sm font-semibold rounded-full"

// Feature Checkmarks
<div className="flex items-start gap-3">
  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
    <FiCheck className="text-green-600 text-sm" />
  </div>
</div>
```

##### Login Page
```jsx
// Canvas Particles
// Start color: rgba(0, 153, 255, 0.8) - Blue
// End color: rgba(0, 212, 255, 0.2) - Cyan

// Glassmorphism Overlay
className="backdrop-blur-lg bg-white/30 rounded-3xl shadow-2xl"

// Form Container
className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl"

// Input Fields
className="bg-white/40 border border-white/50 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"

// Submit Button
className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl"
```

---

#### Semantic Color Assignments

**Primary (Blue Family):**
- `brand-blue` (#4169E1) - Main brand color
- `blue-600` (#2563EB) - Hover states
- `blue-700` (#1D4ED8) - Active states
- **Purpose:** Actions, links, emphasis, brand identity

**Success (Green Family):**
- `green-500` (#22C55E) - Success indicators
- `green-600` (#16A34A) - Strong success
- `green-500/20` - Light success background
- **Purpose:** Checkmarks, solution indicators, positive states

**Warning (Yellow Family):**
- `yellow-500` - Warning states (minimal usage)
- **Purpose:** Caution indicators

**Error (Red Family):**
- `red-500` (#EF4444) - Error states
- `red-600` (#DC2626) - Strong errors
- `red-500/20` - Light error background
- **Purpose:** Error messages, problem indicators, alerts

**Info (Blue Variants):**
- Light blues for informational elements
- **Purpose:** AI features, tech elements, information display

**Neutral (Gray Family):**
- `gray-200` - Subtle borders
- `gray-300` - Dividers
- `gray-400` - Disabled states
- **Purpose:** Backgrounds, borders, disabled elements

---

## Color Palette

### 🎨 Complete Color Inventory

#### Custom Color Tokens
**Location:** `tailwind.config.js`

```javascript
colors: {
  // Page Backgrounds
  'page-bg': 'rgb(237, 241, 255)',           // #EDF1FF - Main background
  'navbar-bg': 'rgba(240, 243, 255, 0.8)',   // #F0F3FF @ 80% - Navbar
  'hero-bg': 'rgb(206, 217, 245)',           // #CED9F5 - Hero section
  'hero-alt-bg': 'rgb(220, 227, 245)',       // #DCE3F5 - Alt hero
  'section-bg': 'rgb(220, 227, 245)',        // #DCE3F5 - Sections

  // Card Backgrounds
  'card-bg': 'rgba(255, 255, 255, 0.95)',    // White @ 95%
  'glassy-card': 'rgba(255, 255, 255, 0.7)', // White @ 70% - Glassmorphism

  // Text Colors
  'text-primary': '#3D4457',    // Dark gray-blue - Headings
  'text-secondary': '#5C6378',  // Medium gray - Body text
  'text-accent': '#4169E1',     // Royal blue - Accents
  'text-dark': '#2C3142',       // Very dark blue - Emphasis

  // Brand Colors
  'brand-blue': '#4169E1',      // Royal Blue - Primary brand

  // Button Colors
  'button-dark': '#2C3142',     // Dark buttons
  'button-hover': '#3D4457',    // Dark button hover

  // Badge Colors
  'badge-bg': 'rgba(100, 120, 180, 0.1)',  // #6478B4 @ 10%
  'badge-text': '#5C6378',

  // Special Colors
  'globe-blue': '#5B8DEF',      // Globe mid-tone
  'globe-light': '#A8C8FF',     // Globe highlight
}
```

#### Gradient Definitions
**Location:** `tailwind.config.js`

```javascript
backgroundImage: {
  'crypto-gradient': 'radial-gradient(at top left, #8A9EFF 0%, #E7EBFF 30%, #F8F9FF 70%)',
  'globe-gradient': 'radial-gradient(circle at 30% 30%, #A8C8FF 0%, #5B8DEF 50%, #4169E1 100%)',
}
```

#### Inline Gradients Used in Components

**Text Gradients:**
```css
/* Primary text gradient */
background: linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Background Gradients:**
```css
/* Final CTA section */
background: linear-gradient(135deg, #4169E1 0%, #8AAAF7 50%, #4169E1 100%);

/* Feature section background */
background: linear-gradient(to bottom, #F8F9FF 0%, #E7EBFF 100%);

/* Problem/Solution background */
background: linear-gradient(147deg, rgba(255, 255, 255, 1) 0%, rgba(194, 213, 255, 1) 65%, rgba(206, 217, 245, 1) 100%);
```

#### Tailwind Color Classes Used

**Blue Family:**
```javascript
'blue-50': '#EFF6FF',
'blue-500': '#3B82F6',
'blue-600': '#2563EB',  // Used for hover states
'blue-700': '#1D4ED8',
```

**Green Family (Success):**
```javascript
'green-500': '#22C55E',
'green-600': '#16A34A',
'green-500/20': 'rgba(34, 197, 94, 0.2)',  // Light background
```

**Red Family (Error/Problem):**
```javascript
'red-50': '#FEF2F2',
'red-500': '#EF4444',
'red-600': '#DC2626',
'red-500/20': 'rgba(239, 68, 68, 0.2)',    // Light background
```

**Purple Family (Accents):**
```javascript
'purple-100': '#F3E8FF',
'purple-500': '#A855F7',
'purple-600': '#9333EA',
'purple-700': '#7E22CE',
```

**Gray Family (Neutral):**
```javascript
'gray-200': '#E5E7EB',  // Subtle borders
'gray-300': '#D1D5DB',  // Dividers
'gray-400': '#9CA3AF',  // Disabled text
'gray-800': '#1F2937',  // Very dark text
```

**Orange/Cyan/Emerald/Pink (Gradient Accents):**
```javascript
'orange-500': '#F97316',
'cyan-500': '#06B6D4',
'emerald-500': '#10B981',
'pink-500': '#EC4899',
```

#### Opacity Modifiers

**Available Opacity Values:**
```javascript
/10  → 10% opacity   (0.1)
/20  → 20% opacity   (0.2)
/30  → 30% opacity   (0.3)
/40  → 40% opacity   (0.4)
/50  → 50% opacity   (0.5)
/60  → 60% opacity   (0.6)
/70  → 70% opacity   (0.7)
/80  → 80% opacity   (0.8)
/90  → 90% opacity   (0.9)
/95  → 95% opacity   (0.95)
```

**Common Usage:**
- Glassmorphism: `/30`, `/40`, `/60`, `/70`
- Borders: `/10`, `/20`
- Backgrounds: `/90`, `/95`
- Icon backgrounds: `/20` (light tint)

#### Special Effect Colors

**Custom Scrollbar:**
**Location:** `src/styles/index.css`

```css
::-webkit-scrollbar-thumb {
  background: #4169E1;         /* Brand blue */
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2C3142;         /* Dark blue-gray */
}

::-webkit-scrollbar-track {
  background: rgb(237, 241, 255); /* Page background */
}
```

**Neural Network Canvas (LoginPage):**
```javascript
// Particle colors
startColor: 'rgba(0, 153, 255, 0.8)',  // Blue @ 80%
endColor: 'rgba(0, 212, 255, 0.2)',    // Cyan @ 20%

// Line colors (connecting particles)
strokeStyle: 'rgba(0, 153, 255, 0.2)', // Blue @ 20%
```

#### Box Shadows
**Location:** `tailwind.config.js`

```javascript
boxShadow: {
  'glassy': '0 8px 32px rgba(0, 0, 0, 0.1)',
  'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
  'card-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
}
```

**Usage:**
- `shadow-glassy`: Glassmorphism cards
- `shadow-card`: Default card shadow
- `hover:shadow-card-hover`: Card hover state

#### Color Usage Statistics

**Most Used Colors:**
1. **#4169E1** (brand-blue) - Used 100+ times
2. **White variants** (rgba white) - Used 80+ times
3. **#3D4457** (text-primary) - Used 50+ times
4. **#5C6378** (text-secondary) - Used 40+ times
5. **Green/Red** (semantic) - Used 30+ times

---

## Typography

### 🔤 Font Families

#### Font Configuration
**Location:** `index.html`

```html
<!-- Google Fonts Import -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Location:** `tailwind.config.js`

```javascript
fontFamily: {
  'nevera': ['Nevera', 'sans-serif'],  // Reserved (not actively used)
  'cinzel': ['Cinzel', 'serif'],       // Headlines
}
```

**Location:** `src/styles/index.css`

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

#### Font Families Breakdown

##### 1. Cinzel (Serif)
**Usage:** Headlines, titles, section headings

**Weights Available:**
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-bold)
- 700 (Bold)

**Character:**
- Elegant, classical serif
- Inspired by first-century Roman inscriptions
- Conveys authority, sophistication, premium quality

**Applied To:**
```jsx
// Class name
className="font-cinzel"

// Examples
<h1 className="font-cinzel text-5xl font-bold">
  STAY INFORMED WITH AI NEWS
</h1>

<h2 className="font-cinzel text-4xl font-normal">
  Daily Market Intelligence
</h2>
```

##### 2. Inter (Sans-serif)
**Usage:** Body text, buttons, navigation, forms, UI elements

**Weights Available:**
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-bold)
- 700 (Bold)

**Character:**
- Modern, neutral sans-serif
- Optimized for screens and UI
- Excellent readability
- Professional, clean appearance

**Applied To:**
- All body text (default)
- Paragraphs
- Buttons
- Navigation links
- Form labels and inputs
- Descriptions

##### 3. Fauna One (Specialty)
**Usage:** Occasional subheadings in hero sections

**Applied To:**
```jsx
<p className="text-xl text-text-secondary leading-relaxed font-[Fauna One]">
  Your daily dose of curated news and market insights
</p>
```

**Character:**
- Serif font for typographic variety
- Used sparingly for visual interest

---

### 📏 Font Size Scale

#### Heading Scale (Tailwind Classes)

```javascript
// Responsive Typography Pattern
className="text-[mobile] md:text-[tablet] lg:text-[desktop]"
```

**Scale Table:**

| Class | Size (px) | Size (rem) | Usage |
|-------|-----------|------------|-------|
| `text-xs` | 12px | 0.75rem | Timestamps, tiny labels |
| `text-sm` | 14px | 0.875rem | Secondary info, metadata |
| `text-base` | 16px | 1rem | Default body text |
| `text-lg` | 18px | 1.125rem | Emphasized body text |
| `text-xl` | 20px | 1.25rem | Subheadings, large body |
| `text-2xl` | 24px | 1.5rem | Small headings |
| `text-3xl` | 30px | 1.875rem | Medium headings (mobile) |
| `text-4xl` | 36px | 2.25rem | Large headings (tablet) |
| `text-5xl` | 48px | 3rem | Hero headings (desktop) |
| `text-6xl` | 60px | 3.75rem | Extra large hero text |
| `text-[56px]` | 56px | 3.5rem | Custom hero size |
| `text-[80px]` | 80px | 5rem | Massive display text |
| `text-[120px]` | 120px | 7.5rem | Extra massive |
| `text-[180px]` | 180px | 11.25rem | Mega display |
| `text-[280px]` | 280px | 17.5rem | Ultra display (NEWS AI) |

#### Responsive Typography Examples

**Hero Headline:**
```jsx
<h1 className="font-cinzel text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight">
  STAY INFORMED WITH REAL-TIME, AI-CURATED NEWS
</h1>
```
- Mobile: 30px
- Tablet: 48px
- Desktop: 56px

**Section Heading:**
```jsx
<h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark leading-tight">
  Features That Set Us Apart
</h2>
```
- Mobile: 30px
- Tablet: 36px
- Desktop: 48px

**Card Title:**
```jsx
<h3 className="text-xl font-bold text-text-dark mb-3">
  Real-Time Market Insights
</h3>
```
- All screens: 20px

**Body Text:**
```jsx
<p className="text-base md:text-lg text-text-secondary leading-relaxed">
  Get comprehensive analysis and insights delivered to your dashboard every morning.
</p>
```
- Mobile: 16px
- Tablet+: 18px

---

### ⚖️ Font Weights

#### Weight Usage Patterns

**Font Weight Table:**

| Class | Value | Cinzel Usage | Inter Usage |
|-------|-------|--------------|-------------|
| `font-normal` | 400 | Headlines (elegant restraint) | Body text default |
| `font-medium` | 500 | Rarely used | Emphasized text, labels |
| `font-semibold` | 600 | Rarely used | Buttons, strong emphasis |
| `font-bold` | 700 | Strong headlines | Major CTAs, important text |

#### Typography Weight Patterns

**Cinzel Headlines:**
```jsx
// Elegant, light headlines
<h1 className="font-cinzel font-normal text-5xl">
  Elegant Headline
</h1>

// Strong, bold headlines
<h1 className="font-cinzel font-bold text-5xl">
  Strong Headline
</h1>

// Note: Cinzel rarely uses font-medium or font-semibold
// The font looks best at normal (400) or bold (700)
```

**Inter Body Text:**
```jsx
// Default body text
<p className="text-base">
  Regular paragraph text
</p>

// Emphasized body text
<p className="text-base font-medium">
  Slightly emphasized text
</p>

// Strong emphasis
<p className="text-base font-semibold">
  Important information
</p>
```

**Buttons:**
```jsx
// Always font-semibold
<button className="font-semibold text-base">
  Click Here
</button>
```

**Navigation Links:**
```jsx
// Always font-medium
<a className="font-medium text-[15px]">
  Menu Item
</a>
```

---

### 📐 Line Heights

#### Line Height Scale

```javascript
leading-none      /* line-height: 1 */
leading-tight     /* line-height: 1.25 */
leading-snug      /* line-height: 1.375 */
leading-normal    /* line-height: 1.5 */
leading-relaxed   /* line-height: 1.625 */
leading-loose     /* line-height: 2 */
```

#### Usage Patterns

**Headlines:**
```jsx
// Tight for impact
<h1 className="text-5xl leading-tight">
  Powerful Headline
</h1>

// None for ultra-tight display text
<div className="text-[280px] leading-none">
  NEWS
</div>
```

**Body Text:**
```jsx
// Relaxed for readability (most common)
<p className="text-base leading-relaxed">
  This is a comfortable paragraph with good readability. The relaxed line height provides enough space between lines for easy reading.
</p>
```

**Card Descriptions:**
```jsx
// Snug for compact content
<p className="text-sm leading-snug">
  Compact description text
</p>
```

**Line Height by Context:**

| Context | Leading Class | Ratio | Purpose |
|---------|---------------|-------|---------|
| Display Text | `leading-none` | 1.0 | Maximum impact |
| Headlines | `leading-tight` | 1.25 | Strong presence |
| Card Titles | `leading-snug` | 1.375 | Compact headers |
| Body Paragraphs | `leading-relaxed` | 1.625 | Best readability |
| Loose Text | `leading-loose` | 2.0 | Extra breathing room |

---

### 📊 Typography Hierarchy

#### Level 1: Hero Headlines
**Purpose:** Main page headlines, primary CTAs

```jsx
<h1 className="font-cinzel text-3xl md:text-5xl lg:text-[56px] font-normal md:font-bold text-text-primary leading-tight">
  STAY INFORMED WITH REAL-TIME, AI-CURATED NEWS
</h1>
```

**Specifications:**
- Font: Cinzel
- Size: 30px → 48px → 56px (responsive)
- Weight: 400 (mobile) → 700 (desktop)
- Color: `text-primary` (#3D4457)
- Line height: Tight (1.25)
- Use: Page heroes, main value propositions

---

#### Level 2: Section Headlines
**Purpose:** Major section titles

```jsx
<h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark leading-tight">
  The AI-Powered Intelligence Platform
</h2>
```

**Specifications:**
- Font: Cinzel
- Size: 30px → 36px → 48px
- Weight: 700 (bold)
- Color: `text-dark` (#2C3142) or `text-brand-blue` (#4169E1)
- Line height: Tight (1.25)
- Use: Section intros, major divisions

---

#### Level 3: Subsection Headlines / Card Titles
**Purpose:** Component headers, feature titles

```jsx
<h3 className="font-cinzel text-xl md:text-2xl font-bold text-text-dark mb-4">
  Real-Time Market Insights
</h3>
```

**Specifications:**
- Font: Cinzel or Inter
- Size: 20px → 24px
- Weight: 600-700 (semibold to bold)
- Color: `text-dark` or `text-brand-blue`
- Line height: Snug (1.375)
- Use: Card headers, feature titles, list headers

---

#### Level 4: Subheadings / Large Body
**Purpose:** Section introductions, emphasized content

```jsx
<p className="text-lg md:text-xl font-semibold text-text-secondary leading-relaxed">
  Discover how our AI-powered platform revolutionizes news consumption
</p>
```

**Specifications:**
- Font: Inter
- Size: 18px → 20px
- Weight: 500-600 (medium to semibold)
- Color: `text-secondary` (#5C6378)
- Line height: Relaxed (1.625)
- Use: Section descriptions, emphasized paragraphs

---

#### Level 5: Body Text (Standard)
**Purpose:** Main content, descriptions, paragraphs

```jsx
<p className="text-base md:text-lg text-text-secondary leading-relaxed">
  Get comprehensive analysis and market insights delivered to your dashboard every morning. Our AI curates the most relevant news from trusted sources worldwide.
</p>
```

**Specifications:**
- Font: Inter
- Size: 16px → 18px
- Weight: 400 (normal)
- Color: `text-secondary` (#5C6378)
- Line height: Relaxed (1.625)
- Use: Paragraphs, descriptions, most readable content

---

#### Level 6: Small Text / Metadata
**Purpose:** Supporting information, labels, timestamps

```jsx
<span className="text-sm text-text-secondary">
  Published 2 hours ago
</span>

<label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
  Category
</label>
```

**Specifications:**
- Font: Inter
- Size: 12-14px
- Weight: 400-500 (normal to medium)
- Color: `text-secondary`
- Use: Timestamps, labels, metadata, fine print

---

### 🎨 Text Styling Patterns

#### Special Effects

##### 1. Gradient Text
**Usage:** Emphasis, brand moments, "NEWS AI" display

```css
.text-gradient {
  background: linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Example:**
```jsx
<h1
  className="text-[280px] font-bold leading-none"
  style={{
    background: 'linear-gradient(135deg, #4169E1 0%, #5B8DEF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}
>
  NEWS AI
</h1>
```

##### 2. Uppercase Text
**Usage:** Badges, labels, emphasis

```jsx
// Badge class (automatic uppercase)
<span className="badge px-3 py-1 rounded-full bg-badge-bg text-badge-text text-xs uppercase tracking-wider">
  BETA
</span>

// Manual uppercase
<span className="uppercase tracking-wide text-sm font-medium">
  Featured
</span>
```

##### 3. Letter Spacing (Tracking)

```javascript
tracking-tighter  /* -0.05em */
tracking-tight    /* -0.025em */
tracking-normal   /* 0 */
tracking-wide     /* 0.025em */  // Logo
tracking-wider    /* 0.05em */   // Badges, labels
tracking-widest   /* 0.1em */
```

**Examples:**
```jsx
// Logo
<span className="font-bold text-xl tracking-wide">NEWS AI</span>

// Badge
<span className="text-xs uppercase tracking-wider">BETA</span>

// Tight headline
<h1 className="text-6xl tracking-tight">Headline</h1>
```

##### 4. Text Truncation
**Usage:** Card content, preview text

```jsx
// Single line ellipsis
<p className="truncate">
  Very long text that will be cut off with ellipsis...
</p>

// Multi-line ellipsis (2 lines)
<p className="line-clamp-2">
  This text will show up to two lines and then add an ellipsis if it's longer than that space allows.
</p>

// Multi-line ellipsis (3 lines)
<p className="line-clamp-3">
  This text allows three lines before truncating.
</p>
```

---

### 🎯 Typography by Component Type

#### Buttons

```jsx
// Primary Button
<button className="px-6 py-3 bg-brand-blue text-white font-semibold text-base rounded-lg">
  Get Started Free
</button>

// Secondary Button
<button className="px-6 py-3 border-2 border-brand-blue text-brand-blue font-semibold text-base rounded-lg">
  Learn More
</button>

// Large Button
<button className="px-8 py-4 bg-button-dark text-white font-semibold text-lg rounded-xl">
  Start Your Journey
</button>
```

**Button Typography Rules:**
- Always `font-semibold`
- Size: `text-sm` to `text-lg`
- No uppercase (sentence case)
- Color: White (primary) or brand-blue (secondary)

---

#### Navigation

```jsx
// Desktop Nav Links
<a className="text-[15px] font-medium text-text-secondary hover:text-brand-blue transition-colors">
  Home
</a>

// Mobile Nav Links
<a className="text-lg font-medium text-text-secondary">
  Home
</a>

// Logo
<span className="font-bold text-xl md:text-2xl tracking-wide text-brand-blue">
  NEWS AI
</span>
```

---

#### Forms

```jsx
// Label
<label className="block text-sm font-medium text-text-dark mb-2">
  Email Address
</label>

// Input
<input
  type="email"
  placeholder="Enter your email"
  className="w-full px-4 py-3 text-base"
/>

// Helper Text
<p className="text-xs text-text-secondary mt-1">
  We'll never share your email
</p>

// Error Message
<p className="text-sm text-red-600 mt-1">
  Please enter a valid email address
</p>
```

---

#### Cards

```jsx
<div className="card-news">
  {/* Badge */}
  <span className="badge text-xs uppercase tracking-wider">
    Technology
  </span>

  {/* Title */}
  <h3 className="text-xl font-bold text-text-dark mb-3 line-clamp-2">
    AI Revolution in Finance: What You Need to Know
  </h3>

  {/* Description */}
  <p className="text-base text-text-secondary leading-relaxed line-clamp-3 mb-4">
    Discover how artificial intelligence is transforming the financial sector with unprecedented speed and accuracy.
  </p>

  {/* Metadata */}
  <div className="flex items-center gap-4 text-sm text-text-secondary">
    <span>2 hours ago</span>
    <span>•</span>
    <span>5 min read</span>
  </div>
</div>
```

---

## Key Files Reference

### 📁 Configuration Files

#### 1. Tailwind Configuration
**File:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\tailwind.config.js`

**Contents:**
- Custom color tokens
- Font family configurations
- Gradient definitions
- Box shadow definitions
- Extended Tailwind theme

#### 2. PostCSS Configuration
**File:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\postcss.config.js`

**Contents:**
- Tailwind CSS plugin
- Autoprefixer configuration

#### 3. Global Styles
**File:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\src\styles\index.css`

**Contents:**
- Custom CSS utilities
- Component classes (.card-news, .badge, etc.)
- Scrollbar styling
- Body defaults

#### 4. HTML Entry Point
**File:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\index.html`

**Contents:**
- Google Fonts imports
- Meta tags
- Root element

---

### 📦 Component Files

**Base Path:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\src\components\`

#### Layout Components
1. `Navbar.jsx` - Navigation header
2. `Footer.jsx` - Site footer

#### Landing Page Components
3. `HeroV1.jsx` - Hero section
4. `SocialProof.jsx` - Statistics display
5. `ProblemSolution.jsx` - Problem/solution comparison
6. `FeatureSection.jsx` - Features showcase
7. `DailyBrief.jsx` - Daily insights
8. `LatestNews.jsx` - News grid
9. `PersonalizationSection.jsx` - How it works
10. `UseCases.jsx` - Target audiences
11. `ProductPreview.jsx` - Dashboard mockup
12. `StockSection.jsx` - Market features
13. `Pricing.jsx` - Pricing card
14. `FAQ.jsx` - FAQ accordion
15. `FinalCTA.jsx` - Final call-to-action

---

### 📄 Page Files

**Base Path:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\src\pages\`

1. `HomePage.jsx` - Landing page composition
2. `LoginPage.jsx` - Authentication page with neural network animation
3. `AboutPage.jsx` - About the platform
4. `TrendingPage.jsx` - Trending news (auth)
5. `CategoriesPage.jsx` - News categories (auth)
6. `SummariesPage.jsx` - News summaries (auth)
7. `UserProfilePage.jsx` - User profile (auth)

---

### 🎨 Design Assets

**Location:** `c:\Users\A S P I R E 7\OneDrive\Desktop\Newsai\newsai\src\assets\`

- Globe images
- Logo files
- Mockup images
- Icons (via React Icons library)

---

## Summary

### Design System Characteristics

**Overall Style:**
- Modern, clean, tech-forward aesthetic
- Glassmorphism design language
- Premium, professional feel
- AI/technology-focused branding

**Color Mood:**
- Professional blue palette (#4169E1 Royal Blue primary)
- High-tech, trustworthy feel
- Light, airy backgrounds
- Clear semantic color coding

**Typography Personality:**
- Elegant headlines (Cinzel serif)
- Modern, readable body text (Inter sans-serif)
- Clear hierarchy with 6 levels
- Responsive scaling for all devices

**Interaction Style:**
- Smooth, polished animations (300-700ms)
- Subtle hover effects (lift, scale, color change)
- Glassmorphism depth effects
- Professional micro-interactions

**Layout Philosophy:**
- Mobile-first responsive design
- Generous whitespace and breathing room
- Clear visual hierarchy
- Grid-based, structured layouts
- Consistent spacing scale

---

### Quick Reference

**Brand Color:** #4169E1 (Royal Blue)
**Primary Font:** Inter (body) + Cinzel (headlines)
**Design Style:** Glassmorphism, modern, clean
**Responsive:** Mobile-first with Tailwind breakpoints
**Animation:** 300ms standard, smooth transitions
**Components:** 25+ reusable React components
**Pages:** 7 total (1 public landing, 6 internal)

---

**Documentation Generated:** 2025-11-24
**Project:** NEWS AI - AI-Powered News Intelligence Platform
**Framework:** React 19.2.0 + Tailwind CSS 3.4.1 + Vite 7.2.2