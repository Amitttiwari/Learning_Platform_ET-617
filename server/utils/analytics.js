const { db } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

// Track user events for clickstream analytics
function trackEvent(eventData) {
  const {
    user_id,
    session_id,
    event_type,
    event_name,
    component,
    description,
    page_url,
    course_id,
    content_id,
    event_data,
    ip_address,
    user_agent,
    origin = 'web'
  } = eventData;

  const sessionId = session_id || uuidv4();

  const query = `
    INSERT INTO clickstream_events (
      user_id, session_id, event_type, event_name, component, description,
      page_url, course_id, content_id, event_data, ip_address, user_agent, origin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    user_id || null,
    sessionId,
    event_type,
    event_name,
    component || null,
    description || null,
    page_url || null,
    course_id || null,
    content_id || null,
    event_data ? JSON.stringify(event_data) : null,
    ip_address || null,
    user_agent || null,
    origin
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Error tracking event:', err);
    } else {
      console.log(`Event tracked: ${event_type} - ${event_name}`);
    }
  });
}

// Track page view
function trackPageView(userId, pageUrl, component, description, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Page',
    event_name: 'Page viewed',
    component,
    description,
    page_url: pageUrl,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track course view
function trackCourseView(userId, courseId, courseTitle, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Course',
    event_name: 'Course viewed',
    component: 'Course',
    description: `User viewed course: ${courseTitle}`,
    course_id: courseId,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track content view
function trackContentView(userId, contentId, contentType, contentTitle, courseId, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Content',
    event_name: 'Content viewed',
    component: contentType.charAt(0).toUpperCase() + contentType.slice(1),
    description: `User viewed ${contentType}: ${contentTitle}`,
    content_id: contentId,
    course_id: courseId,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track video interaction
function trackVideoInteraction(userId, contentId, action, videoData, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Video',
    event_name: `Video ${action}`,
    component: 'Video Player',
    description: `Video ${action}: ${videoData.title || 'Unknown video'}`,
    content_id: contentId,
    event_data: videoData,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track quiz interaction
function trackQuizInteraction(userId, contentId, action, quizData, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Quiz',
    event_name: `Quiz ${action}`,
    component: 'Quiz',
    description: `Quiz ${action}: ${quizData.title || 'Unknown quiz'}`,
    content_id: contentId,
    event_data: quizData,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track button click
function trackButtonClick(userId, buttonName, component, pageUrl, additionalData, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Interaction',
    event_name: 'Button clicked',
    component,
    description: `Button clicked: ${buttonName}`,
    page_url: pageUrl,
    event_data: additionalData,
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Track form submission
function trackFormSubmission(userId, formName, component, success, ipAddress, userAgent) {
  trackEvent({
    user_id: userId,
    event_type: 'Form',
    event_name: 'Form submitted',
    component,
    description: `Form submitted: ${formName} (${success ? 'success' : 'failed'})`,
    event_data: { formName, success },
    ip_address: ipAddress,
    user_agent: userAgent
  });
}

// Get analytics data for dashboard
function getAnalyticsData(userId = null, startDate = null, endDate = null) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        event_type,
        event_name,
        component,
        COUNT(*) as count,
        DATE(timestamp) as date
      FROM clickstream_events
      WHERE 1=1
    `;
    
    const params = [];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (startDate) {
      query += ' AND DATE(timestamp) >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND DATE(timestamp) <= ?';
      params.push(endDate);
    }
    
    query += ' GROUP BY event_type, event_name, component, DATE(timestamp) ORDER BY date DESC, count DESC';
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get user activity summary
function getUserActivitySummary(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT DATE(timestamp)) as active_days,
        MIN(timestamp) as first_activity,
        MAX(timestamp) as last_activity,
        COUNT(CASE WHEN event_type = 'Course' THEN 1 END) as course_views,
        COUNT(CASE WHEN event_type = 'Content' THEN 1 END) as content_views,
        COUNT(CASE WHEN event_type = 'Quiz' THEN 1 END) as quiz_attempts,
        COUNT(CASE WHEN event_type = 'Video' THEN 1 END) as video_interactions
      FROM clickstream_events
      WHERE user_id = ?
    `;
    
    db.get(query, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Get course analytics
function getCourseAnalytics(courseId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        event_type,
        event_name,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users,
        DATE(timestamp) as date
      FROM clickstream_events
      WHERE course_id = ?
      GROUP BY event_type, event_name, DATE(timestamp)
      ORDER BY date DESC, count DESC
    `;
    
    db.all(query, [courseId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  trackEvent,
  trackPageView,
  trackCourseView,
  trackContentView,
  trackVideoInteraction,
  trackQuizInteraction,
  trackButtonClick,
  trackFormSubmission,
  getAnalyticsData,
  getUserActivitySummary,
  getCourseAnalytics
}; 