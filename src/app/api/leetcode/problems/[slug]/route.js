import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'db', 'leetcode_problems.db');

class ProblemDetailManager {
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

    getProblemBySlug(slug) {
        const db = this.connect();
        const query = `
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            WHERE p.slug = ?
            GROUP BY p.problem_id
        `;
        
        const stmt = db.prepare(query);
        const result = stmt.get(slug);
        
        if (result) {
            result.examples = result.examples ? result.examples.split(',') : [];
            result.constraints = result.constraints ? result.constraints.split(',') : [];
        }
        
        return result;
    }

    getNextProblem(currentSlug) {
        const db = this.connect();
        const query = `
            SELECT slug, title
            FROM problems 
            WHERE problem_id > (
                SELECT problem_id FROM problems WHERE slug = ?
            )
            ORDER BY problem_id ASC
            LIMIT 1
        `;
        
        const stmt = db.prepare(query);
        return stmt.get(currentSlug);
    }

    getPreviousProblem(currentSlug) {
        const db = this.connect();
        const query = `
            SELECT slug, title
            FROM problems 
            WHERE problem_id < (
                SELECT problem_id FROM problems WHERE slug = ?
            )
            ORDER BY problem_id DESC
            LIMIT 1
        `;
        
        const stmt = db.prepare(query);
        return stmt.get(currentSlug);
    }

    getRelatedProblems(currentSlug, difficulty) {
        const db = this.connect();
        const query = `
            SELECT slug, title, difficulty
            FROM problems 
            WHERE slug != ? AND difficulty = ?
            ORDER BY RANDOM()
            LIMIT 3
        `;
        
        const stmt = db.prepare(query);
        return stmt.all(currentSlug, difficulty);
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

const problemDetailManager = new ProblemDetailManager();

export async function GET(request, { params }) {
    try {
        const { slug } = params;
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Problem slug is required' },
                { status: 400 }
            );
        }

        const problem = problemDetailManager.getProblemBySlug(slug);
        
        if (!problem) {
            return NextResponse.json(
                { error: 'Problem not found' },
                { status: 404 }
            );
        }

        // Get navigation problems
        const nextProblem = problemDetailManager.getNextProblem(slug);
        const previousProblem = problemDetailManager.getPreviousProblem(slug);
        const relatedProblems = problemDetailManager.getRelatedProblems(slug, problem.difficulty);

        // Transform the data to match the frontend interface
        const transformedProblem = {
            id: problem.problem_id,
            title: problem.title,
            slug: problem.slug,
            difficulty: problem.difficulty,
            description: problem.description,
            examples: problem.examples,
            constraints: problem.constraints,
            url: problem.url,
            navigation: {
                next: nextProblem,
                previous: previousProblem,
                related: relatedProblems
            }
        };

        return NextResponse.json({
            success: true,
            data: transformedProblem
        });

    } catch (error) {
        console.error('Error fetching problem details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch problem details', details: error.message },
            { status: 500 }
        );
    }
} 