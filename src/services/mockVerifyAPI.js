// Mock Verify API Service
// Provides mock verification data for the Verify Hub AI Forensic Lab

// Helper function to generate mock verification results
const generateVerificationResult = (claimText, inputType, verificationMode) => {
  // Calculate truth score based on mode (mock logic)
  const baseScore = Math.floor(Math.random() * 100);
  let truthScore = baseScore;

  if (verificationMode === 'STRICT') {
    truthScore = Math.max(0, baseScore - 15); // More conservative
  } else if (verificationMode === 'EXPERIMENTAL') {
    truthScore = baseScore; // Use base score
  }

  // Determine verdict label based on score
  let verdictLabel, verdictLabelHuman, scoreColor;
  if (truthScore >= 85) {
    verdictLabel = 'VERIFIED_TRUE';
    verdictLabelHuman = 'VERIFIED TRUE';
    scoreColor = '#10B981'; // green
  } else if (truthScore >= 70) {
    verdictLabel = 'LIKELY_TRUE';
    verdictLabelHuman = 'LIKELY TRUE';
    scoreColor = '#84CC16'; // lime
  } else if (truthScore >= 40) {
    verdictLabel = 'UNCLEAR_MIXED';
    verdictLabelHuman = 'UNCLEAR / MIXED';
    scoreColor = '#F59E0B'; // amber
  } else if (truthScore >= 20) {
    verdictLabel = 'LIKELY_MISLEADING';
    verdictLabelHuman = 'LIKELY MISLEADING';
    scoreColor = '#F97316'; // orange
  } else {
    verdictLabel = 'FALSE_FABRICATED';
    verdictLabelHuman = 'FALSE / FABRICATED';
    scoreColor = '#EF4444'; // red
  }

  return {
    truthDial: {
      score: truthScore,
      verdictLabel,
      verdictLabelHuman,
      scoreColor,
      verdictSummary: getVerdictSummary(truthScore, inputType)
    },
    summaryTab: {
      forensicSummary: `Analysis of this ${inputType.toLowerCase()} reveals ${truthScore >= 70 ? 'strong' : truthScore >= 40 ? 'mixed' : 'weak'} evidence support. The claim shows ${truthScore >= 70 ? 'high consistency' : truthScore >= 40 ? 'some inconsistencies' : 'significant red flags'} across multiple verification checks.`,
      keyReasons: getKeyReasons(truthScore)
    },
    evidenceTab: {
      evidenceConfidenceScore: truthScore / 100,
      evidenceConfidenceLabel: getStarRating(truthScore),
      sources: getMockSources(truthScore),
      hallucinationGuardText: 'Evidence suggested here may not perfectly match real articles. Always cross-check URLs and titles in your browser.'
    },
    biasSentimentTab: {
      corporateBiasLevel: truthScore >= 70 ? 'LOW' : truthScore >= 40 ? 'MEDIUM' : 'HIGH',
      corporateBiasExplanation: truthScore >= 70 ? 'Minimal corporate spin detected. Content appears balanced.' : truthScore >= 40 ? 'Some corporate framing present but balanced with other perspectives.' : 'Strong corporate bias detected with one-sided framing.',
      politicalLean: 'CENTER',
      politicalLeanExplanation: 'Content does not show strong partisan alignment in either direction.',
      emotionalTriggerLevel: truthScore >= 70 ? 'LOW' : truthScore >= 40 ? 'MEDIUM' : 'HIGH',
      emotionalTriggerExplanation: truthScore >= 70 ? 'Language is neutral and informative.' : truthScore >= 40 ? 'Some emotionally charged language present.' : 'Highly emotional language designed to provoke strong reactions.',
      biasChips: [
        {
          label: '🏢 Corporate Spin',
          value: truthScore >= 70 ? 'Low' : truthScore >= 40 ? 'Medium' : 'High',
          tooltip: 'Assessment of corporate or brand-favorable framing in the content.'
        },
        {
          label: '⚖ Political Lean',
          value: 'Center',
          tooltip: 'Estimated political alignment or bias in the framing.'
        },
        {
          label: '🔥 Emotional Trigger',
          value: truthScore >= 70 ? 'Low' : truthScore >= 40 ? 'Medium' : 'High',
          tooltip: 'Degree to which language is designed to provoke emotional responses.'
        }
      ],
      saferAlternativeFraming: `A more neutral framing: ${claimText.substring(0, 100)}${claimText.length > 100 ? '...' : ''} (with appropriate context and qualifiers added).`
    },
    timelineTab: {
      events: getTimelineEvents(truthScore)
    },
    riskGuidanceTab: {
      overallRiskLevel: truthScore >= 70 ? 'LOW' : truthScore >= 40 ? 'MEDIUM' : 'HIGH',
      overallGuidanceSummary: truthScore >= 70
        ? 'This claim appears well-supported by evidence. Safe to share with standard context.'
        : truthScore >= 40
        ? 'This claim has mixed evidence. Share with caution and include context about uncertainties.'
        : 'This claim shows significant red flags. Avoid sharing without thorough fact-checking.',
      guidelines: [
        {
          category: 'GENERAL_SHARING',
          text: truthScore >= 70 ? 'Safe to share with standard context.' : truthScore >= 40 ? 'Share with explicit caveats and uncertainties.' : 'Do not share without additional verification.'
        },
        {
          category: 'MEDICAL_HEALTH',
          text: 'Never use unverified claims as basis for medical decisions. Consult healthcare professionals.'
        },
        {
          category: 'FINANCIAL',
          text: 'Do not make financial decisions based on unverified information. Seek professional advice.'
        },
        {
          category: 'EMOTIONAL_WELLBEING',
          text: truthScore < 40 ? 'Be aware that this content may be designed to provoke anxiety or outrage.' : 'Standard emotional awareness applies.'
        }
      ]
    },
    auxiliary: {
      shortClaimSummary: claimText.length > 60 ? claimText.substring(0, 57) + '...' : claimText,
      primaryStatusBadge: `${verdictLabelHuman} · ${verificationMode}`,
      runMetadata: {
        modelName: 'Gemini Pro',
        modelVersion: 'v1.2',
        effectiveVerificationMode: verificationMode,
        estimatedLatencySeconds: 0.8 + Math.random() * 0.5
      }
    }
  };
};

