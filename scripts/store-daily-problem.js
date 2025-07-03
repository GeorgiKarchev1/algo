#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = path.join(__dirname, '../db/leetcode_problems.db');

class ProblemStore {
    constructor() {
        if (!fs.existsSync(DB_PATH)) {
            console.error('❌ Database not found. Please run: node scripts/init-database.js');
            process.exit(1);
        }
        
        this.db = new Database(DB_PATH);
        
        // Prepare statements for better performance
        this.insertProblem = this.db.prepare(`
            INSERT OR REPLACE INTO problems 
            (problem_id, title, slug, difficulty, description, url, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);
        
        this.insertExample = this.db.prepare(`
            INSERT INTO examples (problem_id, example_text, example_order)
            VALUES (?, ?, ?)
        `);
        
        this.insertConstraint = this.db.prepare(`
            INSERT INTO constraints (problem_id, constraint_text, constraint_order)
            VALUES (?, ?, ?)
        `);
        
        this.insertDailyProblem = this.db.prepare(`
            INSERT OR REPLACE INTO daily_problems (problem_id, featured_date)
            VALUES (?, DATE('now'))
        `);
        
        this.deleteExamples = this.db.prepare(`
            DELETE FROM examples WHERE problem_id = ?
        `);
        
        this.deleteConstraints = this.db.prepare(`
            DELETE FROM constraints WHERE problem_id = ?
        `);
        
        this.getProblemBySlug = this.db.prepare(`
            SELECT * FROM problems WHERE slug = ?
        `);
    }
    
    storeProblem(problemData) {
        const transaction = this.db.transaction(() => {
            try {
                // Check if problem already exists
                const existingProblem = this.getProblemBySlug.get(problemData.slug);
                
                if (existingProblem) {
                    console.log(`📝 Problem "${problemData.title}" already exists, updating...`);
                    
                    // Delete existing examples and constraints
                    this.deleteExamples.run(problemData.problem_id);
                    this.deleteConstraints.run(problemData.problem_id);
                } else {
                    console.log(`✨ Adding new problem: "${problemData.title}"`);
                }
                
                // Insert/update problem
                this.insertProblem.run(
                    problemData.problem_id,
                    problemData.title,
                    problemData.slug,
                    problemData.difficulty,
                    problemData.description,
                    problemData.url
                );
                
                // Insert examples
                if (problemData.examples && problemData.examples.length > 0) {
                    problemData.examples.forEach((example, index) => {
                        this.insertExample.run(problemData.problem_id, example, index + 1);
                    });
                    console.log(`📚 Added ${problemData.examples.length} examples`);
                }
                
                // Insert constraints
                if (problemData.constraints && problemData.constraints.length > 0) {
                    problemData.constraints.forEach((constraint, index) => {
                        this.insertConstraint.run(problemData.problem_id, constraint, index + 1);
                    });
                    console.log(`📋 Added ${problemData.constraints.length} constraints`);
                }
                
                // Mark as today's daily problem
                this.insertDailyProblem.run(problemData.problem_id);
                console.log(`🗓️ Marked as today's daily problem`);
                
                return true;
                
            } catch (error) {
                console.error('❌ Error storing problem:', error);
                throw error;
            }
        });
        
        return transaction();
    }
    
    getDailyProblem(date = null) {
        const query = `
            SELECT 
                p.*,
                dp.featured_date,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            JOIN daily_problems dp ON p.problem_id = dp.problem_id
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            WHERE dp.featured_date = COALESCE(?, DATE('now'))
            GROUP BY p.id
        `;
        
        const stmt = this.db.prepare(query);
        const result = stmt.get(date);
        
        if (result) {
            // Parse the concatenated strings back to arrays
            result.examples = result.examples ? result.examples.split(',') : [];
            result.constraints = result.constraints ? result.constraints.split(',') : [];
        }
        
        return result;
    }
    
    getAllProblems() {
        const query = `
            SELECT 
                p.*,
                COUNT(DISTINCT e.id) as example_count,
                COUNT(DISTINCT c.id) as constraint_count
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;
        
        return this.db.prepare(query).all();
    }
    
    getStats() {
        const stats = {
            totalProblems: this.db.prepare('SELECT COUNT(*) as count FROM problems').get().count,
            easyProblems: this.db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Easy'").get().count,
            mediumProblems: this.db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Medium'").get().count,
            hardProblems: this.db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Hard'").get().count,
            dailyProblems: this.db.prepare('SELECT COUNT(*) as count FROM daily_problems').get().count,
        };
        
        return stats;
    }
    
    close() {
        this.db.close();
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Usage: node store-daily-problem.js <json-file>');
        console.error('Example: node store-daily-problem.js leetcode_problem_20250616_171640.json');
        process.exit(1);
    }
    
    const jsonFile = args[0];
    
    if (!fs.existsSync(jsonFile)) {
        console.error(`❌ File not found: ${jsonFile}`);
        process.exit(1);
    }
    
    try {
        // Read the JSON file
        const problemData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        console.log(`📖 Reading problem data from: ${jsonFile}`);
        
        // Validate required fields
        const requiredFields = ['title', 'slug', 'problem_id', 'difficulty', 'description', 'url'];
        for (const field of requiredFields) {
            if (!problemData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Store in database
        const store = new ProblemStore();
        
        console.log('=' * 50);
        console.log('📝 Storing problem in database...');
        console.log('=' * 50);
        
        store.storeProblem(problemData);
        
        // Show stats
        const stats = store.getStats();
        console.log('\n📊 Database Statistics:');
        console.log('=' * 50);
        console.log(`Total Problems: ${stats.totalProblems}`);
        console.log(`Easy: ${stats.easyProblems} | Medium: ${stats.mediumProblems} | Hard: ${stats.hardProblems}`);
        console.log(`Daily Problems Tracked: ${stats.dailyProblems}`);
        
        // Show today's problem
        const todaysProblem = store.getDailyProblem();
        if (todaysProblem) {
            console.log('\n🎯 Today\'s Problem:');
            console.log('=' * 50);
            console.log(`${todaysProblem.title} (#${todaysProblem.problem_id})`);
            console.log(`Difficulty: ${todaysProblem.difficulty}`);
            console.log(`Examples: ${todaysProblem.examples.length}`);
            console.log(`Constraints: ${todaysProblem.constraints.length}`);
        }
        
        store.close();
        
        console.log('\n✅ Problem stored successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = ProblemStore; 