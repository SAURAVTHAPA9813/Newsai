// Mock Dashboard API Service
// Provides all mock data for the NewsAI Control Center

// =============================================================================
// MOCK DATA - ARTICLES
// =============================================================================

const mockArticles = [
  {
    id: 1,
    title: "Federal Reserve Announces Unexpected Rate Decision Amid Economic Uncertainty",
    summary: {
      '5m': "Fed keeps rates unchanged at 5.25-5.5%, surprising markets.",
      '15m': "The Federal Reserve announced today that interest rates will remain unchanged at 5.25-5.5% despite market expectations of a cut. Chair Powell cited ongoing inflation concerns and robust employment data. Stock markets initially dropped 2% on the news before recovering. Economists are divided on whether this signals confidence in the economy or caution about persistent inflation. The decision impacts mortgage rates, business loans, and consumer spending patterns.",
      '30m': "In a highly anticipated decision, the Federal Reserve's Open Market Committee voted unanimously to maintain the federal funds rate at 5.25-5.5%, defying widespread market expectations of a 25 basis point reduction. Federal Reserve Chair Jerome Powell, speaking at the post-meeting press conference, emphasized that while inflation has moderated from its 2022 peaks, it remains above the Fed's 2% target. Key economic indicators including the robust jobs report showing 250,000 new positions added last month, persistent wage growth at 4.5% year-over-year, and resilient consumer spending suggest the economy can withstand higher rates for an extended period. The decision triggered immediate market volatility, with the S&P 500 initially dropping 2.3% before recovering most losses by close. Bond yields jumped, with the 10-year Treasury rising to 4.6%. Mortgage rates are expected to remain elevated, potentially cooling the housing market further. Business leaders expressed mixed reactions, with some praising the prudent approach while others worry about continued high borrowing costs impacting expansion plans. Internationally, the strong dollar policy resulting from higher US rates is creating challenges for emerging markets and multinational corporations."
    },
    sourceScore: 92,
    verificationBadge: 'VERIFIED',
    impactTags: ['money', 'career'],
    anxietyScore: 45,
    category: 'Economics',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    publishedAt: '2h ago',
    readTime: '5 min',
    source: { name: 'Reuters', id: 'reuters' },
    author: 'Sarah Johnson',
    trending: true,
    featured: true
  },
  {
    id: 2,
    title: "Breakthrough AI System Diagnoses Rare Diseases with 95% Accuracy",
    summary: {
      '5m': "New AI achieves 95% accuracy in diagnosing rare diseases, outperforming human doctors.",
      '15m': "Researchers at Stanford University unveiled an AI system capable of diagnosing rare diseases with 95% accuracy, significantly outperforming current methods. The system analyzes genetic data, medical history, and symptoms simultaneously. It's already identified conditions in 50 previously undiagnosed patients. Medical experts call it a game-changer for the 300 million people worldwide living with rare diseases. The technology will be deployed in 10 major hospitals starting next quarter.",
      '30m': "A groundbreaking artificial intelligence system developed by researchers at Stanford University School of Medicine has achieved a remarkable 95% accuracy rate in diagnosing rare diseases, marking a significant breakthrough in medical diagnostics. The AI, which utilizes advanced deep learning algorithms and processes over 10,000 rare disease profiles, integrates patient genetic sequencing data, comprehensive medical histories, symptom patterns, and medical imaging to provide rapid diagnostic insights. In clinical trials involving 1,000 patients with suspected rare conditions, the AI correctly identified diseases in cases that had stumped multiple specialists for years. Approximately 300 million people globally suffer from rare diseases, with the average diagnosis taking 5-7 years. This AI system reduces that timeline to days in many cases. The technology successfully diagnosed 50 previously undiagnosed patients during beta testing. Dr. Maria Chen, lead researcher, explains that the system doesn't replace doctors but augments their capabilities, especially in resource-limited settings. The AI will be deployed in 10 major medical centers starting Q2, with plans for global expansion. Insurance companies are already negotiating coverage terms. Privacy advocates emphasize the need for robust data protection as genetic information becomes increasingly digitized."
    },
    sourceScore: 88,
    verificationBadge: 'VERIFIED',
    impactTags: ['health'],
    anxietyScore: 20,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    publishedAt: '4h ago',
    readTime: '6 min',
    source: { name: 'Nature Medicine', id: 'nature' },
    author: 'Dr. Robert Kim'
  },
  {
    id: 3,
    title: "Major Earthquake Strikes Pacific Region, Tsunami Warnings Issued",
    summary: {
      '5m': "7.8 magnitude earthquake hits Pacific coast, tsunami warnings active for multiple countries.",
      '15m': "A powerful 7.8 magnitude earthquake struck off the coast of Japan early this morning, triggering tsunami warnings across the Pacific. The quake, centered 30 miles offshore, was felt in Tokyo and other major cities. Preliminary reports indicate moderate damage to coastal infrastructure. Evacuation orders are in effect for low-lying areas in Japan, Philippines, and parts of California. No fatalities reported yet, but rescue operations are ongoing. The Pacific Tsunami Warning Center is monitoring wave activity.",
      '30m': "A devastating 7.8 magnitude earthquake struck the Pacific Ocean approximately 30 miles off the eastern coast of Japan at 3:45 AM local time, triggering widespread tsunami warnings and emergency evacuations across multiple Pacific Rim nations. The United States Geological Survey reports the quake originated at a depth of 15 kilometers, with the epicenter located near a major tectonic plate boundary. Seismic monitoring stations recorded over 50 aftershocks, with the largest measuring 6.2 magnitude. In Japan, the earthquake was strongly felt in Tokyo, Osaka, and Yokohama, causing temporary power outages affecting 2 million residents and halting train services. Coastal cities including Sendai and Fukushima have initiated full evacuations of low-lying areas, with over 500,000 people relocated to higher ground and designated shelters. Early damage assessments reveal structural damage to buildings in coastal regions, collapsed sections of highways, and disruption to the Port of Tokyo operations. The Pacific Tsunami Warning Center issued alerts for Japan, Philippines, Taiwan, eastern Russia, and parts of the US West Coast including California, Oregon, and Alaska. Wave heights of up to 3 meters have been recorded in some coastal areas. Emergency response teams are conducting search and rescue operations in affected regions. While no fatalities have been confirmed at this time, dozens of injuries have been reported. This earthquake is reminiscent of the 2011 Tōhoku disaster, though early indicators suggest less severe impact. International aid organizations and neighboring countries have offered assistance."
    },
    sourceScore: 95,
    verificationBadge: 'VERIFIED',
    impactTags: ['location', 'health'],
    anxietyScore: 85,
    category: 'World',
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80',
    publishedAt: '1h ago',
    readTime: '4 min',
    source: { name: 'Associated Press', id: 'ap' },
    author: 'International Desk',
    trending: true
  },
  {
    id: 4,
    title: "Tech Giants Announce Historic Merger in $150 Billion Deal",
    summary: {
      '5m': "Major tech companies merge in $150B deal, creating world's 3rd largest corporation.",
      '15m': "In a historic announcement, two tech giants have agreed to merge in an all-stock deal valued at $150 billion. The merger will create the world's third-largest technology company by market capitalization. Executives claim the combination will accelerate innovation in AI, cloud computing, and quantum research. However, the deal faces regulatory scrutiny from the FTC and European Commission. Analysts are divided on antitrust implications. The merger is expected to close by end of year pending approval.",
      '30m': "In one of the largest corporate transactions in history, two technology titans announced a definitive merger agreement valued at approximately $150 billion in an all-stock transaction that will reshape the global technology landscape. The newly formed entity will become the world's third-largest corporation by market capitalization, trailing only Apple and Microsoft. The strategic combination brings together complementary strengths: one company's dominance in cloud infrastructure and enterprise software with the other's leadership in consumer devices and artificial intelligence research. Combined revenues will exceed $280 billion annually, with operations spanning 180 countries and employing over 350,000 people globally. Company executives, speaking at a joint press conference, emphasized that the merger will accelerate innovation in critical technology areas including artificial intelligence, quantum computing, autonomous systems, and next-generation connectivity. They project $15 billion in annual cost synergies within three years through elimination of redundant operations and consolidated research initiatives. The announcement triggered significant market movement, with shares of both companies surging over 12% in pre-market trading. However, the path to completion faces substantial hurdles. The Federal Trade Commission and European Commission have already announced intensive antitrust reviews, citing concerns about market concentration and potential anti-competitive effects. Senator Elizabeth Warren called for blocking the deal, stating it represents dangerous consolidation in the tech sector. Legal experts predict a lengthy approval process potentially extending 18-24 months. Industry analysts are sharply divided, with some praising the potential for accelerated innovation while others warn of reduced competition and consumer choice. Smaller competitors have expressed alarm about the merger's impact on market dynamics. If approved, the integration process will be among the most complex in corporate history."
    },
    sourceScore: 90,
    verificationBadge: 'VERIFIED',
    impactTags: ['money', 'career'],
    anxietyScore: 35,
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    publishedAt: '3h ago',
    readTime: '7 min',
    source: { name: 'Bloomberg', id: 'bloomberg' },
    author: 'Michael Torres'
  },
  {
    id: 5,
    title: "Revolutionary Battery Technology Could Triple Electric Vehicle Range",
    summary: {
      '5m': "New solid-state battery triples EV range to 1,000+ miles per charge.",
      '15m': "Scientists announce breakthrough in solid-state battery technology that could enable electric vehicles to travel over 1,000 miles on a single charge. The new batteries use advanced ceramic electrolytes that are safer, faster-charging, and more energy-dense than current lithium-ion batteries. Major automakers are already negotiating licensing deals. Commercial production could begin within 3 years. The development may finally make EVs competitive with gas vehicles in range and convenience.",
      '30m': "In a development that could revolutionize the electric vehicle industry and accelerate the global transition away from fossil fuels, researchers at the Massachusetts Institute of Technology have unveiled a solid-state battery technology that demonstrates the potential to triple the range of current electric vehicles, enabling travel distances exceeding 1,000 miles on a single charge. The breakthrough centers on a novel ceramic electrolyte material that replaces the liquid electrolyte found in conventional lithium-ion batteries, dramatically improving energy density while simultaneously enhancing safety by eliminating fire risks associated with liquid electrolytes. Laboratory testing has shown these batteries can be charged to 80% capacity in just 15 minutes, addressing two of the primary consumer concerns about EV adoption: range anxiety and charging time. The solid-state design also demonstrates remarkable longevity, maintaining over 90% capacity after 5,000 charge cycles, equivalent to approximately 15 years of typical use. This far exceeds current battery warranties. The research team, led by Dr. Jennifer Liu, has filed 23 patents covering various aspects of the technology. Multiple automotive manufacturers including Tesla, Toyota, Ford, and Volkswagen have reportedly initiated discussions regarding licensing agreements and joint development partnerships. Industry analysts project that if commercialization proceeds as planned, with production beginning in 2027, the technology could reduce EV battery costs by 40% while improving performance, finally achieving true cost parity with internal combustion vehicles. The environmental implications are significant, as the batteries use more abundant materials and are fully recyclable. Energy sector experts suggest this breakthrough could accelerate the timeline for achieving net-zero emissions targets. However, scaling production remains a substantial challenge, requiring entirely new manufacturing processes and facilities representing billions in capital investment."
    },
    sourceScore: 85,
    verificationBadge: 'LIKELY_TRUE',
    impactTags: ['money'],
    anxietyScore: 15,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    publishedAt: '5h ago',
    readTime: '6 min',
    source: { name: 'MIT Technology Review', id: 'mit-tech' },
    author: 'Dr. Alan Foster'
  },
  {
    id: 6,
    title: "Controversial Social Media Bill Passes Congress, Tech Industry Responds",
    summary: {
      '5m': "Congress passes social media regulation bill despite tech industry opposition.",
      '15m': "The House and Senate have passed the Digital Platform Accountability Act, imposing new regulations on social media companies. The bill requires platforms to verify user identities, moderate harmful content more aggressively, and provide transparency in algorithm operations. Tech companies call it unconstitutional censorship, while advocates say it protects users. The President is expected to sign it into law. Legal challenges are anticipated. Implementation would begin in 90 days.",
      '30m': "In a contentious 218-212 vote, the United States House of Representatives joined the Senate in passing the Digital Platform Accountability Act, landmark legislation that imposes sweeping new regulatory requirements on social media platforms with over 10 million users. The bipartisan bill, which garnered support from both progressive Democrats concerned about misinformation and conservative Republicans focused on alleged anti-conservative bias, represents the most significant government intervention in social media operations since these platforms emerged. Key provisions include mandatory identity verification for users, enhanced content moderation requirements targeting hate speech and misinformation, algorithmic transparency mandates requiring platforms to disclose how content is ranked and promoted, and the establishment of a new regulatory agency empowered to levy fines up to 5% of global revenue for violations. Proponents, led by Senator Amy Klobuchar and Senator Josh Hawley, argue the legislation is essential to protect users from harassment, prevent the spread of dangerous misinformation, and reduce the platforms' negative impacts on mental health, particularly among teenagers. Major technology companies including Meta, Twitter (X), and TikTok issued strongly worded statements condemning the legislation as an unconstitutional infringement on free speech and warning of devastating impacts on innovation and user privacy. Civil liberties organizations are divided, with the ACLU expressing concerns about government overreach while other advocacy groups praise the user protections. Legal experts universally predict immediate constitutional challenges based on First Amendment grounds, likely resulting in years of litigation before implementation. If enacted, platforms would have 90 days to begin compliance, requiring substantial operational changes and likely billions in compliance costs. International implications are also significant, as the law's extraterritorial reach affects foreign companies operating in the US market. Tech stocks fell sharply following the vote, with Meta dropping 8% and Alphabet declining 6%."
    },
    sourceScore: 75,
    verificationBadge: 'LIKELY_TRUE',
    impactTags: ['money', 'career'],
    anxietyScore: 60,
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    publishedAt: '6h ago',
    readTime: '8 min',
    source: { name: 'The Hill', id: 'the-hill' },
    author: 'Political Reporter'
  },
  {
    id: 7,
    title: "Climate Study Reveals Accelerated Ice Melt in Greenland and Antarctica",
    summary: {
      '5m': "New study shows ice sheets melting 50% faster than predicted, sea levels rising.",
      '15m': "A comprehensive climate study published in Science reveals that Greenland and Antarctic ice sheets are melting 50% faster than previous models predicted. Satellite data shows unprecedented rates of ice loss over the past 5 years. Scientists warn of accelerated sea level rise, potentially reaching 2 feet by 2050 instead of previous 1-foot estimates. Coastal cities worldwide face increased flood risks. The findings add urgency to climate action calls ahead of COP30 summit.",
      '30m': "A landmark climate study published today in the journal Science presents alarming new evidence that the Greenland and Antarctic ice sheets are losing mass at rates approximately 50% higher than predictions made just five years ago, substantially accelerating the timeline for dangerous sea level rise and forcing a major revision of climate impact projections. The comprehensive research, conducted by an international team of 89 scientists from 50 institutions across 15 countries, synthesized data from multiple satellite missions, ground measurements, and advanced climate models covering the period from 2015 to 2024. The study reveals that Greenland is losing approximately 280 billion tons of ice annually, while Antarctica is shedding 150 billion tons per year, combined contributing over 1 millimeter of global sea level rise annually. Most concerning is the acceleration trend: ice loss rates have increased 30% since 2015, and sophisticated modeling suggests this acceleration will continue. The research identifies several compounding factors driving faster-than-expected melt: warmer ocean currents undermining ice shelves from below, darker ice surfaces absorbing more solar radiation due to reduced snow cover, and the formation of melt pools that further accelerate melting through feedback loops. Lead author Dr. Emma Williams from the University of Copenhagen stated the findings necessitate urgent revision of sea level rise projections, with new models suggesting 2 feet of rise by 2050 rather than the previously estimated 1 foot. This revision has profound implications for coastal infrastructure planning, with cities like Miami, New York, Shanghai, and Mumbai facing significantly increased flood risks within the next 25 years. The economic implications are staggering, with estimated costs of coastal adaptation and relocation potentially exceeding $2 trillion globally. Environmental organizations are leveraging the findings to demand more aggressive climate action at the upcoming COP30 summit, while some skeptics question the modeling accuracy. However, the scientific consensus supports the study's validity. Insurance companies are already adjusting coastal property premiums, and several nations have announced accelerated coastal defense projects."
    },
    sourceScore: 93,
    verificationBadge: 'VERIFIED',
    impactTags: ['location', 'health'],
    anxietyScore: 75,
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
    publishedAt: '7h ago',
    readTime: '7 min',
    source: { name: 'Science Journal', id: 'science' },
    author: 'Climate Research Team'
  },
  {
    id: 8,
    title: "Pharmaceutical Company Announces Major Price Cuts on Life-Saving Drugs",
    summary: {
      '5m': "Major pharma company slashes prices on 50 essential medications by up to 70%.",
      '15m': "In an unprecedented move, pharmaceutical giant MedPharm International announced it will reduce prices on 50 essential medications by up to 70%, effective immediately. The price cuts include insulin, cancer treatments, and heart medications. CEO attributes decision to new manufacturing efficiencies and public pressure. Patient advocacy groups celebrate the move while questioning why it took so long. Competitors face pressure to follow suit. The decision could save patients billions annually.",
      '30m': "In a stunning reversal of industry norms and a potential watershed moment for healthcare affordability, MedPharm International, the world's fourth-largest pharmaceutical manufacturer, announced today a comprehensive restructuring of its drug pricing strategy that will reduce costs on 50 essential medications by between 40% and 70%, effective within 30 days. The unprecedented decision affects widely used treatments across multiple therapeutic categories including diabetes management (insulin products), oncology (cancer chemotherapies), cardiovascular disease (cholesterol and blood pressure medications), and autoimmune disorders. For context, the company's most prescribed insulin product, currently priced at $340 per vial, will drop to $98, while a critical cancer immunotherapy costing $12,000 per month will decrease to $4,500. Company CEO Dr. Richard Martinez, speaking at a press conference, attributed the decision to breakthroughs in manufacturing efficiency, particularly in biologics production, combined with a corporate values assessment prompted by sustained public pressure regarding drug affordability. Martinez acknowledged that pharmaceutical pricing has been a significant burden on patients and healthcare systems, with recent surveys indicating that one in four Americans has foregone prescribed medications due to cost concerns. The announcement triggered immediate reactions across the healthcare sector. Patient advocacy organizations celebrated the move as long overdue, with the American Diabetes Association calling it a life-saving decision for millions of insulin-dependent patients. However, critics questioned why such reductions are only now being implemented if manufacturing improvements make them feasible, suggesting previous pricing was exploitative. Wall Street analysts initially reacted negatively, with MedPharm shares dropping 11% on concerns about reduced profit margins, though they partially recovered after the company projected that increased volume and improved public perception would offset revenue impacts. The competitive implications are significant, as rival pharmaceutical companies now face intense pressure from consumers, healthcare providers, and legislators to implement similar price reductions or justify their pricing structures. Several members of Congress who have championed drug pricing reform praised the decision while emphasizing it demonstrates the need for regulatory intervention to ensure affordability across the industry."
    },
    sourceScore: 87,
    verificationBadge: 'VERIFIED',
    impactTags: ['health', 'money'],
    anxietyScore: 25,
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    publishedAt: '8h ago',
    readTime: '6 min',
    source: { name: 'Healthcare Weekly', id: 'healthcare' },
    author: 'Medical Correspondent'
  }
];

