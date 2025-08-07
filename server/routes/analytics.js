const express = require('express');
const { authenticateToken } = require('./auth');
const { 
  getAnalyticsData, 
  getUserActivitySummary, 
  getCourseAnalytics 
} = require('../utils/analytics');
const { db } = require('../database/init');

const router = express.Router();

// Get user's own analytics data
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    const [analyticsData, activitySummary] = await Promise.all([
      getAnalyticsData(userId, startDate, endDate),
      getUserActivitySummary(userId)
    ]);

    res.json({
      analytics: analyticsData,
      summary: activitySummary
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get course analytics (for instructors)
router.get('/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if user is instructor for this course
    db.get(`
      SELECT instructor_id FROM courses WHERE id = ?
    `, [courseId], async (err, course) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (course.instructor_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const analyticsData = await getCourseAnalytics(courseId);
      res.json({ analytics: analyticsData });
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch course analytics' });
  }
});

// Get detailed clickstream events
router.get('/events', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { limit = 50, offset = 0, eventType, startDate, endDate } = req.query;

  let query = `
    SELECT 
      ce.*,
      c.title as course_title,
      cc.title as content_title,
      cc.content_type
    FROM clickstream_events ce
    LEFT JOIN courses c ON ce.course_id = c.id
    LEFT JOIN course_content cc ON ce.content_id = cc.id
    WHERE ce.user_id = ?
  `;
  
  const params = [userId];
  
  if (eventType) {
    query += ' AND ce.event_type = ?';
    params.push(eventType);
  }
  
  if (startDate) {
    query += ' AND DATE(ce.timestamp) >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND DATE(ce.timestamp) <= ?';
    params.push(endDate);
  }
  
  query += ' ORDER BY ce.timestamp DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, events) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ events });
  });
});

// Get quiz performance analytics
router.get('/quiz-performance', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT 
      qa.*,
      cc.title as quiz_title,
      c.title as course_title
    FROM quiz_attempts qa
    JOIN course_content cc ON qa.quiz_content_id = cc.id
    JOIN courses c ON cc.course_id = c.id
    WHERE qa.user_id = ?
    ORDER BY qa.completed_at DESC
  `;

  db.all(query, [userId], (err, attempts) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate performance metrics
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0;
    const bestScore = totalAttempts > 0 
      ? Math.max(...attempts.map(a => a.score)) 
      : 0;

    res.json({
      attempts,
      metrics: {
        totalAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        bestScore: Math.round(bestScore * 100) / 100
      }
    });
  });
});

// Get learning progress analytics
router.get('/progress', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT 
      up.*,
      c.title as course_title,
      cc.title as content_title,
      cc.content_type
    FROM user_progress up
    JOIN courses c ON up.course_id = c.id
    JOIN course_content cc ON up.content_id = cc.id
    WHERE up.user_id = ?
    ORDER BY up.last_accessed DESC
  `;

  db.all(query, [userId], (err, progress) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate progress metrics
    const totalContent = progress.length;
    const completedContent = progress.filter(p => p.completed).length;
    const averageProgress = totalContent > 0 
      ? progress.reduce((sum, p) => sum + p.progress_percentage, 0) / totalContent 
      : 0;
    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0);

    res.json({
      progress,
      metrics: {
        totalContent,
        completedContent,
        averageProgress: Math.round(averageProgress * 100) / 100,
        totalTimeSpent: Math.round(totalTimeSpent / 60) // Convert to minutes
      }
    });
  });
});

// Get system-wide analytics (admin only)
router.get('/system', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { startDate, endDate } = req.query;

  let dateFilter = '';
  const params = [];
  
  if (startDate && endDate) {
    dateFilter = 'WHERE DATE(timestamp) BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  const query = `
    SELECT 
      event_type,
      event_name,
      component,
      COUNT(*) as count,
      COUNT(DISTINCT user_id) as unique_users,
      DATE(timestamp) as date
    FROM clickstream_events
    ${dateFilter}
    GROUP BY event_type, event_name, component, DATE(timestamp)
    ORDER BY date DESC, count DESC
  `;

  db.all(query, params, (err, analytics) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ analytics });
  });
});

// Export clickstream data as CSV format
router.get('/export', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { format = 'json', startDate, endDate } = req.query;

  let query = `
    SELECT 
      timestamp,
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
      origin
    FROM clickstream_events
    WHERE user_id = ?
  `;
  
  const params = [userId];
  
  if (startDate) {
    query += ' AND DATE(timestamp) >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND DATE(timestamp) <= ?';
    params.push(endDate);
  }
  
  query += ' ORDER BY timestamp DESC';

  db.all(query, params, (err, events) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeader = 'Time,Event Type,Event Name,Component,Description,Page URL,Course ID,Content ID,Event Data,IP Address,User Agent,Origin\n';
      const csvRows = events.map(event => 
        `"${event.timestamp}","${event.event_type}","${event.event_name}","${event.component || ''}","${event.description || ''}","${event.page_url || ''}","${event.course_id || ''}","${event.content_id || ''}","${event.event_data || ''}","${event.ip_address || ''}","${event.user_agent || ''}","${event.origin}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="clickstream_data.csv"');
      res.send(csvHeader + csvRows);
    } else {
      res.json({ events });
    }
  });
});

module.exports = router; 