import React, { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

// Hardcoded API URL for deployment
const API_URL = 'https://learning-platform-backend-knkr.onrender.com';

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Simulate IP address for demo purposes
  const getSimulatedIP = () => {
    const ips = [
      '10.167.9.55', '103.21.126.80', '10.96.2.53', '49.36.121.136',
      '10.17.35.67', '152.58.44.236', '10.96.1.203', '192.168.1.100'
    ];
    return ips[Math.floor(Math.random() * ips.length)];
  };

  // Get current timestamp in the required format
  const getCurrentTimestamp = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  // Enhanced event tracking with proper format
  const trackEvent = (eventData) => {
    if (!isAuthenticated || !user) {
      console.log('Analytics: User not authenticated, skipping event');
      return;
    }

    const baseEvent = {
      timestamp: getCurrentTimestamp(),
      user_id: user?.id || null,
      username: user?.username || 'anonymous',
      ip_address: getSimulatedIP(),
      user_agent: navigator.userAgent,
      origin: 'web',
      ...eventData
    };

    console.log('📊 Analytics Event:', baseEvent);
    sendEventToBackend(baseEvent);
  };

  // Specific tracking functions
  const trackPageView = (pageName, pageContext = '') => {
    trackEvent({
      event_context: pageContext || 'System',
      component: 'Navigation',
      event_name: 'Page viewed',
      description: `User ${user?.username || 'anonymous'} viewed the ${pageName} page`,
      page_name: pageName,
      navigation_type: 'page_view'
    });
  };

  const trackCourseView = (courseId, courseTitle) => {
    trackEvent({
      event_context: `Course: ${courseTitle}`,
      component: 'System',
      event_name: 'Course viewed',
      description: `User ${user?.username || 'anonymous'} viewed the course with id '${courseId}'`,
      course_id: courseId,
      course_title: courseTitle,
      content_type: 'course'
    });
  };

  const trackContentModuleView = (contentId, contentTitle, contentType, courseTitle) => {
    trackEvent({
      event_context: `Course: ${courseTitle}`,
      component: contentType === 'quiz' ? 'Quiz' : 'Content',
      event_name: `${contentType} viewed`,
      description: `User ${user?.username || 'anonymous'} viewed the ${contentType} '${contentTitle}' in course '${courseTitle}'`,
      content_id: contentId,
      content_title: contentTitle,
      content_type: contentType,
      course_title: courseTitle
    });
  };

  const trackVideoAction = (action, videoTitle, courseTitle, timeSpent = 0) => {
    trackEvent({
      event_context: `Course: ${courseTitle}`,
      component: 'Video',
      event_name: `Video ${action}`,
      description: `User ${user?.username || 'anonymous'} ${action} the video '${videoTitle}'`,
      video_title: videoTitle,
      course_title: courseTitle,
      action: action,
      time_spent: timeSpent,
      content_type: 'video'
    });
  };

  const trackQuizAttempt = (quizTitle, courseTitle, score, totalQuestions, timeSpent = 0) => {
    trackEvent({
      event_context: `Course: ${courseTitle}`,
      component: 'Quiz',
      event_name: 'Quiz attempted',
      description: `User ${user?.username || 'anonymous'} attempted the quiz '${quizTitle}' with score ${score}/${totalQuestions}`,
      quiz_title: quizTitle,
      course_title: courseTitle,
      score: score,
      total_questions: totalQuestions,
      progress_percentage: Math.round((score / totalQuestions) * 100),
      time_spent: timeSpent,
      content_type: 'quiz'
    });
  };

  const trackProgressUpdate = (contentTitle, courseTitle, isCompleted, timeSpent = 0) => {
    trackEvent({
      event_context: `Course: ${courseTitle}`,
      component: 'Progress',
      event_name: isCompleted ? 'Content completed' : 'Progress updated',
      description: `User ${user?.username || 'anonymous'} ${isCompleted ? 'completed' : 'updated progress on'} '${contentTitle}'`,
      content_title: contentTitle,
      course_title: courseTitle,
      action: isCompleted ? 'mark_complete' : 'progress_update',
      time_spent: timeSpent,
      success: true
    });
  };

  const trackButtonClick = (buttonName, pageName, context = '') => {
    trackEvent({
      event_context: context || 'System',
      component: 'Button',
      event_name: 'Button clicked',
      description: `User ${user?.username || 'anonymous'} clicked the '${buttonName}' button on ${pageName}`,
      button_name: buttonName,
      page_name: pageName,
      action: 'button_click'
    });
  };

  const trackFormSubmission = (formName, pageName, success = true) => {
    trackEvent({
      event_context: 'System',
      component: 'Form',
      event_name: 'Form submitted',
      description: `User ${user?.username || 'anonymous'} submitted the '${formName}' form on ${pageName}`,
      form_name: formName,
      page_name: pageName,
      action: 'form_submission',
      success: success
    });
  };

  const trackNavigation = (fromPage, toPage, navigationType = 'link') => {
    trackEvent({
      event_context: 'System',
      component: 'Navigation',
      event_name: 'Navigation',
      description: `User ${user?.username || 'anonymous'} navigated from '${fromPage}' to '${toPage}'`,
      navigation_type: navigationType,
      from_page: fromPage,
      to_page: toPage,
      action: 'navigation'
    });
  };

  const trackSearch = (searchTerm, resultsCount = 0) => {
    trackEvent({
      event_context: 'System',
      component: 'Search',
      event_name: 'Search performed',
      description: `User ${user?.username || 'anonymous'} searched for '${searchTerm}'`,
      search_term: searchTerm,
      search_results: resultsCount,
      action: 'search'
    });
  };

  const trackError = (errorType, errorMessage, pageName) => {
    trackEvent({
      event_context: 'System',
      component: 'Error',
      event_name: 'Error occurred',
      description: `User ${user?.username || 'anonymous'} encountered a ${errorType} error on ${pageName}`,
      error_type: errorType,
      error_message: errorMessage,
      page_name: pageName,
      action: 'error'
    });
  };

  const trackLogin = (success = true, errorMessage = '') => {
    trackEvent({
      event_context: 'System',
      component: 'Authentication',
      event_name: success ? 'User logged in' : 'Login failed',
      description: success 
        ? `User ${user?.username || 'anonymous'} logged in successfully`
        : `Login failed for user: ${errorMessage}`,
      action: 'login',
      success: success,
      error_message: errorMessage
    });
  };

  const trackLogout = () => {
    trackEvent({
      event_context: 'System',
      component: 'Authentication',
      event_name: 'User logged out',
      description: `User ${user?.username || 'anonymous'} logged out`,
      action: 'logout',
      success: true
    });
  };

  // Send event to backend with delay to prevent rate limiting
  const sendEventToBackend = async (eventData) => {
    setTimeout(async () => {
      try {
        const response = await axios.post(`${API_URL}/api/analytics/events`, eventData);
        console.log('✅ Analytics event sent successfully:', eventData.event_name);
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 429) {
          console.log('⚠️ Analytics event skipped (rate limited or endpoint not found)');
        } else {
          console.error('❌ Failed to send analytics event:', error);
        }
      }
    }, 500); // 500ms delay to prevent rate limiting
  };

  // Track page views automatically
  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPage = window.location.pathname;
      trackPageView(currentPage);
    }
  }, [isAuthenticated, user]);

  const value = {
    trackEvent,
    trackPageView,
    trackCourseView,
    trackContentModuleView,
    trackVideoAction,
    trackQuizAttempt,
    trackProgressUpdate,
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackSearch,
    trackError,
    trackLogin,
    trackLogout
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 