// =============================================================================
// LIVE INTELLIGENCE BRIEFING
// =============================================================================

export const getLiveIntelligenceBriefing = (userProfile = {}) => {
  const { industry = 'Software Engineering', region = 'United States' } = userProfile;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        timestamp: new Date().toISOString(),
        userProfile: {
          industry,
          region
        },
        globalSituation: "Markets show strong volatility amid Federal Reserve's unexpected rate hold decision. Technology sector leads gains with AI breakthrough in healthcare diagnostics. Pacific region faces natural disaster response following major earthquake. Global climate concerns intensify with new ice melt data.",
        globalDelta: "In the past 24 hours: Fed maintains rates at 5.25-5.5% (markets expected cut), Stanford unveils 95% accurate AI disease diagnosis system, 7.8 magnitude earthquake strikes Pacific with tsunami warnings, and $150B tech merger announced pending regulatory approval.",
        impactOnYou: {
          industry,
          region,
          summary: industry === 'Software Engineering'
            ? "The tech merger announcement directly impacts software engineering careers, creating both opportunities and uncertainties. AI breakthroughs in healthcare may open new job markets in medical AI. The Fed's rate decision affects tech company valuations and hiring freezes. Expect increased demand for AI/ML expertise in coming months."
            : `As a ${industry} professional in ${region}, today's developments particularly affect your sector through economic policy changes and technological disruptions. The Fed's rate decision influences business investment and consumer spending patterns relevant to your industry.`,
          keyPoints: [
            "Tech merger may create 10,000+ new positions in AI/cloud computing",
            "Healthcare AI breakthrough signals growing demand for medical software engineers",
            "Higher interest rates may slow tech startup funding and hiring",
            "Regulatory scrutiny increasing in tech sector - compliance roles expanding"
          ]
        },
        trendingTopics: [
          { name: 'Federal Reserve', mentions: 15420, change: '+245%' },
          { name: 'AI Healthcare', mentions: 8934, change: '+189%' },
          { name: 'Pacific Tsunami', mentions: 12450, change: '+312%' },
          { name: 'Tech Merger', mentions: 7621, change: '+201%' },
          { name: 'Climate Crisis', mentions: 5234, change: '+87%' }
        ]
      });
    }, 800);
  });
};

