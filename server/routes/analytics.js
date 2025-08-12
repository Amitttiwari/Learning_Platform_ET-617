const express = require('express');
const { authenticateToken } = require('./auth');
const { 
  getAnalyticsData, 
  getUserActivitySummary, 
  getCourseAnalytics 
} = require('../utils/analytics');
const { db } = require('../database/init');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users' analytics (admin only)
router.get('/admin/all-users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id as user_id,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.created_at,
        u.last_login,
        COUNT(ce.id) as total_events,
        COUNT(DISTINCT ce.event_name) as unique_events,
        MAX(ce.timestamp) as last_activity
      FROM users u
      LEFT JOIN clickstream_events ce ON u.id = ce.user_id
      GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.created_at, u.last_login
      ORDER BY u.created_at DESC
    `;
    
    db.all(query, (err, users) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ users });
    });
  } catch (error) {
    console.error('Error fetching all users analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all clickstream events (admin only)
router.get('/admin/all-events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 100, user_id, event_type, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (user_id) {
      whereClause += ' AND ce.user_id = ?';
      params.push(user_id);
    }
    
    if (event_type) {
      whereClause += ' AND ce.event_name LIKE ?';
      params.push(`%${event_type}%`);
    }
    
    if (start_date) {
      whereClause += ' AND ce.timestamp >= ?';
      params.push(start_date);
    }
    
    if (end_date) {
      whereClause += ' AND ce.timestamp <= ?';
      params.push(end_date);
    }
    
    const query = `
      SELECT 
        ce.*,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.role
      FROM clickstream_events ce
      LEFT JOIN users u ON ce.user_id = u.id
      ${whereClause}
      ORDER BY ce.timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), offset);
    
    db.all(query, params, (err, events) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) as total
        FROM clickstream_events ce
        LEFT JOIN users u ON ce.user_id = u.id
        ${whereClause}
      `;
      
      db.get(countQuery, params.slice(0, -2), (err, countResult) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          events,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export all analytics data as CSV (admin only)
router.get('/admin/export-all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Export request from user:', req.user.username, 'Role:', req.user.role);
    
    const query = `
      SELECT 
        ce.timestamp as "Time",
        ce.event_context as "Event context",
        ce.component as "Component",
        ce.event_name as "Event name",
        ce.description as "Description",
        ce.origin as "Origin",
        ce.ip_address as "IP address",
        u.username as "Username",
        u.email as "User Email",
        u.role as "User Role",
        ce.course_title as "Course Title",
        ce.content_type as "Content Type",
        ce.action as "Action",
        ce.score as "Score",
        ce.progress_percentage as "Progress %",
        ce.time_spent as "Time Spent (seconds)",
        ce.button_name as "Button Name",
        ce.form_name as "Form Name",
        ce.success as "Success",
        ce.navigation_type as "Navigation Type",
        ce.from_page as "From Page",
        ce.to_page as "To Page",
        ce.search_term as "Search Term",
        ce.search_results as "Search Results",
        ce.error_type as "Error Type",
        ce.error_message as "Error Message"
      FROM clickstream_events ce
      LEFT JOIN users u ON ce.user_id = u.id
      ORDER BY ce.timestamp DESC
    `;
    
    db.all(query, (err, events) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log('Found events:', events.length);
      
      if (events.length === 0) {
        return res.status(404).json({ error: 'No events found' });
      }
      
      // Convert to CSV
      const headers = Object.keys(events[0]);
      const csvContent = [
        headers.join(','),
        ...events.map(event => 
          headers.map(header => {
            const value = event[header];
            // Escape commas and quotes in CSV
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ].join('\n');
      
      console.log('CSV content length:', csvContent.length);
      
      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="all_analytics_${new Date().toISOString().split('T')[0]}.csv"`);
      
      res.send(csvContent);
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics summary for admin dashboard
router.get('/admin/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get total users
    db.get('SELECT COUNT(*) as total_users FROM users', (err, userCount) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get total events
      db.get('SELECT COUNT(*) as total_events FROM clickstream_events', (err, eventCount) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Get events by type
        db.all(`
          SELECT event_name, COUNT(*) as count
          FROM clickstream_events
          GROUP BY event_name
          ORDER BY count DESC
          LIMIT 10
        `, (err, eventTypes) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          // Get recent activity
          db.all(`
            SELECT 
              ce.timestamp,
              ce.event_name,
              ce.description,
              u.username
            FROM clickstream_events ce
            LEFT JOIN users u ON ce.user_id = u.id
            ORDER BY ce.timestamp DESC
            LIMIT 20
          `, (err, recentActivity) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
              summary: {
                total_users: userCount.total_users,
                total_events: eventCount.total_events,
                event_types: eventTypes,
                recent_activity: recentActivity
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user progress
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const { courseId, contentId, progressPercentage, timeSpent, completed } = req.body;
    const userId = req.user.id;

    // Insert or update user progress
    const query = `
      INSERT OR REPLACE INTO user_progress 
      (user_id, course_id, content_id, progress_percentage, completed, time_spent_seconds, last_accessed)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(query, [userId, courseId, contentId, progressPercentage, completed ? 1 : 0, timeSpent || 0], function(err) {
      if (err) {
        console.error('Error updating progress:', err);
        return res.status(500).json({ error: 'Failed to update progress' });
      }

      res.json({ 
        success: true, 
        message: 'Progress updated successfully',
        progressId: this.lastID 
      });
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track individual analytics event
router.post('/events', async (req, res) => {
  try {
    const {
      event_type,
      event_name,
      component,
      description,
      page_url,
      course_id,
      content_id,
      content_title,
      content_type,
      course_title,
      course_context,
      action,
      score,
      progress_percentage,
      time_spent,
      button_name,
      form_name,
      success,
      event_data,
      navigation_type,
      from_page,
      to_page,
      search_term,
      search_results,
      error_type,
      error_message,
      user_agent,
      origin
    } = req.body;

    const event = {
      event_type: event_type || 'unknown',
      event_name: event_name || 'Unknown Event',
      component: component || '',
      description: description || '',
      page_url: page_url || '',
      course_id: course_id || '',
      content_id: content_id || '',
      content_title: content_title || '',
      content_type: content_type || '',
      course_title: course_title || '',
      course_context: course_context || '',
      action: action || '',
      score: score || null,
      progress_percentage: progress_percentage || null,
      time_spent: time_spent || 0,
      button_name: button_name || '',
      form_name: form_name || '',
      success: success || false,
      event_data: event_data || '',
      navigation_type: navigation_type || '',
      from_page: from_page || '',
      to_page: to_page || '',
      search_term: search_term || '',
      search_results: search_results || 0,
      error_type: error_type || '',
      error_message: error_message || '',
      user_agent: user_agent || '',
      origin: origin || 'web',
      timestamp: new Date().toISOString(),
      user_id: req.user?.id || 1 // Default to user 1 if not authenticated
    };

    const sql = `
      INSERT INTO clickstream_events (
        event_type, event_name, component, description, page_url, 
        course_id, content_id, content_title, content_type, course_title, course_context,
        action, score, progress_percentage, time_spent, button_name, form_name, 
        success, event_data, navigation_type, from_page, to_page, search_term, 
        search_results, error_type, error_message, user_agent, origin, timestamp, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      event.event_type, event.event_name, event.component, event.description, event.page_url,
      event.course_id, event.content_id, event.content_title, event.content_type, event.course_title, event.course_context,
      event.action, event.score, event.progress_percentage, event.time_spent, event.button_name, event.form_name,
      event.success, event.event_data, event.navigation_type, event.from_page, event.to_page, event.search_term,
      event.search_results, event.error_type, event.error_message, event.user_agent, event.origin, event.timestamp, event.user_id
    ];

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error inserting clickstream event:', err);
        return res.status(500).json({ error: 'Failed to track event' });
      }
      
      console.log('📊 Clickstream event tracked:', event.event_type, event.event_name);
      res.status(200).json({ 
        success: true, 
        message: 'Event tracked successfully',
        event_id: this.lastID 
      });
    });
  } catch (error) {
    console.error('Error in analytics events route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user events
router.get('/user/events', async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default to user 1 if not authenticated
    
    const sql = `
      SELECT * FROM clickstream_events 
      WHERE user_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 100
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error('Error fetching user events:', err);
        return res.status(500).json({ error: 'Failed to fetch events' });
      }
      
      res.json({ 
        success: true, 
        events: rows,
        count: rows.length 
      });
    });
  } catch (error) {
    console.error('Error in user events route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user analytics summary with individual progress tracking
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const period = req.query.period || '7d';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get comprehensive user analytics
    const analyticsQuery = `
      SELECT 
        COUNT(*) as total_events,
        SUM(CASE WHEN content_type = 'video' THEN time_spent ELSE 0 END) as total_time_spent,
        AVG(CASE WHEN content_type = 'quiz' AND score IS NOT NULL THEN score ELSE NULL END) as average_score,
        COUNT(DISTINCT CASE WHEN event_name = 'Content completed' THEN content_id END) as content_completed,
        COUNT(DISTINCT course_id) as courses_viewed,
        COUNT(DISTINCT CASE WHEN event_name = 'Quiz attempted' THEN content_id END) as quizzes_taken,
        MAX(timestamp) as last_activity
      FROM clickstream_events 
      WHERE user_id = ? AND timestamp >= ?
    `;
    
    // Get user's course progress
    const progressQuery = `
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.description as course_description,
        COUNT(cc.id) as total_content,
        COUNT(up.content_id) as completed_content,
        SUM(up.time_spent_seconds) as total_time_spent,
        MAX(up.last_accessed) as last_accessed
      FROM courses c
      LEFT JOIN course_content cc ON c.id = cc.course_id
      LEFT JOIN user_progress up ON cc.id = up.content_id AND up.user_id = ?
      WHERE c.is_published = 1
      GROUP BY c.id
      ORDER BY last_accessed DESC
    `;

    // Get recent achievements
    const achievementsQuery = `
      SELECT 
        event_name,
        content_title,
        course_title,
        timestamp,
        score,
        progress_percentage
      FROM clickstream_events 
      WHERE user_id = ? AND event_name IN ('Content completed', 'Quiz attempted', 'Course viewed')
      ORDER BY timestamp DESC
      LIMIT 10
    `;
    
    db.get(analyticsQuery, [userId, startDate.toISOString()], (err, analytics) => {
      if (err) {
        console.error('Error fetching analytics summary:', err);
        return res.status(500).json({ error: 'Failed to fetch analytics' });
      }
      
      db.all(progressQuery, [userId], (err, progress) => {
        if (err) {
          console.error('Error fetching progress:', err);
          return res.status(500).json({ error: 'Failed to fetch progress' });
        }
        
        db.all(achievementsQuery, [userId], (err, achievements) => {
          if (err) {
            console.error('Error fetching achievements:', err);
            return res.status(500).json({ error: 'Failed to fetch achievements' });
          }
          
          res.json({
            success: true,
            summary: {
              totalEvents: analytics.total_events || 0,
              totalTimeSpent: Math.round((analytics.total_time_spent || 0) / 60), // Convert to minutes
              averageScore: Math.round(analytics.average_score || 0),
              contentCompleted: analytics.content_completed || 0,
              coursesViewed: analytics.courses_viewed || 0,
              quizzesTaken: analytics.quizzes_taken || 0,
              lastActivity: analytics.last_activity
            },
            progress: progress.map(course => ({
              ...course,
              progressPercentage: course.total_content > 0 ? Math.round((course.completed_content / course.total_content) * 100) : 0,
              timeSpentMinutes: Math.round((course.total_time_spent || 0) / 60)
            })),
            achievements: achievements
          });
        });
      });
    });
  } catch (error) {
    console.error('Error in analytics summary route:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// Export analytics as CSV
router.get('/export', async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const format = req.query.format || 'csv';
    
    if (format !== 'csv') {
      return res.status(400).json({ error: 'Only CSV format is supported' });
    }

    const sql = `
      SELECT 
        timestamp as Time,
        event_type as "Event Type",
        event_name as "Event Name",
        component as Component,
        description as Description,
        page_url as "Page URL",
        course_id as "Course ID",
        content_id as "Content ID",
        event_data as "Event Data",
        user_agent as "User Agent",
        origin as Origin
      FROM clickstream_events 
      WHERE user_id = ? 
      ORDER BY timestamp DESC
    `;
    
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error('Error exporting analytics:', err);
        return res.status(500).json({ error: 'Failed to export analytics' });
      }
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No data to export' });
      }

      // Convert to CSV
      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(','),
        ...rows.map(row => 
          headers.map(header => {
            const value = row[header];
            return value ? `"${value.toString().replace(/"/g, '""')}"` : '""';
          }).join(',')
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="clickstream_analytics_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    });
  } catch (error) {
    console.error('Error in analytics export route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 