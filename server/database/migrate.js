const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'learning_platform.db');

const migrateDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to database for migration');
    });

    // Check if event_context column exists
    db.get("PRAGMA table_info(clickstream_events)", (err, rows) => {
      if (err) {
        console.error('Error checking table schema:', err);
        reject(err);
        return;
      }

      // Get all columns
      db.all("PRAGMA table_info(clickstream_events)", (err, columns) => {
        if (err) {
          console.error('Error getting table info:', err);
          reject(err);
          return;
        }

        const hasEventContext = columns.some(col => col.name === 'event_context');
        
        if (!hasEventContext) {
          console.log('Adding event_context column to clickstream_events table...');
          
          db.run("ALTER TABLE clickstream_events ADD COLUMN event_context TEXT", (err) => {
            if (err) {
              console.error('Error adding event_context column:', err);
              reject(err);
              return;
            }
            console.log('✅ Successfully added event_context column');
            resolve();
          });
        } else {
          console.log('✅ event_context column already exists');
          resolve();
        }
      });
    });

    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  });
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDatabase }; 