// =============================================================================
// ARTICLES BY READING MODE
// =============================================================================

export const getArticlesByMode = (mode = '15m', filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const articles = mockArticles.map(article => ({
        ...article,
        currentSummary: article.summary[mode],
        readingMode: mode
      }));

      resolve(articles);
    }, 500);
  });
};

// =============================================================================
// GLOBAL VECTORS (TOP TRENDING)
// =============================================================================

export const getGlobalVectors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'gv1',
          title: "Fed Holds Rates: Markets React",
          category: 'Economics',
          importance: 95,
          trendingScore: 98,
          updateTime: '15 minutes ago'
        },
        {
          id: 'gv2',
          title: "7.8 Earthquake: Pacific Tsunami Alert",
          category: 'World',
          importance: 98,
          trendingScore: 95,
          updateTime: '1 hour ago'
        },
        {
          id: 'gv3',
          title: "$150B Tech Merger Announced",
          category: 'Business',
          importance: 88,
          trendingScore: 92,
          updateTime: '3 hours ago'
        }
      ]);
    }, 300);
  });
};

// =============================================================================
// AI COMMAND MODULES
// =============================================================================

export const explainArticle = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        articleId,
        simplifiedVersion: "Imagine the Federal Reserve as the grown-up in charge of all the money in America. They decide how expensive it is to borrow money (like getting a loan). \n\nRight now, they're keeping it pretty expensive to borrow money - think of it like a video game where things cost a lot of coins. Everyone thought they'd make things cheaper, but they didn't. \n\nWhy? Because prices for stuff (inflation) are still going up too fast. It's like if candy bars kept getting more expensive every week. They want to slow that down first. \n\nThis affects: Your parents' mortgage, business loans, and even your savings account interest. When borrowing is expensive, people buy less stuff, which can slow down the economy - but it also helps prices stop rising so fast.",
        keyTermsExplained: [
          { term: 'Federal Reserve', explanation: 'The central bank - basically the boss of money in the US' },
          { term: 'Interest Rates', explanation: 'The cost of borrowing money, like a fee you pay' },
          { term: 'Inflation', explanation: 'When prices of things keep going up over time' },
          { term: 'Basis Points', explanation: '1/100th of a percent (25 basis points = 0.25%)' }
        ],
        analogies: [
          "Think of the Fed like a thermostat: When the economy gets too hot (inflation), they turn it down (raise rates). When it's too cold (recession), they turn it up (lower rates)."
        ]
      });
    }, 1000);
  });
};

