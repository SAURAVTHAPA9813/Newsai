import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useActivityTracking } from '../context/ActivityTrackingContext';

/**
 * Custom hook for automatic activity tracking
 *
 * Features:
 * - Auto-tracks page visit on component mount
 * - Auto-tracks time spent on component unmount
 * - Provides helper functions for manual tracking
 * - Detects page name from router location
 *
 * @returns {Object} Activity tracking functions
 */
const useActivity = () => {
  const location = useLocation();
  const {
    trackPageVisit,
    trackPageTimeSpent,
    trackClick,
    trackTopicClick,
    trackInterestClick,
    trackNewsTypeClick,
    flushQueue
  } = useActivityTracking();

  // Map route paths to page names
  const getPageName = (pathname) => {
    const pageMap = {
      '/': 'dashboard',
      '/dashboard': 'dashboard',
      '/trending': 'trending',
      '/neural-analytics': 'neural_analytics',
      '/topic-matrix': 'topic_matrix',
      '/verify-hub': 'verify_hub',
      '/iq-lab': 'iqlab',
      '/iqlab': 'iqlab',
      '/profile': 'profile',
      '/settings': 'settings'
    };

    return pageMap[pathname] || 'other';
  };

  // Auto-track page visit on mount
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    trackPageVisit(pageName);

    // Track time spent on unmount
    return () => {
      trackPageTimeSpent();
    };
  }, [location.pathname, trackPageVisit, trackPageTimeSpent]);

  // Return tracking functions for manual use
  return {
    trackClick,
    trackTopicClick,
    trackInterestClick,
    trackNewsTypeClick,
    flushQueue
  };
};

export default useActivity;
