import apiClient from "./apiClient";

// Activity tracker service
class ActivityTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.currentPage = null;
    this.pageStartTime = null;
    this.isTracking = false;
    this.clickBuffer = [];
    this.bufferTimeout = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start tracking
  startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    // Track page visits
    this.trackPageVisit(window.location.pathname);

    // Track navigation
    window.addEventListener("popstate", () => {
      this.trackPageVisit(window.location.pathname);
    });

    // Track clicks
    document.addEventListener("click", this.handleClick.bind(this), true);

    // Track page visibility (tab switching)
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );
  }

  // Stop tracking
  stopTracking() {
    this.isTracking = false;
    this.flushClickBuffer();

    document.removeEventListener("click", this.handleClick.bind(this), true);
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this)
    );

    if (this.pageStartTime) {
      this.trackTimeSpent();
    }
  }

  // Track page visit
  trackPageVisit(pagePath) {
    // Map page paths to our page types
    const pageMapping = {
      "/": "dashboard",
      "/dashboard": "dashboard",
      "/trending": "trending",
      "/neural-analytics": "neural_analytics",
      "/topic-matrix": "topic_matrix",
      "/verify-hub": "verify_hub",
      "/iqlab": "iqlab",
    };

    const page = pageMapping[pagePath] || "dashboard";

    // Track time spent on previous page
    if (this.currentPage && this.pageStartTime) {
      this.trackTimeSpent();
    }

    // Start tracking new page
    this.currentPage = page;
    this.pageStartTime = Date.now();

    this.logActivity({
      action: "page_visit",
      page: page,
      metadata: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
    });
  }

  // Track time spent on current page
  trackTimeSpent() {
    if (!this.currentPage || !this.pageStartTime) return;

    const duration = Math.floor((Date.now() - this.pageStartTime) / 1000); // in seconds

    if (duration > 5) {
      // Only track if spent more than 5 seconds
      this.logActivity({
        action: "time_spent",
        page: this.currentPage,
        duration: duration,
        metadata: {
          url: window.location.href,
        },
      });
    }
  }

  // Handle click events
  handleClick(event) {
    const target = event.target;
    const clickableElement = this.findClickableElement(target);

    if (clickableElement) {
      const clickData = this.extractClickData(clickableElement, event);

      if (clickData) {
        this.clickBuffer.push(clickData);

        // Debounce buffer flush
        if (this.bufferTimeout) clearTimeout(this.bufferTimeout);
        this.bufferTimeout = setTimeout(() => this.flushClickBuffer(), 1000);
      }
    }
  }

  // Find the actual clickable element
  findClickableElement(element) {
    let current = element;

    while (current && current !== document.body) {
      if (
        current.tagName === "BUTTON" ||
        current.tagName === "A" ||
        current.onclick ||
        current.getAttribute("role") === "button" ||
        current.classList.contains("clickable") ||
        current.classList.contains("cursor-pointer")
      ) {
        return current;
      }

      // Check for news cards, topic tags, etc.
      if (
        current.classList.contains("news-card") ||
        current.classList.contains("topic-tag") ||
        current.classList.contains("interest-button") ||
        current.closest(".news-card") ||
        current.closest(".topic-tag")
      ) {
        return current;
      }

      current = current.parentElement;
    }

    return null;
  }

  // Extract click data
  extractClickData(element, event) {
    const rect = element.getBoundingClientRect();

    let action = "click";
    let metadata = {
      elementType: element.tagName.toLowerCase(),
      elementText: element.textContent?.trim().substring(0, 100) || "",
      elementId: element.id || "",
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      url: window.location.href,
    };

    // Determine specific action types
    if (
      element.classList.contains("topic-tag") ||
      element.closest(".topic-tag")
    ) {
      action = "topic_click";
      metadata.category = this.extractCategory(element);
    } else if (
      element.classList.contains("interest-button") ||
      element.closest(".interest-button")
    ) {
      action = "interest_click";
      metadata.category = this.extractCategory(element);
    } else if (
      element.classList.contains("news-card") ||
      element.closest(".news-card")
    ) {
      action = "news_type_click";
      metadata.elementType = "news_card";
    }

    return {
      action,
      page: this.currentPage,
      metadata,
    };
  }

  // Extract category from element
  extractCategory(element) {
    // Try to find category in text content or data attributes
    const text = element.textContent?.toLowerCase() || "";
    const categories = [
      "news",
      "politics",
      "technology",
      "science",
      "business",
      "sports",
      "entertainment",
      "health",
      "finance",
      "environment",
    ];

    for (const category of categories) {
      if (text.includes(category)) {
        return category;
      }
    }

    // Check data attributes
    return (
      element.dataset.category ||
      element.dataset.topic ||
      element.dataset.interest ||
      "unknown"
    );
  }

  // Handle visibility change (tab switching)
  handleVisibilityChange() {
    if (document.hidden) {
      // Tab became hidden - track time spent
      this.trackTimeSpent();
      this.pageStartTime = null; // Pause timing
    } else {
      // Tab became visible - resume timing
      this.pageStartTime = Date.now();
    }
  }

  // Flush click buffer
  flushClickBuffer() {
    if (this.clickBuffer.length > 0) {
      this.clickBuffer.forEach((clickData) => {
        this.logActivity(clickData);
      });
      this.clickBuffer = [];
    }
  }

  // Log activity to backend
  async logActivity(activityData) {
    try {
      await apiClient.post("/analytics/activities", {
        ...activityData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
      // Don't throw - activity tracking should not break the app
    }
  }

  // Manual activity logging (for specific events)
  logManualActivity(action, page, metadata = {}) {
    this.logActivity({
      action,
      page: page || this.currentPage,
      metadata,
    });
  }
}

// Create singleton instance
const activityTracker = new ActivityTracker();

export default activityTracker;

// Export for manual use
export const logActivity = (action, page, metadata) => {
  activityTracker.logManualActivity(action, page, metadata);
};