export const getMarketImpact = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        articleId,
        overallRisk: 'MODERATE',
        riskScore: 65,
        affectedSectors: [
          { sector: 'Banking', impact: 'POSITIVE', change: '+3.2%', reason: 'Higher rates benefit bank margins' },
          { sector: 'Real Estate', impact: 'NEGATIVE', change: '-2.8%', reason: 'Higher mortgage rates reduce demand' },
          { sector: 'Technology', impact: 'NEGATIVE', change: '-1.9%', reason: 'High rates reduce growth valuations' },
          { sector: 'Utilities', impact: 'NEUTRAL', change: '+0.3%', reason: 'Defensive sector, minimal impact' }
        ],
        stocksToWatch: [
          { ticker: 'JPM', name: 'JPMorgan Chase', movement: 'UP', confidence: 85 },
          { ticker: 'BAC', name: 'Bank of America', movement: 'UP', confidence: 82 },
          { ticker: 'AAPL', name: 'Apple', movement: 'DOWN', confidence: 70 },
          { ticker: 'TSLA', name: 'Tesla', movement: 'DOWN', confidence: 75 }
        ],
        investmentRecommendations: [
          "Consider increasing allocation to financial sector stocks",
          "Be cautious with growth stocks in high-rate environment",
          "Bonds become more attractive with higher yields",
          "Real estate investment trusts (REITs) may face headwinds"
        ],
        timeHorizon: {
          short: 'Volatility expected for 1-2 weeks',
          medium: 'Adjustment period over 3-6 months',
          long: 'If rates hold, value stocks outperform growth'
        }
      });
    }, 1200);
  });
};

