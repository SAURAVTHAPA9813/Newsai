import apiClient from './apiClient';

/**
 * Universal Article Tracking Service
 * Tracks ALL article interactions regardless of where they occur
 */

class ArticleTracker {
  constructor() {
    this.activeSessions = new Map(); // articleId -> session data
  }

  /**
   * Track when an article is clicked/viewed
   * Call this whenever an article is opened ANYWHERE in the app
   */
  trackArticleView(article) {
    if (!article) {
      console.warn('⚠️ Cannot track article: article is null/undefined');
      return null;
    }

    const sessionId = article.id || article.url || `temp-${Date.now()}`;

    // Validate article has minimum required fields
    if (!article.title) {
      console.warn('⚠️ Article missing title:', article);
    }

    // Create session record
    const session = {
      articleId: sessionId,
      articleTitle: article.title || 'Untitled Article',
      articleUrl: article.url || '',
      startedAt: new Date(),

      // Topic/Category tracking
      topic: {
        id: (article.category || 'general').toLowerCase().trim(),
        name: article.category || 'General',
        category: (article.category || 'GENERAL').toUpperCase()
      },

      // Source tracking (where the article came from)
      source: {
        id: article.source?.id || article.source?.name?.toLowerCase() || 'unknown',
        name: article.source?.name || article.source || 'Unknown Source',
        tier: this.getSourceTier(article)
      },

      // Verification status tracking (green/yellow/red from Control Center)
      verificationStatus: this.getVerificationStatus(article),

      // Device info
      device: this.getDeviceType(),

      // Article metadata
      wordCount: this.estimateWordCount(article),

      // Engagement tracking
      engagementEvents: []
    };

    this.activeSessions.set(sessionId, session);

    console.log('📊 Article view tracked:', {
      id: sessionId,
      title: article.title,
      category: session.topic.name,
      source: session.source.name,
      verification: session.verificationStatus,
      activeSessions: this.activeSessions.size
    });

    return sessionId;
  }

  /**
   * Track engagement events (scroll, click AI module, save, etc.)
   */
  trackEngagement(articleId, eventType, metadata = {}) {
    const session = this.activeSessions.get(articleId);
    if (!session) return;

    session.engagementEvents.push({
      eventType: eventType.toLowerCase(),
      timestamp: new Date(),
      metadata
    });

    console.log('👆 Engagement tracked:', eventType, 'for', session.articleTitle);
  }

  /**
   * End session and submit to backend
   * Call this when article is closed or user navigates away
   */
  async endArticleSession(articleId, completionRate = 0) {
    const session = this.activeSessions.get(articleId);
    if (!session) return;

    const endTime = new Date();
    const durationMinutes = Math.round((endTime - session.startedAt) / 60000);

    // Don't submit if session was too short (less than 5 seconds for testing, 0.08 minutes)
    if (durationMinutes < 0.08) {
      console.log('⏭️ Session too short (less than 5 sec), skipping:', session.articleTitle);
      this.activeSessions.delete(articleId);
      return;
    }

    console.log('✅ Session duration acceptable:', durationMinutes, 'minutes');

    // Filter engagement events to only include valid types
    const validEventTypes = ['scroll', 'highlight', 'share', 'save', 'verify', 'decompress', 'explain', 'perspectives'];
    const validEngagementEvents = session.engagementEvents
      .filter(e => validEventTypes.includes(e.eventType?.toLowerCase()))
      .map(e => ({
        eventType: e.eventType.toLowerCase(),
        timestamp: e.timestamp,
        metadata: e.metadata || {}
      }));

    const sessionData = {
      ...session,
      endedAt: endTime,
      durationMinutes: Math.max(1, durationMinutes),
      completionRate: Math.min(100, completionRate),
      readingMode: this.inferReadingMode(durationMinutes, completionRate),
      moodTag: 'neutral',
      selfReportedAnxiety: this.inferAnxiety(session),
      engagementEvents: validEngagementEvents, // Use filtered events
      verifyUsed: validEngagementEvents.some(e => e.eventType === 'verify'),
      focusScore: this.calculateFocusScore(session, durationMinutes)
    };

    try {
      console.log('💾 Submitting reading session...', {
        title: sessionData.articleTitle,
        category: sessionData.topic.name,
        duration: sessionData.durationMinutes,
        source: sessionData.source.name,
        device: sessionData.device
      });

      const response = await apiClient.post('/analytics/sessions', sessionData);

      if (response.success) {
        console.log('✅ Reading session saved successfully:', {
          articleId: sessionData.articleId,
          category: sessionData.topic.name,
          sessionId: response.data?._id
        });
      }
    } catch (error) {
      console.error('❌ Error saving reading session:', {
        title: sessionData.articleTitle,
        category: sessionData.topic.name,
        error: error.message || error,
        fullError: error
      });
    } finally {
      this.activeSessions.delete(articleId);
    }
  }

  /**
   * Submit all active sessions (called on page unload)
   */
  async endAllSessions() {
    const promises = Array.from(this.activeSessions.keys()).map(articleId =>
      this.endArticleSession(articleId, 50) // Default 50% completion
    );

    await Promise.all(promises);
  }

  // Helper methods

  getSourceTier(article) {
    // Determine source tier based on verification score or source reputation
    const score = article.sourceScore || article.verificationScore || 50;

    if (score >= 80) return 'premium';
    if (score >= 60) return 'standard';
    if (score >= 40) return 'basic';
    return 'unknown';
  }

  getVerificationStatus(article) {
    // Map verification colors from Control Center
    // Green = verified, Yellow = mixed, Red = unverified
    const score = article.verificationScore || article.trustScore || 0;

    if (score >= 70) return 'verified';      // Green
    if (score >= 40) return 'mixed';          // Yellow
    return 'unverified';                      // Red
  }

  getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  estimateWordCount(article) {
    if (article.wordCount) return article.wordCount;
    if (article.content) return article.content.split(/\s+/).length;
    if (article.description) return article.description.split(/\s+/).length * 10; // Estimate
    return 500; // Default
  }

  inferReadingMode(durationMinutes, completionRate) {
    if (durationMinutes < 2 && completionRate < 30) return 'skim';
    if (durationMinutes > 10 && completionRate > 80) return 'deep_dive';
    if (completionRate > 60) return 'intentional';
    return 'standard';
  }

  inferAnxiety(session) {
    // Lower anxiety for positive topics, higher for negative
    const anxiousTopics = ['politics', 'crime', 'war', 'disaster'];
    const calmTopics = ['health', 'science', 'technology', 'wellness'];

    const topicId = session.topic.id.toLowerCase();

    if (anxiousTopics.some(t => topicId.includes(t))) return 60;
    if (calmTopics.some(t => topicId.includes(t))) return 30;
    return 45; // Neutral
  }

  calculateFocusScore(session, durationMinutes) {
    const engagementRate = session.engagementEvents.length / Math.max(1, durationMinutes);
    const baseScore = durationMinutes > 5 ? 70 : 50;
    return Math.min(100, Math.round(baseScore + engagementRate * 15));
  }
}

// Create singleton instance
const articleTracker = new ArticleTracker();

// Auto-submit sessions on page unload
window.addEventListener('beforeunload', () => {
  articleTracker.endAllSessions();
});

export default articleTracker;
