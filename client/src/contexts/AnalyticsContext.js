import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

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
    trackPageView,
    trackContentView,
    trackVideoInteraction,
    trackQuizInteraction,
    trackProgressUpdate,
    trackButtonClick,
    trackFormSubmission,
    getEvents,
    clearEvents
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 