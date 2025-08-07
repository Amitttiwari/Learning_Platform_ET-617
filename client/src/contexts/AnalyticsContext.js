import React, { createContext, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (eventData) => {
    if (!user) return;

    try {
      await axios.post('/api/analytics/track', {
        ...eventData,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, [user]);

  const trackPageView = useCallback((pageUrl, component, description) => {
    trackEvent({
      eventType: 'Page',
      eventName: 'Page viewed',
      component,
      description,
      pageUrl,
    });
  }, [trackEvent]);

  const trackButtonClick = useCallback((buttonName, component, additionalData = {}) => {
    trackEvent({
      eventType: 'Interaction',
      eventName: 'Button clicked',
      component,
      description: `Button clicked: ${buttonName}`,
      eventData: additionalData,
    });
  }, [trackEvent]);

  const trackFormSubmission = useCallback((formName, component, success, formData = {}) => {
    trackEvent({
      eventType: 'Form',
      eventName: 'Form submitted',
      component,
      description: `Form submitted: ${formName} (${success ? 'success' : 'failed'})`,
      eventData: { formName, success, formData },
    });
  }, [trackEvent]);

  const trackCourseView = useCallback((courseId, courseTitle) => {
    trackEvent({
      eventType: 'Course',
      eventName: 'Course viewed',
      component: 'Course',
      description: `User viewed course: ${courseTitle}`,
      courseId,
    });
  }, [trackEvent]);

  const trackContentView = useCallback((contentId, contentType, contentTitle, courseId) => {
    trackEvent({
      eventType: 'Content',
      eventName: 'Content viewed',
      component: contentType.charAt(0).toUpperCase() + contentType.slice(1),
      description: `User viewed ${contentType}: ${contentTitle}`,
      contentId,
      courseId,
    });
  }, [trackEvent]);

  const trackVideoInteraction = useCallback((contentId, action, videoData = {}) => {
    trackEvent({
      eventType: 'Video',
      eventName: `Video ${action}`,
      component: 'Video Player',
      description: `Video ${action}: ${videoData.title || 'Unknown video'}`,
      contentId,
      eventData: videoData,
    });
  }, [trackEvent]);

  const trackQuizInteraction = useCallback((contentId, action, quizData = {}) => {
    trackEvent({
      eventType: 'Quiz',
      eventName: `Quiz ${action}`,
      component: 'Quiz',
      description: `Quiz ${action}: ${quizData.title || 'Unknown quiz'}`,
      contentId,
      eventData: quizData,
    });
  }, [trackEvent]);

  const trackProgressUpdate = useCallback((courseId, contentId, progressPercentage, timeSpent) => {
    trackEvent({
      eventType: 'Progress',
      eventName: 'Progress updated',
      component: 'Progress Tracker',
      description: `Progress updated: ${progressPercentage}%`,
      courseId,
      contentId,
      eventData: { progressPercentage, timeSpent },
    });
  }, [trackEvent]);

  const trackSearch = useCallback((searchTerm, resultsCount) => {
    trackEvent({
      eventType: 'Search',
      eventName: 'Search performed',
      component: 'Search',
      description: `Search for: ${searchTerm}`,
      eventData: { searchTerm, resultsCount },
    });
  }, [trackEvent]);

  const trackNavigation = useCallback((fromPage, toPage) => {
    trackEvent({
      eventType: 'Navigation',
      eventName: 'Page navigation',
      component: 'Navigation',
      description: `Navigated from ${fromPage} to ${toPage}`,
      eventData: { fromPage, toPage },
    });
  }, [trackEvent]);

  const trackError = useCallback((errorType, errorMessage, pageUrl) => {
    trackEvent({
      eventType: 'Error',
      eventName: 'Error occurred',
      component: 'Error Handler',
      description: `${errorType}: ${errorMessage}`,
      pageUrl,
      eventData: { errorType, errorMessage },
    });
  }, [trackEvent]);

  const value = {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
    trackCourseView,
    trackContentView,
    trackVideoInteraction,
    trackQuizInteraction,
    trackProgressUpdate,
    trackSearch,
    trackNavigation,
    trackError,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 