// Helper functions
const getVerdictSummary = (score, inputType) => {
  if (score >= 85) return 'High-quality sources with consistent reporting across multiple outlets.';
  if (score >= 70) return 'Reputable sources support this claim, with minor uncertainties in details.';
  if (score >= 40) return 'Mixed evidence with some supporting and some refuting sources.';
  if (score >= 20) return 'Significant inconsistencies and questionable sourcing detected.';
  return 'Multiple red flags including fabricated sources or completely unsubstantiated claims.';
};

const getKeyReasons = (score) => {
  if (score >= 70) {
    return [
      { type: 'PRO', text: 'Multiple tier-1 sources corroborate key facts with consistent details.' },
      { type: 'PRO', text: 'Timeline of events aligns across independent reporting.' },
      { type: 'CAVEAT', text: 'Some minor details may still be developing or subject to updates.' }
    ];
  } else if (score >= 40) {
    return [
      { type: 'PRO', text: 'Some reputable sources provide partial support for the claim.' },
      { type: 'CON', text: 'Significant gaps or contradictions exist in the evidence.' },
      { type: 'CAVEAT', text: 'Claims may be exaggerated or taken out of context.' }
    ];
  } else {
    return [
      { type: 'CON', text: 'No credible sources found to support the core claim.' },
      { type: 'CON', text: 'Evidence suggests fabrication or intentional misinformation.' },
      { type: 'CAVEAT', text: 'Content shows characteristics of coordinated disinformation.' }
    ];
  }
};

const getStarRating = (score) => {
  const stars = Math.round((score / 100) * 5);
  const filled = '⭐'.repeat(stars);
  const empty = '☆'.repeat(5 - stars);
  return `${filled}${empty} (${stars}/5 evidence confidence)`;
};

