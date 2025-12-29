import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import neuralAnalyticsAPI from '../services/neuralAnalyticsAPI';

const ActivityTrackingContext = createContext();

export const useActivityTracking = () => {
  const context = useContext(ActivityTrackingContext);
  if (!context) {
    throw new Error('useActivityTracking must be used within ActivityTrackingProvider');
  }
  return context;
};

export const ActivityTrackingProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessionId] = useState(() => crypto.randomUUID());
  const [activityQueue, setActivityQueue] = useState(() => {
    // Restore queue from sessionStorage on mount
    const stored = sessionStorage.getItem('activityQueue');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentPage, setCurrentPage] = useState('');
  const pageStartTimeRef = useRef(null);
  const flushTimerRef = useRef(null);
  const debounceTimersRef = useRef(new Map());

  // Detect device type
  const getDevice = useCallback(() => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }, []);

  // Add activity to queue
  const addToQueue = useCallback((activity) => {
    setActivityQueue((prev) => {
      const updated = [...prev, {
        ...activity,
        sessionId,
        timestamp: new Date().toISOString(),
        metadata: {
          ...activity.metadata,
          device: getDevice(),
        }
      }];

      // Persist to sessionStorage
      sessionStorage.setItem('activityQueue', JSON.stringify(updated));

      // Auto-flush if queue gets too large (200 max)
      if (updated.length >= 200) {
        setTimeout(() => flushQueue(), 0);
        return updated.slice(0, 200);
      }

      // Auto-flush if queue reaches 50 events
      if (updated.length >= 50) {
        setTimeout(() => flushQueue(), 0);
      }

      return updated;
    });
  }, [sessionId, getDevice]);

  // Flush activity queue to backend
  const flushQueue = useCallback(async () => {
    if (activityQueue.length === 0 || !user) return;

    const batch = [...activityQueue];

    try {
      await neuralAnalyticsAPI.logActivityBatch({
        sessionId,
        activities: batch
      });

      // Success: clear queue
      setActivityQueue([]);
      sessionStorage.removeItem('activityQueue');

      console.log(`✅ Flushed ${batch.length} activities`);
    } catch (error) {
      console.error('❌ Activity batch failed:', error);

      // Retry in 60 seconds
      setTimeout(flushQueue, 60000);
    }
  }, [activityQueue, sessionId, user]);

  // Auto-flush every 30 seconds
  useEffect(() => {
    if (!user) return;

    flushTimerRef.current = setInterval(() => {
      if (activityQueue.length > 0) {
        flushQueue();
      }
    }, 30000); // 30 seconds

    return () => {
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
      }
    };
  }, [flushQueue, activityQueue.length, user]);

  // Flush on page unload
  useEffect(() => {
    const handleUnload = () => {
      if (activityQueue.length > 0) {
        // Use sendBeacon for guaranteed delivery
        const blob = new Blob([JSON.stringify({
          sessionId,
          activities: activityQueue
        })], { type: 'application/json' });

        navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL}/api/analytics/activity/batch`,
          blob
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [activityQueue, sessionId]);

  // Track page visit
  const trackPageVisit = useCallback((pageName) => {
    setCurrentPage(pageName);
    pageStartTimeRef.current = Date.now();

    addToQueue({
      action: 'page_visit',
      page: pageName,
      duration: 0,
      metadata: {}
    });
  }, [addToQueue]);

  // Track page time spent (call on unmount)
  const trackPageTimeSpent = useCallback(() => {
    if (pageStartTimeRef.current && currentPage) {
      const duration = Math.floor((Date.now() - pageStartTimeRef.current) / 1000); // seconds

      if (duration > 0) {
        addToQueue({
          action: 'time_spent',
          page: currentPage,
          duration,
          metadata: {}
        });
      }
    }
  }, [currentPage, addToQueue]);

  // Track click with debouncing
  const trackClick = useCallback((elementType, elementId, elementText, metadata = {}) => {
    const key = `click-${elementType}-${elementId}`;

    // Clear existing debounce timer
    if (debounceTimersRef.current.has(key)) {
      clearTimeout(debounceTimersRef.current.get(key));
    }

    // Debounce clicks by 1 second
    const timer = setTimeout(() => {
      addToQueue({
        action: 'click',
        page: currentPage,
        duration: 0,
        metadata: {
          elementType,
          elementId,
          elementText,
          ...metadata
        }
      });

      debounceTimersRef.current.delete(key);
    }, 1000);

    debounceTimersRef.current.set(key, timer);
  }, [currentPage, addToQueue]);

  // Track topic click
  const trackTopicClick = useCallback((topicId, topicName, category) => {
    addToQueue({
      action: 'topic_click',
      page: currentPage,
      duration: 0,
      metadata: {
        topicId,
        topicName,
        category
      }
    });
  }, [currentPage, addToQueue]);

  // Track interest click
  const trackInterestClick = useCallback((category) => {
    addToQueue({
      action: 'interest_click',
      page: currentPage,
      duration: 0,
      metadata: {
        category
      }
    });
  }, [currentPage, addToQueue]);

  // Track news type click
  const trackNewsTypeClick = useCallback((newsType) => {
    addToQueue({
      action: 'news_type_click',
      page: currentPage,
      duration: 0,
      metadata: {
        newsType
      }
    });
  }, [currentPage, addToQueue]);

  const value = {
    sessionId,
    trackPageVisit,
    trackPageTimeSpent,
    trackClick,
    trackTopicClick,
    trackInterestClick,
    trackNewsTypeClick,
    flushQueue,
    activityQueue
  };

  return (
    <ActivityTrackingContext.Provider value={value}>
      {children}
    </ActivityTrackingContext.Provider>
  );
};

export default ActivityTrackingContext;