export const getContext = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        articleId,
        timelineEvents: [
          {
            date: '2022-03',
            event: 'Fed begins rate hikes',
            description: 'First rate increase in 4 years, starting aggressive tightening cycle to combat inflation'
          },
          {
            date: '2022-06',
            event: 'Inflation peaks at 9.1%',
            description: 'Highest inflation rate in 40 years, driven by supply chain issues and strong consumer demand'
          },
          {
            date: '2023-03',
            event: 'Banking crisis emerges',
            description: 'Silicon Valley Bank collapse raises concerns about rate hike impacts on financial stability'
          },
          {
            date: '2023-07',
            event: 'Fed reaches terminal rate',
            description: 'Rates reach 5.25-5.5%, Fed signals pause to assess economic impacts'
          },
          {
            date: '2024-01',
            event: 'Inflation moderates to 3.2%',
            description: 'Progress on inflation, but still above 2% target, markets anticipate rate cuts'
          },
          {
            date: 'TODAY',
            event: 'Fed holds rates steady',
            description: 'Surprising decision to maintain current rates despite market expectations of cuts'
          }
        ],
        keyEntities: [
          {
            name: 'Jerome Powell',
            role: 'Federal Reserve Chair',
            relevance: 'Key decision-maker on monetary policy'
          },
          {
            name: 'FOMC',
            role: 'Federal Open Market Committee',
            relevance: 'Voting body that sets interest rates'
          },
          {
            name: 'US Treasury',
            role: 'Government debt issuer',
            relevance: 'Bond yields directly affected by rate decisions'
          }
        ],
        backgroundContext: "The Federal Reserve has been navigating the most aggressive interest rate tightening cycle since the 1980s, attempting to bring inflation under control without triggering a recession. This delicate balance - often called a 'soft landing' - requires carefully timed policy adjustments. Today's decision to hold rates suggests the Fed believes inflation risks still outweigh recession concerns.",
        relatedTopics: [
          'Inflation targeting',
          'Monetary policy transmission',
          'Dual mandate (employment + price stability)',
          'Quantitative tightening'
        ]
      });
    }, 1100);
  });
};

