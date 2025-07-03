import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'db', 'leetcode_problems.db');

class DatabaseManager {
    constructor() {
        this.db = null;
    }

    connect() {
        if (!this.db) {
            if (!fs.existsSync(DB_PATH)) {
                throw new Error('Database not found. Please initialize the database first.');
            }
            this.db = new Database(DB_PATH);
        }
        return this.db;
    }

    getDailyProblem(date = null) {
        const db = this.connect();
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
        
        const stmt = db.prepare(query);
        const result = stmt.get(date);
        
        if (result) {
            // Parse the concatenated strings back to arrays
            result.examples = result.examples ? result.examples.split(',') : [];
            result.constraints = result.constraints ? result.constraints.split(',') : [];
        }
        
        return result;
    }

    getStats() {
        const db = this.connect();
        const stats = {
            totalProblems: db.prepare('SELECT COUNT(*) as count FROM problems').get().count,
            easyProblems: db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Easy'").get().count,
            mediumProblems: db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Medium'").get().count,
            hardProblems: db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Hard'").get().count,
            dailyProblems: db.prepare('SELECT COUNT(*) as count FROM daily_problems').get().count,
        };
        
        return stats;
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

const dbManager = new DatabaseManager();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        
        const dailyProblem = dbManager.getDailyProblem(date);
        const stats = dbManager.getStats();
        
        if (!dailyProblem) {
            return NextResponse.json(
                { error: 'No daily problem found for the specified date' },
                { status: 404 }
            );
        }

        // Transform the data to match the frontend interface
        const transformedProblem = {
            id: dailyProblem.problem_id,
            title: dailyProblem.title,
            slug: dailyProblem.slug,
            difficulty: dailyProblem.difficulty,
            description: dailyProblem.description,
            examples: dailyProblem.examples,
            constraints: dailyProblem.constraints,
            url: dailyProblem.url,
            featuredDate: dailyProblem.featured_date
        };

        return NextResponse.json({
            success: true,
            data: {
                dailyProblem: transformedProblem,
                stats: stats
            }
        });

    } catch (error) {
        console.error('Error fetching daily problem:', error);
        return NextResponse.json(
            { error: 'Failed to fetch daily problem', details: error.message },
            { status: 500 }
        );
    }
} 