const getMockSources = (score) => {
  const sources = [];

  if (score >= 70) {
    sources.push({
      id: 'src_1',
      title: 'Major outlet reports consistent details on this story',
      publisher: 'Reuters',
      url: 'https://example.com/reuters-article',
      tier: 'TIER_1',
      tierScore: 95,
      supportType: 'SUPPORTING',
      confidence: 'HIGH',
      excerpt: 'Multiple independent sources confirm the key facts with consistent reporting.',
      note: 'Tier-1 source providing strong corroboration.',
      isLikelyReal: true
    });
  }

  if (score >= 40) {
    sources.push({
      id: 'src_2',
      title: 'Mid-tier outlet provides context with some caveats',
      publisher: 'Industry Publication',
      url: 'https://example.com/context-article',
      tier: 'TIER_2',
      tierScore: 70,
      supportType: 'BACKGROUND',
      confidence: 'MEDIUM',
      excerpt: 'Provides relevant context but highlights areas of uncertainty.',
      note: 'Adds nuance but doesn\'t fully confirm or refute.',
      isLikelyReal: false
    });
  }

  if (score < 40) {
    sources.push({
      id: 'src_3',
      title: 'Fact-check identifies multiple false claims',
      publisher: 'Snopes',
      url: 'https://example.com/fact-check',
      tier: 'TIER_1',
      tierScore: 90,
      supportType: 'REFUTING',
      confidence: 'HIGH',
      excerpt: 'Investigation reveals the claim contains fabricated details and misrepresented facts.',
      note: 'Authoritative fact-check directly refutes key elements.',
      isLikelyReal: false
    });
  }

  return sources;
};

const getTimelineEvents = (score) => {
  if (score >= 70) {
    return [
      { relativeLabel: 'T-48h', description: 'Story first reported by wire service with initial details.', linkedSourceIds: ['src_1'] },
      { relativeLabel: 'T-24h', description: 'Major news outlets pick up story with independent verification.', linkedSourceIds: ['src_1'] },
      { relativeLabel: 'T-12h', description: 'Additional sources provide corroborating evidence.', linkedSourceIds: ['src_1'] },
      { relativeLabel: 'T-1h', description: 'Story widely covered with consistent details across outlets.', linkedSourceIds: ['src_1'] }
    ];
  } else if (score >= 40) {
    return [
      { relativeLabel: 'T-72h', description: 'Claim first appears on social media from unverified account.', linkedSourceIds: [] },
      { relativeLabel: 'T-24h', description: 'Some outlets report claim with varying details.', linkedSourceIds: ['src_2'] },
      { relativeLabel: 'T-12h', description: 'Fact-checkers begin investigating inconsistencies.', linkedSourceIds: ['src_2'] },
      { relativeLabel: 'T-1h', description: 'Mixed conclusions from different verification sources.', linkedSourceIds: ['src_2'] }
    ];
  } else {
    return [
      { relativeLabel: 'T-96h', description: 'Claim originates from known disinformation source.', linkedSourceIds: ['src_3'] },
      { relativeLabel: 'T-48h', description: 'Spreads through social media with no credible sourcing.', linkedSourceIds: [] },
      { relativeLabel: 'T-24h', description: 'Fact-checkers identify claim as false.', linkedSourceIds: ['src_3'] },
      { relativeLabel: 'T-1h', description: 'Multiple authoritative sources refute the claim.', linkedSourceIds: ['src_3'] }
    ];
  }
};

// Main API functions
export const verifyContent = (claimText, inputType = 'HEADLINE', verificationMode = 'STANDARD') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = generateVerificationResult(claimText, inputType, verificationMode);
      resolve(result);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  });
};

export const getVerificationHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'vh_1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
          claimText: 'Breaking: Major tech company announces unexpected merger',
          verdictLabel: 'LIKELY_TRUE',
          truthScore: 78,
          inputType: 'HEADLINE',
          verificationMode: 'STANDARD'
        },
        {
          id: 'vh_2',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          claimText: 'COVID vaccine causes widespread fertility issues',
          verdictLabel: 'FALSE_FABRICATED',
          truthScore: 12,
          inputType: 'TWEET_SOCIAL',
          verificationMode: 'STANDARD'
        },
        {
          id: 'vh_3',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          claimText: 'New study shows AI accuracy approaching human levels',
          verdictLabel: 'UNCLEAR_MIXED',
          truthScore: 55,
          inputType: 'HEADLINE',
          verificationMode: 'STRICT'
        }
      ]);
    }, 300);
  });
};

export const getModelStatus = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelName: 'Gemini Pro',
        modelVersion: 'v1.2',
        status: 'ONLINE',
        reliability: 98.4,
        lastUpdate: '2h ago',
        averageLatency: 0.85
      });
    }, 100);
  });
};

const mockVerifyAPI = {
  verifyContent,
  getVerificationHistory,
  getModelStatus
};

export default mockVerifyAPI;
