const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'learning_website.db');
const db = new sqlite3.Database(dbPath);

async function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          role TEXT DEFAULT 'learner',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME,
          is_active BOOLEAN DEFAULT 1
        )
      `);

      // Courses table
      db.run(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          instructor_id INTEGER,
          category TEXT,
          difficulty_level TEXT DEFAULT 'beginner',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_published BOOLEAN DEFAULT 0,
          FOREIGN KEY (instructor_id) REFERENCES users (id)
        )
      `);

      // Course content table
      db.run(`
        CREATE TABLE IF NOT EXISTS course_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          course_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content_type TEXT NOT NULL CHECK (content_type IN ('text', 'video', 'quiz', 'interactive')),
          content_data TEXT,
          video_url TEXT,
          order_index INTEGER DEFAULT 0,
          duration_minutes INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id)
        )
      `);

      // Quiz questions table
      db.run(`
        CREATE TABLE IF NOT EXISTS quiz_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content_id INTEGER NOT NULL,
          question_text TEXT NOT NULL,
          question_type TEXT DEFAULT 'multiple_choice',
          options TEXT, -- JSON string of options
          correct_answer TEXT,
          points INTEGER DEFAULT 1,
          order_index INTEGER DEFAULT 0,
          FOREIGN KEY (content_id) REFERENCES course_content (id)
        )
      `);

      // User progress table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          content_id INTEGER NOT NULL,
          progress_percentage REAL DEFAULT 0,
          completed BOOLEAN DEFAULT 0,
          time_spent_seconds INTEGER DEFAULT 0,
          last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (course_id) REFERENCES courses (id),
          FOREIGN KEY (content_id) REFERENCES course_content (id),
          UNIQUE(user_id, content_id)
        )
      `);

      // Clickstream tracking table
      db.run(`
        CREATE TABLE IF NOT EXISTS clickstream_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          event_name TEXT NOT NULL,
          component TEXT,
          description TEXT,
          page_url TEXT,
          course_id TEXT,
          content_id TEXT,
          content_title TEXT,
          content_type TEXT,
          course_title TEXT,
          course_context TEXT,
          action TEXT,
          score REAL,
          progress_percentage REAL,
          time_spent INTEGER,
          button_name TEXT,
          form_name TEXT,
          success BOOLEAN,
          event_data TEXT,
          navigation_type TEXT,
          from_page TEXT,
          to_page TEXT,
          search_term TEXT,
          search_results INTEGER,
          error_type TEXT,
          error_message TEXT,
          user_agent TEXT,
          origin TEXT DEFAULT 'web',
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,
          ip_address TEXT,
          session_id TEXT
        )
      `);

      // Quiz attempts table
      db.run(`
        CREATE TABLE IF NOT EXISTS quiz_attempts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          quiz_content_id INTEGER NOT NULL,
          score REAL,
          total_questions INTEGER,
          correct_answers INTEGER,
          time_taken_seconds INTEGER,
          answers_data TEXT, -- JSON string of user answers
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (quiz_content_id) REFERENCES course_content (id)
        )
      `);

      // Insert sample data
      insertSampleData()
        .then(() => {
          console.log('Database initialized with sample data');
          resolve();
        })
        .catch(reject);
    });
  });
}

async function insertSampleData() {
  return new Promise((resolve, reject) => {
    // Create sample admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ('admin', 'admin@learning.com', ?, 'Admin', 'User', 'admin')
    `, [adminPassword], function(err) {
      if (err) {
        console.error('Error inserting admin:', err);
        reject(err);
        return;
      }
      
      const adminId = this.lastID || 1;
      
      // Create sample instructor
      const instructorPassword = bcrypt.hashSync('instructor123', 10);
      db.run(`
        INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role)
        VALUES ('instructor', 'instructor@learning.com', ?, 'John', 'Doe', 'instructor')
      `, [instructorPassword], function(err) {
        if (err) {
          console.error('Error inserting instructor:', err);
          reject(err);
          return;
        }
        
        const instructorId = this.lastID || 2;
        
        // Create sample learner user
        const learnerPassword = bcrypt.hashSync('learner123', 10);
        db.run(`
          INSERT OR IGNORE INTO users (username, email, password_hash, first_name, last_name, role)
          VALUES ('ashwani', 'ashwani@example.com', ?, 'Ashwani', 'User', 'learner')
        `, [learnerPassword], function(err) {
          if (err) {
            console.error('Error inserting learner:', err);
            reject(err);
            return;
          }
          
          const learnerId = this.lastID || 3;
        
                    // Create sample course
          db.run(`
            INSERT OR IGNORE INTO courses (id, title, description, instructor_id, category, difficulty_level, is_published)
            VALUES (1, 'Complete Web Development Bootcamp', 'Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and become a full-stack developer.', ?, 'Programming', 'beginner', 1)
          `, [instructorId], function(err) {
          
            // Create sample content
            const sampleContent = [
              {
                course_id: 1,
                title: 'Welcome to Web Development Bootcamp',
                content_type: 'text',
                content_data: JSON.stringify({
                  text: 'Welcome to the Complete Web Development Bootcamp! This comprehensive course will take you from a complete beginner to a full-stack developer. You will learn HTML, CSS, JavaScript, React, and Node.js while building real-world projects.',
                  sections: [
                    {
                      title: 'What you will learn',
                      content: '• HTML5 structure and semantic elements\n• CSS3 styling, Flexbox, and Grid\n• JavaScript ES6+ fundamentals\n• React.js for frontend development\n• Node.js and Express for backend\n• Database integration with MongoDB\n• Deployment and hosting\n• Real-world project development'
                    },
                    {
                      title: 'Course Structure',
                      content: 'This bootcamp is divided into 8 comprehensive modules:\n1. HTML & CSS Fundamentals\n2. JavaScript Basics\n3. Advanced JavaScript\n4. React.js Frontend\n5. Node.js Backend\n6. Database Integration\n7. Full-Stack Projects\n8. Deployment & Career Prep'
                    },
                    {
                      title: 'Prerequisites',
                      content: 'No prior programming experience required! This course is designed for complete beginners. You just need:\n• A computer with internet access\n• Basic computer skills\n• Enthusiasm to learn!'
                    }
                  ]
                }),
                order_index: 1
              },
              {
                course_id: 1,
                title: 'HTML5 Fundamentals',
                content_type: 'video',
                video_url: 'https://www.youtube.com/embed/UB1O30fR-EE',
                content_data: JSON.stringify({
                  description: 'Master HTML5 fundamentals including semantic elements, forms, and modern web standards. Learn to create well-structured, accessible web pages.',
                  duration: '25 minutes',
                  topics: ['HTML5 semantic elements', 'Forms and validation', 'Accessibility best practices', 'SEO optimization']
                }),
                order_index: 2
              },
              {
                course_id: 1,
                title: 'CSS Fundamentals',
                content_type: 'video',
                video_url: 'https://www.youtube.com/embed/1PnVor36_40',
                content_data: JSON.stringify({
                  description: 'Learn CSS styling, selectors, and layout techniques.',
                  duration: '20 minutes'
                }),
                order_index: 3
              },
              {
                course_id: 1,
                title: 'JavaScript Basics',
                content_type: 'video',
                video_url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
                content_data: JSON.stringify({
                  description: 'Introduction to JavaScript programming fundamentals.',
                  duration: '25 minutes'
                }),
                order_index: 4
              },
              {
                course_id: 1,
                title: 'HTML Quiz',
                content_type: 'quiz',
                content_data: JSON.stringify({
                  description: 'Test your knowledge of HTML basics',
                  time_limit: 300
                }),
                order_index: 5
              },
              {
                course_id: 1,
                title: 'CSS Quiz',
                content_type: 'quiz',
                content_data: JSON.stringify({
                  description: 'Test your knowledge of CSS fundamentals',
                  time_limit: 300
                }),
                order_index: 6
              }
            ];
            
            sampleContent.forEach((content, index) => {
              db.run(`
                INSERT OR IGNORE INTO course_content (course_id, title, content_type, content_data, video_url, order_index)
                VALUES (?, ?, ?, ?, ?, ?)
              `, [content.course_id, content.title, content.content_type, content.content_data, content.video_url, content.order_index], function(err) {
                if (err) {
                  console.error('Error inserting content:', err);
                  reject(err);
                  return;
                }
                
                // If this is the quiz content, add sample questions
                if (content.content_type === 'quiz') {
                  const contentId = this.lastID || 3;
                  let sampleQuestions = [];
                  
                  // HTML Quiz Questions
                  if (content.title === 'HTML Quiz') {
                    sampleQuestions = [
                      {
                        content_id: contentId,
                        question_text: 'What does HTML stand for?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language']),
                        correct_answer: 'Hyper Text Markup Language',
                        points: 1,
                        order_index: 1
                      },
                      {
                        content_id: contentId,
                        question_text: 'Which HTML tag is used to define a paragraph?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['<p>', '<paragraph>', '<text>', '<div>']),
                        correct_answer: '<p>',
                        points: 1,
                        order_index: 2
                      },
                      {
                        content_id: contentId,
                        question_text: 'What is the correct HTML element for inserting a line break?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['<break>', '<lb>', '<br>', '<line>']),
                        correct_answer: '<br>',
                        points: 1,
                        order_index: 3
                      }
                    ];
                  }
                  
                  // CSS Quiz Questions
                  if (content.title === 'CSS Quiz') {
                    sampleQuestions = [
                      {
                        content_id: contentId,
                        question_text: 'What does CSS stand for?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets']),
                        correct_answer: 'Cascading Style Sheets',
                        points: 1,
                        order_index: 1
                      },
                      {
                        content_id: contentId,
                        question_text: 'Which CSS property controls the text size?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['font-size', 'text-size', 'font-style', 'text-style']),
                        correct_answer: 'font-size',
                        points: 1,
                        order_index: 2
                      },
                      {
                        content_id: contentId,
                        question_text: 'How do you add a background color for all <h1> elements?',
                        question_type: 'multiple_choice',
                        options: JSON.stringify(['h1 {background-color:#B2D6FF}', 'h1.all {background-color:#B2D6FF}', 'all.h1 {background-color:#B2D6FF}', 'h1 {bgcolor:#B2D6FF}']),
                        correct_answer: 'h1 {background-color:#B2D6FF}',
                        points: 1,
                        order_index: 3
                      }
                    ];
                  }
                  
                  sampleQuestions.forEach(question => {
                    db.run(`
                      INSERT OR IGNORE INTO quiz_questions (content_id, question_text, question_type, options, correct_answer, points, order_index)
                      VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [question.content_id, question.question_text, question.question_type, question.options, question.correct_answer, question.points, question.order_index]);
                  });
                }
                
                if (index === sampleContent.length - 1) {
                  resolve();
                }
              });
            });
          });
        });
      });
    });
  });
}

module.exports = { initDatabase, db }; 