const express = require('express');
const { authenticateToken } = require('./auth');
const { db } = require('../database/init');
const { 
  trackCourseView, 
  trackContentView, 
  trackVideoInteraction, 
  trackQuizInteraction 
} = require('../utils/analytics');

const router = express.Router();

// Get all published courses
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.category,
      c.difficulty_level,
      c.created_at,
      u.first_name || ' ' || u.last_name as instructor_name,
      COUNT(cc.id) as content_count,
      COALESCE(up.progress_percentage, 0) as user_progress
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    LEFT JOIN course_content cc ON c.id = cc.course_id
    LEFT JOIN user_progress up ON c.id = up.course_id AND up.user_id = ?
    WHERE c.is_published = 1
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;

  db.all(query, [req.user.userId], (err, courses) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ courses });
  });
});

// Get course details with content
router.get('/:courseId', authenticateToken, (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId;

  // Get course details
  db.get(`
    SELECT 
      c.*,
      u.first_name || ' ' || u.last_name as instructor_name
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE c.id = ? AND c.is_published = 1
  `, [courseId], (err, course) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Track course view
    trackCourseView(userId, courseId, course.title, req.ip, req.get('User-Agent'));

    // Get course content
    db.all(`
      SELECT 
        cc.*,
        COALESCE(up.progress_percentage, 0) as user_progress,
        up.completed as user_completed,
        up.time_spent_seconds as user_time_spent
      FROM course_content cc
      LEFT JOIN user_progress up ON cc.id = up.content_id AND up.user_id = ?
      WHERE cc.course_id = ?
      ORDER BY cc.order_index
    `, [userId, courseId], (err, content) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        course,
        content
      });
    });
  });
});

// Get specific content item
router.get('/:courseId/content/:contentId', authenticateToken, (req, res) => {
  const { courseId, contentId } = req.params;
  const userId = req.user.userId;

  db.get(`
    SELECT 
      cc.*,
      c.title as course_title,
      COALESCE(up.progress_percentage, 0) as user_progress,
      up.completed as user_completed,
      up.time_spent_seconds as user_time_spent
    FROM course_content cc
    JOIN courses c ON cc.course_id = c.id
    LEFT JOIN user_progress up ON cc.id = up.content_id AND up.user_id = ?
    WHERE cc.id = ? AND cc.course_id = ? AND c.is_published = 1
  `, [userId, contentId, courseId], (err, content) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Track content view
    trackContentView(userId, contentId, content.content_type, content.title, courseId, req.ip, req.get('User-Agent'));

    // If it's a quiz, get the questions
    if (content.content_type === 'quiz') {
      db.all(`
        SELECT * FROM quiz_questions 
        WHERE content_id = ? 
        ORDER BY order_index
      `, [contentId], (err, questions) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          content,
          questions: questions.map(q => ({
            ...q,
            options: JSON.parse(q.options || '[]')
          }))
        });
      });
    } else {
      res.json({ content });
    }
  });
});

// Track video interaction
router.post('/:courseId/content/:contentId/video-interaction', authenticateToken, (req, res) => {
  const { courseId, contentId } = req.params;
  const { action, videoData } = req.body;
  const userId = req.user.userId;

  trackVideoInteraction(userId, contentId, action, videoData, req.ip, req.get('User-Agent'));

  res.json({ message: 'Video interaction tracked' });
});

// Submit quiz attempt
router.post('/:courseId/content/:contentId/quiz-submit', authenticateToken, (req, res) => {
  const { courseId, contentId } = req.params;
  const { answers, timeTaken } = req.body;
  const userId = req.user.userId;

  // Get quiz questions to calculate score
  db.all(`
    SELECT * FROM quiz_questions 
    WHERE content_id = ? 
    ORDER BY order_index
  `, [contentId], (err, questions) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;

    // Save quiz attempt
    db.run(`
      INSERT INTO quiz_attempts (
        user_id, quiz_content_id, score, total_questions, 
        correct_answers, time_taken_seconds, answers_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId, contentId, score, totalQuestions, 
      correctAnswers, timeTaken, JSON.stringify(answers)
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Track quiz interaction
      trackQuizInteraction(userId, contentId, 'completed', {
        score,
        totalQuestions,
        correctAnswers,
        timeTaken
      }, req.ip, req.get('User-Agent'));

      // Update user progress
      db.run(`
        INSERT OR REPLACE INTO user_progress (
          user_id, course_id, content_id, progress_percentage, 
          completed, time_spent_seconds, last_accessed
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, courseId, contentId, score, 1, timeTaken]);

      res.json({
        message: 'Quiz submitted successfully',
        score,
        totalQuestions,
        correctAnswers,
        timeTaken
      });
    });
  });
});

// Update user progress
router.post('/:courseId/content/:contentId/progress', authenticateToken, (req, res) => {
  const { courseId, contentId } = req.params;
  const { progressPercentage, timeSpent, completed } = req.body;
  const userId = req.user.userId;

  db.run(`
    INSERT OR REPLACE INTO user_progress (
      user_id, course_id, content_id, progress_percentage, 
      completed, time_spent_seconds, last_accessed
    ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `, [userId, courseId, contentId, progressPercentage, completed ? 1 : 0, timeSpent], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ message: 'Progress updated successfully' });
  });
});

// Get user progress for a course
router.get('/:courseId/progress', authenticateToken, (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.userId;

  db.all(`
    SELECT 
      cc.id as content_id,
      cc.title as content_title,
      cc.content_type,
      COALESCE(up.progress_percentage, 0) as progress_percentage,
      up.completed,
      up.time_spent_seconds,
      up.last_accessed
    FROM course_content cc
    LEFT JOIN user_progress up ON cc.id = up.content_id AND up.user_id = ?
    WHERE cc.course_id = ?
    ORDER BY cc.order_index
  `, [userId, courseId], (err, progress) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Calculate overall course progress
    const totalContent = progress.length;
    const completedContent = progress.filter(p => p.completed).length;
    const overallProgress = totalContent > 0 ? (completedContent / totalContent) * 100 : 0;

    res.json({
      progress,
      overallProgress,
      totalContent,
      completedContent
    });
  });
});

module.exports = router; 