import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiX,
  FiVolume2,
  FiVolumeX,
  FiClock,
  FiBookmark,
  FiUser,
  FiBookOpen,
  FiShare2,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiMail,
  FiLink,
  FiExternalLink,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
} from "react-icons/fi";
import React from "react";
import userAPI from "../../services/userAPI";
import { createReadingSession } from "../../services/neuralAnalyticsAPI";
import ExplainModule from '../aimodules/ExplainModule';
import MarketImpactModule from '../aimodules/MarketImpactModule';
import ContextTimelineModule from '../aimodules/ContextTimelineModule';
import PerspectivesModule from '../aimodules/PerspectivesModule';

const FocusZenMode = ({ article, onClose, relatedArticles = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedModules, setExpandedModules] = useState({
    explain: false,
    market: false,
    context: false,
    perspectives: false
  });

  // Session tracking state
  const [sessionStartTime] = useState(() => new Date());
  const [engagementEvents, setEngagementEvents] = useState([]);
  const [scrollDepth, setScrollDepth] = useState(0);
  const sessionSubmitted = useRef(false);

  const scrollContainerRef = useRef(null);
  const utteranceRef = useRef(null);

  // Reset utterance when article changes
  useEffect(() => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
  }, [article]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Check if article is saved when component mounts or article changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!article || !article.url) return;

      try {
        const response = await userAPI.checkSavedStatus(article.url);
        if (response.success) {
          setIsSaved(response.isSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
        // Silently fail - user can still try to save
      }
    };

    checkSavedStatus();
  }, [article]);

  // Track scroll depth
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const depth = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

      if (depth > scrollDepth) {
        setScrollDepth(depth);

        // Track milestone scrolls
        if (depth >= 25 && scrollDepth < 25) {
          setEngagementEvents(prev => [...prev, { eventType: 'SCROLL_25', timestamp: new Date() }]);
        } else if (depth >= 50 && scrollDepth < 50) {
          setEngagementEvents(prev => [...prev, { eventType: 'SCROLL_50', timestamp: new Date() }]);
        } else if (depth >= 75 && scrollDepth < 75) {
          setEngagementEvents(prev => [...prev, { eventType: 'SCROLL_75', timestamp: new Date() }]);
        } else if (depth >= 100 && scrollDepth < 100) {
          setEngagementEvents(prev => [...prev, { eventType: 'SCROLL_100', timestamp: new Date() }]);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollDepth]);

  // Submit reading session
  const submitReadingSession = useCallback(async () => {
    if (sessionSubmitted.current) return;
    sessionSubmitted.current = true;

    const endTime = new Date();
    const durationMinutes = Math.round((endTime - sessionStartTime) / 60000); // Convert ms to minutes

    // Don't submit if session was too short (less than 10 seconds)
    if (durationMinutes < 0.17) {
      console.log('⏭️ Session too short, skipping submission');
      return;
    }

    const sessionData = {
      startedAt: sessionStartTime.toISOString(),
      endedAt: endTime.toISOString(),
      durationMinutes: Math.max(1, durationMinutes), // Minimum 1 minute
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      readingMode: 'intentional', // Focus Zen Mode is always intentional reading
      topic: {
        id: article.category?.toLowerCase() || 'general',
        name: article.category || 'General'
      },
      source: {
        name: article.source?.name || 'Unknown',
        tier: article.sourceScore >= 80 ? 'premium' : article.sourceScore >= 60 ? 'standard' : 'basic'
      },
      articleId: article.id || article.url,
      articleTitle: article.title,
      articleUrl: article.url,
      wordCount: article.content?.split(' ').length || 500,
      moodTag: 'focused', // Default mood for Focus Zen Mode (lowercase per schema)
      selfReportedAnxiety: Math.max(0, 100 - (article.anxietyScore || 50)), // Lower anxiety in focused reading
      completionRate: Math.min(100, scrollDepth),
      engagementEvents: engagementEvents.map(event => ({
        eventType: event.eventType,
        timestamp: event.timestamp.toISOString(),
        metadata: {}
      })),
      verifyUsed: engagementEvents.some(e => e.eventType === 'OPENED_VERIFY_HUB'),
      focusScore: Math.min(100, 70 + scrollDepth / 4) // Base 70 + bonus for scroll depth
    };

    try {
      console.log('📊 Submitting reading session...', sessionData);
      const response = await createReadingSession(sessionData);
      if (response.success) {
        console.log('✅ Reading session tracked successfully');
      }
    } catch (error) {
      console.error('❌ Error tracking reading session:', error);
      // Don't block closing if session tracking fails
    }
  }, [article, sessionStartTime, scrollDepth, engagementEvents]);

  // Handle close with session submission
  const handleClose = useCallback(async () => {
    await submitReadingSession();
    onClose();
  }, [submitReadingSession, onClose]);

  // Submit session when component unmounts or page closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable submission during page unload
      if (!sessionSubmitted.current) {
        const endTime = new Date();
        const durationMinutes = Math.round((endTime - sessionStartTime) / 60000);

        if (durationMinutes >= 0.17) { // At least 10 seconds
          const sessionData = {
            startedAt: sessionStartTime.toISOString(),
            endedAt: endTime.toISOString(),
            durationMinutes: Math.max(1, durationMinutes),
            device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            readingMode: 'intentional',
            topic: {
              id: article.category?.toLowerCase() || 'general',
              name: article.category || 'General'
            },
            source: {
              name: article.source?.name || 'Unknown',
              tier: article.sourceScore >= 80 ? 'premium' : article.sourceScore >= 60 ? 'standard' : 'basic'
            },
            articleId: article.id || article.url,
            articleTitle: article.title,
            articleUrl: article.url,
            wordCount: article.content?.split(' ').length || 500,
            moodTag: 'focused',
            selfReportedAnxiety: Math.max(0, 100 - (article.anxietyScore || 50)),
            completionRate: Math.min(100, scrollDepth),
            engagementEvents: engagementEvents.map(event => ({
              eventType: event.eventType,
              timestamp: event.timestamp.toISOString(),
              metadata: {}
            })),
            verifyUsed: engagementEvents.some(e => e.eventType === 'OPENED_VERIFY_HUB'),
            focusScore: Math.min(100, 70 + scrollDepth / 4)
          };

          // Use fetch with keepalive for reliable submission during unload
          const token = localStorage.getItem('token');
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

          fetch(`${API_BASE_URL}/api/analytics/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(sessionData),
            keepalive: true, // Ensures request completes even if page is closing
            credentials: 'include'
          }).catch(err => {
            console.error('Failed to submit session during unload:', err);
          });

          sessionSubmitted.current = true;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also submit on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Submit when component unmounts
    };
  }, [article, sessionStartTime, scrollDepth, engagementEvents]);

  // Optimized Text-to-Speech with proper pause/resume - reads title + preview
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (!utteranceRef.current) {
        // Combine title and preview paragraph for reading
        const previewText =
          article.description ||
          article.currentSummary?.substring(0, 300) + "...";
        const fullText = `${article.title}. ${previewText}`;

        utteranceRef.current = new SpeechSynthesisUtterance(fullText);
        utteranceRef.current.rate = 0.9;
        utteranceRef.current.pitch = 1;
        utteranceRef.current.volume = 1;
        utteranceRef.current.onend = () => setIsPlaying(false);
      }
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  }, [isPlaying, article]);

  // Toggle AI module accordion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent double-clicks

    setIsSaving(true);

    try {
      if (isSaved) {
        // Unsave the article
        const response = await userAPI.unsaveArticle(article.url);
        if (response.success) {
          setIsSaved(false);
          console.log("✅ Article unsaved successfully");
        }
      } else {
        // Save the article
        const articleData = {
          title: article.title,
          description: article.description || article.currentSummary,
          url: article.url,
          imageUrl: article.imageUrl,
          source: article.source,
          category: article.category || "general",
          publishedAt: article.publishedAt,
          author: article.author,
          content: article.content,
        };

        const response = await userAPI.saveArticle(articleData);
        if (response.success) {
          setIsSaved(true);
          console.log("✅ Article saved successfully");
        }
      }
    } catch (error) {
      console.error("❌ Error saving/unsaving article:", error);
      // Optionally show error message to user
      alert(
        isSaved
          ? "Failed to remove article from saved items. Please try again."
          : "Failed to save article. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Share functionality
  const shareOptions = [
    {
      name: "Twitter",
      icon: FiTwitter,
      onClick: () => {
        const text = `${article.title} - via NewsAI`;
        const url = window.location.href;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        setShowShareMenu(false);
      },
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
        setShowShareMenu(false);
      },
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
        setShowShareMenu(false);
      },
    },
    {
      name: "Email",
      icon: FiMail,
      onClick: () => {
        const subject = encodeURIComponent(article.title);
        const body = encodeURIComponent(
          `Check out this article: ${article.title}\n\n${window.location.href}`
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setShowShareMenu(false);
      },
    },
    {
      name: "Copy Link",
      icon: FiLink,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => {
          setCopiedLink(false);
          setShowShareMenu(false);
        }, 2000);
      },
    },
  ];

  // Font size classes
  const fontSizeClasses = {
    small: "text-base",
    normal: "text-lg",
    large: "text-xl",
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Sticky Header with Actions */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo/Branding */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-blue-600 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">NewsAI</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setFontSize("small")}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  fontSize === "small"
                    ? "bg-white text-brand-blue shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("normal")}
                className={`px-2 py-1 rounded text-sm font-semibold transition-colors ${
                  fontSize === "normal"
                    ? "bg-white text-brand-blue shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-2 py-1 rounded text-base font-semibold transition-colors ${
                  fontSize === "large"
                    ? "bg-white text-brand-blue shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                A
              </button>
            </div>

            {/* Listen Button */}
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label={isPlaying ? "Stop reading" : "Listen to article"}
            >
              {isPlaying ? (
                <FiVolumeX className="w-5 h-5 text-gray-700" />
              ) : (
                <FiVolume2 className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Share Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Share article"
              >
                <FiShare2 className="w-5 h-5 text-gray-700" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-30">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={option.onClick}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                    >
                      <option.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        {option.name}
                      </span>
                    </button>
                  ))}
                  {copiedLink && (
                    <div className="px-4 py-2 text-xs text-green-600 font-medium">
                      Link copied!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={isSaved ? "Remove bookmark" : "Save article"}
              title={
                isSaving
                  ? "Saving..."
                  : isSaved
                  ? "Remove from saved articles"
                  : "Save article"
              }
            >
              <FiBookmark
                className={`w-5 h-5 ${
                  isSaved ? "fill-brand-blue text-brand-blue" : "text-gray-700"
                } ${isSaving ? "animate-pulse" : ""}`}
              />
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Close reading mode"
            >
              <FiX className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-brand-blue/10 text-brand-blue text-sm font-bold uppercase tracking-wider rounded">
              {article.category}
            </span>
          </div>

          {/* Article Header - Title First */}
          <header className="mb-8 px-0">
            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-4 mb-8">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  By {article.author || article.source.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                <span>{article.publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Hero Image - After Title */}
          {article.imageUrl && (
            <figure className="mb-8 -mx-8">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </figure>
          )}

          {/* Article Preview - Short 3-4 Line Summary */}
          <article
            className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]} mb-12`}
          >
            <p className="text-gray-700 leading-relaxed text-lg">
              {article.description ||
                article.currentSummary?.substring(0, 300) + "..."}
            </p>
          </article>

          {/* AI-Powered Insights Accordion */}
          <div className="my-12 space-y-4">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights</h2>
              <p className="text-gray-600">Click any section below to reveal AI-generated analysis</p>
            </div>

            {/* Explain Module */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleModule('explain')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white">
                    <FiBookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Explain (ELI5)</h3>
                    <p className="text-sm text-gray-600">Simplified explanation of complex topics</p>
                  </div>
                </div>
                {expandedModules.explain ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div className={`border-t border-gray-200 p-5 bg-gray-50 ${expandedModules.explain ? 'block' : 'hidden'}`}>
                <ExplainModule article={article} onClose={() => toggleModule('explain')} />
              </div>
            </div>

            {/* Market Impact Module */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleModule('market')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Market Impact</h3>
                    <p className="text-sm text-gray-600">Financial and economic implications</p>
                  </div>
                </div>
                {expandedModules.market ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div className={`border-t border-gray-200 p-5 bg-gray-50 ${expandedModules.market ? 'block' : 'hidden'}`}>
                <MarketImpactModule article={article} onClose={() => toggleModule('market')} />
              </div>
            </div>

            {/* Context Timeline Module */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleModule('context')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Historical Context</h3>
                    <p className="text-sm text-gray-600">Timeline and background information</p>
                  </div>
                </div>
                {expandedModules.context ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div className={`border-t border-gray-200 p-5 bg-gray-50 ${expandedModules.context ? 'block' : 'hidden'}`}>
                <ContextTimelineModule article={article} onClose={() => toggleModule('context')} />
              </div>
            </div>

            {/* Perspectives Module */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleModule('perspectives')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Different Perspectives</h3>
                    <p className="text-sm text-gray-600">Multiple viewpoints on this topic</p>
                  </div>
                </div>
                {expandedModules.perspectives ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div className={`border-t border-gray-200 p-5 bg-gray-50 ${expandedModules.perspectives ? 'block' : 'hidden'}`}>
                <PerspectivesModule article={article} onClose={() => toggleModule('perspectives')} />
              </div>
            </div>
          </div>

          {/* Premium Subscription Paywall */}
          <div className="my-16 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-10 text-center shadow-lg">
            <div className="max-w-2xl mx-auto">
              {/* Lock Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-full mb-6">
                <FiStar className="w-8 h-8 text-white" />
              </div>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Continue Reading with NewsAI Pro
              </h2>

              {/* Subheadline */}
              <p className="text-lg text-gray-600 mb-8">
                Get unlimited access to in-depth analysis, AI-powered insights,
                and ad-free reading experience.
              </p>

              {/* Benefits List */}
              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Unlimited Articles
                    </p>
                    <p className="text-sm text-gray-600">
                      Read as much as you want
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI Analysis</p>
                    <p className="text-sm text-gray-600">
                      Deep insights & context
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ad-Free</p>
                    <p className="text-sm text-gray-600">
                      Distraction-free reading
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    // TODO: Implement subscription flow
                    alert(
                      "Redirecting to subscription page...\n\nPro Plan: $9.99/month\n✓ Unlimited articles\n✓ AI-powered insights\n✓ Ad-free experience\n✓ Offline reading\n✓ Priority support"
                    );
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Subscribe for $9.99/month
                </button>
                <button
                  onClick={() => {
                    // TODO: Show login modal
                    alert("Already a subscriber? Sign in to continue reading.");
                  }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Sign In
                </button>
              </div>

              {/* Fine Print */}
              <p className="text-xs text-gray-500 mt-6">
                Cancel anytime. First 7 days free for new subscribers.
              </p>
            </div>
          </div>

          {/* Read Full Article Button */}
          {article.url && (
            <div className="my-12 text-center">
              <button
                onClick={() =>
                  window.open(article.url, "_blank", "noopener,noreferrer")
                }
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <FiExternalLink className="w-5 h-5" />
                <span>
                  Read Full Article at {article.source?.name || "Source"}
                </span>
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Opens original article in a new tab
              </p>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <footer className="mt-16 pt-8 border-t-2 border-gray-900">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                More to Explore
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 3).map((related) => (
                  <div
                    key={related.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      // Switch to this article - would need to be implemented in parent
                      console.log("Switch to article:", related.id);
                    }}
                  >
                    <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-brand-blue transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      {related.source.name}
                    </p>
                  </div>
                ))}
              </div>
            </footer>
          )}

          {/* Spacing for bottom padding */}
          <div className="h-16"></div>
        </div>
      </div>
    </div>
  );
};

// Wrap component with memo for performance
export default React.memo(FocusZenMode);
