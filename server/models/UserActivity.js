const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Activity type
    action: {
      type: String,
      enum: [
        "page_visit",
        "click",
        "time_spent",
        "topic_click",
        "news_type_click",
        "interest_click",
      ],
      required: true,
    },

    // Page/context
    page: {
      type: String,
      enum: [
        "dashboard",
        "trending",
        "neural_analytics",
        "topic_matrix",
        "verify_hub",
        "iqlab",
      ],
      required: true,
    },

    // Timestamp
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Duration for time_spent actions (in seconds)
    duration: {
      type: Number,
      default: 0,
    },

    // Metadata for specific actions
    metadata: {
      // For clicks: what was clicked
      elementType: String, // 'news_card', 'topic_tag', 'interest_button', etc.
      elementId: String, // ID of the clicked element
      elementText: String, // Text content of clicked element

      // For topic/interest clicks
      topicId: String,
      topicName: String,
      category: String, // 'news', 'politics', 'technology', etc.

      // Additional context
      url: String, // Current page URL
      referrer: String, // Previous page
      device: String, // 'mobile', 'desktop', 'tablet'
      userAgent: String,
    },

    // Session tracking
    sessionId: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ user: 1, action: 1, timestamp: -1 });
userActivitySchema.index({ user: 1, page: 1, timestamp: -1 });
userActivitySchema.index({ sessionId: 1 });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