export const getPerspectives = (articleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        articleId,
        perspectives: [
          {
            viewpoint: 'Market Optimist',
            stance: 'The Fed decision shows confidence in economic resilience. Strong jobs data and consumer spending indicate we can handle higher rates without recession. This is prudent policy that prioritizes long-term stability over short-term market gains.',
            keyArguments: [
              'Robust employment justifies maintaining rates',
              'Premature cuts could reignite inflation',
              'Economy showing surprising strength',
              'Better to be cautious than repeat 1970s mistakes'
            ],
            sources: ['Wall Street Journal Editorial Board', 'Morgan Stanley Research']
          },
          {
            viewpoint: 'Market Pessimist',
            stance: 'The Fed is behind the curve and risks overtightening. Inflation is clearly declining, and maintaining elevated rates unnecessarily threatens economic growth. Businesses are already struggling with high borrowing costs, and this decision increases recession probability.',
            keyArguments: [
              'Inflation already moderating significantly',
              'High rates hurting business investment',
              'Housing market severely impacted',
              'Risk of inducing unnecessary recession'
            ],
            sources: ['Bloomberg Opinion', 'Goldman Sachs Economics']
          },
          {
            viewpoint: 'Progressive Economist',
            stance: 'The Fed is prioritizing Wall Street over workers. Higher rates mean fewer jobs and lower wages for ordinary Americans. The inflation we experienced was largely driven by corporate price-gouging and supply chains, not wage growth. This policy disproportionately hurts working families.',
            keyArguments: [
              'Rate hikes increase unemployment',
              'Inflation not driven by overheating labor market',
              'Policy benefits creditors over workers',
              'Alternative tools exist to combat inflation'
            ],
            sources: ['Economic Policy Institute', 'Progressive Think Tanks']
          },
          {
            viewpoint: 'Conservative Economist',
            stance: 'The Fed should have acted sooner and more aggressively. Inflation expectations remain elevated, and the central bank risks losing credibility. Maintaining discipline now is essential even if it is politically unpopular. Price stability is the foundation of economic prosperity.',
            keyArguments: [
              'Central bank credibility paramount',
              'Inflation expectations still not anchored',
              'Short-term pain necessary for long-term gain',
              'Political pressure must be resisted'
            ],
            sources: ['Cato Institute', 'Hoover Institution']
          }
        ],
        consensusAreas: [
          'Inflation has moderated from 2022 peaks',
          'Labor market remains strong',
          'Decision will impact mortgage and lending markets',
          'Some economic uncertainty ahead'
        ],
        disagreementAreas: [
          'Whether current inflation level justifies maintaining rates',
          'Risk of recession versus risk of reinflating',
          'Impact on employment and inequality',
          'Appropriate timeline for rate adjustments'
        ]
      });
    }, 1300);
  });
};

