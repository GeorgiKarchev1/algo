#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = path.join(__dirname, '../db/leetcode_problems.db');

// Ensure db directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Create tables
const createTablesSQL = `
-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    difficulty TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Examples table
CREATE TABLE IF NOT EXISTS examples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL,
    example_text TEXT NOT NULL,
    example_order INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems (problem_id) ON DELETE CASCADE
);

-- Constraints table
CREATE TABLE IF NOT EXISTS constraints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL,
    constraint_text TEXT NOT NULL,
    constraint_order INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems (problem_id) ON DELETE CASCADE
);

-- Daily problems table (tracks which problem was featured on which day)
CREATE TABLE IF NOT EXISTS daily_problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL,
    featured_date DATE UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems (problem_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
CREATE INDEX IF NOT EXISTS idx_daily_problems_date ON daily_problems(featured_date);
CREATE INDEX IF NOT EXISTS idx_examples_problem_id ON examples(problem_id);
CREATE INDEX IF NOT EXISTS idx_constraints_problem_id ON constraints(problem_id);
`;

try {
    // Execute the SQL to create tables
    db.exec(createTablesSQL);
    console.log('✅ Database initialized successfully!');
    
    // Check if we have any problems already
    const count = db.prepare('SELECT COUNT(*) as count FROM problems').get();
    console.log(`📊 Current problems in database: ${count.count}`);
    
} catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
} finally {
    db.close();
}

console.log(`💾 Database file: ${DB_PATH}`);
console.log('🎉 Ready to store LeetCode problems!'); 