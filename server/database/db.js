const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'learning_platform.db');
const db = new sqlite3.Database(dbPath);

module.exports = db; 