// =============================================================================
// VERIFY HUB
// =============================================================================

export const verifyClaim = (input) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock verification based on input
      const isSuspicious = input.toLowerCase().includes('secret') ||
                          input.toLowerCase().includes('conspiracy') ||
                          input.toLowerCase().includes('fake');

      resolve({
        input,
        confidenceScore: isSuspicious ? 35 : 78,
        status: isSuspicious ? 'MISLEADING' : 'LIKELY_TRUE',
        verificationDate: new Date().toISOString(),
        entityAnalysis: {
          corporateBias: isSuspicious ? 75 : 20,
          geopoliticalBias: isSuspicious ? 60 : 45,
          sentimentScore: isSuspicious ? 85 : 65,
          emotionalManipulation: isSuspicious ? 80 : 35
        },
        sourcesChecked: [
          {
            name: 'Reuters',
            url: 'https://reuters.com',
            confirms: !isSuspicious,
            credibilityScore: 95,
            date: '2024-01-24'
          },
          {
            name: 'Associated Press',
            url: 'https://apnews.com',
            confirms: !isSuspicious,
            credibilityScore: 93,
            date: '2024-01-24'
          },
          {
            name: isSuspicious ? 'Unknown Blog' : 'BBC News',
            url: isSuspicious ? 'https://suspicious-site.com' : 'https://bbc.com',
            confirms: false,
            credibilityScore: isSuspicious ? 25 : 90,
            date: '2024-01-24'
          }
        ],
        factCheckResults: [
          {
            claim: 'Main claim from input',
            verdict: isSuspicious ? 'FALSE' : 'TRUE',
            evidence: isSuspicious
              ? 'Multiple credible sources contradict this claim'
              : 'Corroborated by multiple independent sources',
            confidence: isSuspicious ? 90 : 85
          }
        ],
        recommendations: isSuspicious
          ? ['Verify with additional credible sources', 'Check for source bias', 'Look for corroborating evidence']
          : ['Claim appears credible', 'Cross-referenced with trusted sources', 'No significant contradictions found']
      });
    }, 1500);
  });
};

// =============================================================================
// TOPIC MATRIX / USER PREFERENCES
// =============================================================================

export const getUserPreferences = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        lifeImpactProfile: {
          industry: 'Software Engineering',
          region: 'United States',
          interests: ['Technology', 'Business', 'Science']
        },
        noiseSuppression: {
          celebrityGossip: true,
          sports: false,
          politicalOpinions: false
        },
        vectorManagement: [
          { topic: 'Artificial Intelligence', priority: 'HIGH', enabled: true },
          { topic: 'Climate Change', priority: 'MEDIUM', enabled: true },
          { topic: 'Economics', priority: 'HIGH', enabled: true },
          { topic: 'Healthcare', priority: 'MEDIUM', enabled: true },
          { topic: 'Space Exploration', priority: 'LOW', enabled: true },
          { topic: 'Cryptocurrency', priority: 'LOW', enabled: false }
        ],
        notificationSettings: {
          breakingNews: true,
          dailyDigest: true,
          digestTime: '08:00',
          weeklyReport: true
        }
      });
    }, 400);
  });
};

