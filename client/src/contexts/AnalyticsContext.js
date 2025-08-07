import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Track course view
  const trackCourseView = (courseId, courseTitle, courseContext = '') => {
    const event = {
      event_type: 'course_view',
      event_name: 'Course viewed',
      component: 'Course',
      description: `User viewed course: ${courseTitle}`,
      course_id: courseId,
      course_title: courseTitle,
      course_context: courseContext,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Course View:', event);
    sendEventToBackend(event);
    addEvent(event);
  };

  // Track content module view
  const trackContentModuleView = (courseId, moduleId, moduleTitle, moduleType) => {
    const event = {
      event_type: 'content_module_view',
      event_name: 'Content module viewed',
      component: moduleType.charAt(0).toUpperCase() + moduleType.slice(1),
      description: `User viewed ${moduleType} module: ${moduleTitle}`,
      course_id: courseId,
      content_id: moduleId,
      content_title: moduleTitle,
      content_type: moduleType,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Content Module View:', event);
    sendEventToBackend(event);
    addEvent(event);
  };

  // Track page view
  const trackPageView = (pageName, pageUrl = window.location.href) => {
    const event = {
      event_type: 'page_view',
      event_name: `${pageName} viewed`,
      component: pageName,
      description: `User viewed ${pageName} page`,
      page_url: pageUrl,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Page View:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track content view
  const trackContentView = (courseId, contentId, contentTitle) => {
    const event = {
      event_type: 'content_view',
      event_name: 'Content viewed',
      component: 'CourseContent',
      description: `User viewed content: ${contentTitle}`,
      course_id: courseId,
      content_id: contentId,
      content_title: contentTitle,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Content View:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track video interaction
  const trackVideoInteraction = (courseId, contentId, action) => {
    const event = {
      event_type: 'video_interaction',
      event_name: 'Video interaction',
      component: 'VideoPlayer',
      description: `User ${action} video`,
      course_id: courseId,
      content_id: contentId,
      action: action,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Video Interaction:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track quiz interaction
  const trackQuizInteraction = (courseId, contentId, action, data = {}) => {
    const event = {
      event_type: 'quiz_interaction',
      event_name: 'Quiz interaction',
      component: 'Quiz',
      description: `User ${action} quiz`,
      course_id: courseId,
      content_id: contentId,
      action: action,
      score: data.score,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Quiz Interaction:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track progress update
  const trackProgressUpdate = (courseId, contentId, progressPercentage, timeSpent) => {
    const event = {
      event_type: 'progress_update',
      event_name: 'Progress updated',
      component: 'ProgressTracker',
      description: `User updated progress to ${progressPercentage}%`,
      course_id: courseId,
      content_id: contentId,
      progress_percentage: progressPercentage,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Progress Update:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track button click
  const trackButtonClick = (buttonName, component, data = {}) => {
    const event = {
      event_type: 'button_click',
      event_name: 'Button clicked',
      component: component,
      description: `User clicked ${buttonName} button`,
      button_name: buttonName,
      event_data: JSON.stringify(data),
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Button Click:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Track form submission
  const trackFormSubmission = (formName, component, success, data = {}) => {
    const event = {
      event_type: 'form_submission',
      event_name: 'Form submitted',
      component: component,
      description: `User submitted ${formName} form (${success ? 'success' : 'failed'})`,
      form_name: formName,
      success: success,
      event_data: JSON.stringify(data),
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Form Submission:', event);
    sendEventToBackend(event);
    addEvent(event);
  };

  // Track navigation
  const trackNavigation = (fromPage, toPage, navigationType = 'click') => {
    const event = {
      event_type: 'navigation',
      event_name: 'Page navigation',
      component: 'Navigation',
      description: `User navigated from ${fromPage} to ${toPage}`,
      navigation_type: navigationType,
      from_page: fromPage,
      to_page: toPage,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Navigation:', event);
    sendEventToBackend(event);
    addEvent(event);
  };

  // Track search
  const trackSearch = (searchTerm, searchResults = 0) => {
    const event = {
      event_type: 'search',
      event_name: 'Search performed',
      component: 'Search',
      description: `User searched for: ${searchTerm}`,
      search_term: searchTerm,
      search_results: searchResults,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Search:', event);
    sendEventToBackend(event);
    addEvent(event);
  };

  // Track error
  const trackError = (errorType, errorMessage, component) => {
    const event = {
      event_type: 'error',
      event_name: 'Error occurred',
      component: component,
      description: `Error: ${errorMessage}`,
      error_type: errorType,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      origin: 'web'
    };
    
    console.log('📊 Error:', event);
    sendEventToBackend(event);
    addEvent(event);
  };
  
  // Send event to backend
  const sendEventToBackend = async (event) => {
    try {
      await axios.post('/api/analytics/events', event);
    } catch (error) {
      console.error('Error sending event to backend:', error);
    }
  };
  
  // Add event to local state
  const addEvent = (event) => {
    setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
  };
  
  // Get all events
  const getEvents = () => {
    return events;
  };
  
  // Clear events
  const clearEvents = () => {
    setEvents([]);
  };

  const value = {
    trackCourseView,
    trackContentModuleView,
    trackPageView,
    trackContentView,
    trackVideoInteraction,
    trackQuizInteraction,
    trackProgressUpdate,
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackSearch,
    trackError,
    getEvents,
    clearEvents
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 