export const saveUserPreferences = (preferences) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving preferences:', preferences);
      resolve({ success: true, message: 'Preferences saved successfully' });
    }, 600);
  });
};

// =============================================================================
// IQ LAB / GAMIFICATION
// =============================================================================

export const getIQScore = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 78,
        level: 'Expert',
        rank: 'Top 15%',
        nextLevel: {
          name: 'Master',
          pointsNeeded: 22
        },
        breakdown: {
          topicDiversity: 85,
          readingFrequency: 90,
          quizAccuracy: 65,
          criticalThinking: 75
        }
      });
    }, 500);
  });
};

export const getDailyChallenge = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        date: new Date().toISOString().split('T')[0],
        questions: [
          {
            id: 1,
            question: "What interest rate decision did the Federal Reserve announce today?",
            options: [
              "Raised rates by 0.25%",
              "Lowered rates by 0.25%",
              "Kept rates unchanged at 5.25-5.5%",
              "Raised rates by 0.5%"
            ],
            correctAnswer: 2,
            points: 10,
            category: 'Economics'
          },
          {
            id: 2,
            question: "What accuracy rate did the Stanford AI diagnostic system achieve?",
            options: [
              "75%",
              "85%",
              "95%",
              "99%"
            ],
            correctAnswer: 2,
            points: 10,
            category: 'Technology'
          },
          {
            id: 3,
            question: "Where did the 7.8 magnitude earthquake occur?",
            options: [
              "California coast",
              "Pacific Ocean near Japan",
              "Mediterranean Sea",
              "Caribbean"
            ],
            correctAnswer: 1,
            points: 10,
            category: 'World News'
          }
        ],
        bonus: {
          description: "Answer all questions correctly",
          points: 15
        }
      });
    }, 600);
  });
};

export const getStreaksAndBadges = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        currentStreak: 7,
        longestStreak: 23,
        badges: [
          {
            id: 'b1',
            name: 'Early Adopter',
            description: 'Joined NewsAI in beta',
            icon: '🚀',
            earned: true,
            date: '2024-01-15'
          },
          {
            id: 'b2',
            name: 'News Hound',
            description: 'Read 100 articles',
            icon: '📰',
            earned: true,
            date: '2024-01-20'
          },
          {
            id: 'b3',
            name: 'Quiz Master',
            description: '10 perfect daily challenges',
            icon: '🏆',
            earned: true,
            date: '2024-01-23'
          },
          {
            id: 'b4',
            name: 'Diverse Reader',
            description: 'Read from all categories',
            icon: '🌈',
            earned: false,
            progress: 75
          },
          {
            id: 'b5',
            name: 'Truth Seeker',
            description: 'Verified 50 claims',
            icon: '🔍',
            earned: false,
            progress: 32
          }
        ]
      });
    }, 500);
  });
};

// =============================================================================
// NEURAL ANALYTICS
// =============================================================================

export const getWeeklyStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weeklyConsumption: [
          { day: 'Mon', minutes: 12, articles: 8 },
          { day: 'Tue', minutes: 18, articles: 12 },
          { day: 'Wed', minutes: 15, articles: 10 },
          { day: 'Thu', minutes: 22, articles: 15 },
          { day: 'Fri', minutes: 10, articles: 7 },
          { day: 'Sat', minutes: 25, articles: 17 },
          { day: 'Sun', minutes: 20, articles: 14 }
        ],
        topicIntensity: [
          { category: 'Technology', percentage: 35, articles: 28 },
          { category: 'Business', percentage: 25, articles: 20 },
          { category: 'Science', percentage: 15, articles: 12 },
          { category: 'World', percentage: 15, articles: 12 },
          { category: 'Health', percentage: 10, articles: 8 }
        ],
        wellness: {
          dailyGoal: 15,
          averageDaily: 17.4,
          cognitiveLoad: 65,
          doomScrollRisk: 'LOW',
          recommendations: [
            'Great balance across categories',
            'Consider reading more World news',
            'Cognitive load is healthy'
          ]
        },
        insights: {
          mostActiveDay: 'Saturday',
          preferredReadingTime: 'Morning (8-10 AM)',
          averageArticleLength: '6 min',
          topSources: ['Reuters', 'Bloomberg', 'MIT Tech Review']
        }
      });
    }, 700);
  });
};

// =============================================================================
// EXPORT ALL FUNCTIONS
// =============================================================================

const mockDashboardAPI = {
  // Core Dashboard
  getLiveIntelligenceBriefing,
  getArticlesByMode,
  getGlobalVectors,

  // AI Commands
  explainArticle,
  getMarketImpact,
  getContext,
  getPerspectives,

  // Verify Hub
  verifyClaim,

  // Topic Matrix
  getUserPreferences,
  saveUserPreferences,

  // IQ Lab
  getIQScore,
  getDailyChallenge,
  getStreaksAndBadges,

  // Analytics
  getWeeklyStats
};

export default mockDashboardAPI;
