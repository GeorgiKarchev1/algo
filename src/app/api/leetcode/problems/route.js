import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'db', 'leetcode_problems.db');

class ProblemsManager {
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

    getAllProblems(options = {}) {
        const db = this.connect();
        const {
            page = 1,
            limit = 12,
            search = '',
            difficulty = 'all',
            sortBy = 'title',
            sortOrder = 'ASC'
        } = options;

        const offset = (page - 1) * limit;

        // Build the WHERE clause
        let whereClause = '';
        const params = [];

        if (search) {
            whereClause += ' WHERE (p.title LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (difficulty !== 'all') {
            whereClause += search ? ' AND' : ' WHERE';
            if (difficulty === 'medium-hard') {
                whereClause += ' p.difficulty IN (?, ?)';
                params.push('Medium', 'Hard');
            } else {
                whereClause += ' p.difficulty = ?';
                params.push(difficulty);
            }
        }

        // Build ORDER BY clause
        const validSortFields = ['title', 'difficulty', 'problem_id'];
        const validSortOrders = ['ASC', 'DESC'];
        const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'title';
        const safeSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'ASC';

        const query = `
            SELECT 
                p.problem_id,
                p.title,
                p.slug,
                p.difficulty,
                p.description,
                p.url,
                COUNT(e.id) as example_count,
                COUNT(c.id) as constraint_count
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            ${whereClause}
            GROUP BY p.problem_id
            ORDER BY p.${safeSortBy} ${safeSortOrder}
            LIMIT ? OFFSET ?
        `;

        // Get total count for pagination
        const countQuery = `
            SELECT COUNT(DISTINCT p.problem_id) as total
            FROM problems p
            ${whereClause}
        `;

        const stmt = db.prepare(query);
        const countStmt = db.prepare(countQuery);

        const problems = stmt.all(...params, limit, offset);
        const totalResult = countStmt.get(...params);
        const total = totalResult.total;

        return {
            problems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            filters: {
                search,
                difficulty,
                sortBy,
                sortOrder
            }
        };
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

    getRandomProblem(difficulty = 'all') {
        const db = this.connect();
        
        // Build WHERE clause for difficulty filtering
        let whereClause = '';
        const params = [];
        
        if (difficulty !== 'all') {
            if (difficulty === 'medium-hard') {
                whereClause = ' WHERE p.difficulty IN (?, ?)';
                params.push('Medium', 'Hard');
            } else {
                whereClause = ' WHERE p.difficulty = ?';
                params.push(difficulty);
            }
        }
        
        const query = `
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT e.example_text ORDER BY e.example_order) as examples,
                GROUP_CONCAT(DISTINCT c.constraint_text ORDER BY c.constraint_order) as constraints
            FROM problems p
            LEFT JOIN examples e ON p.problem_id = e.problem_id
            LEFT JOIN constraints c ON p.problem_id = c.problem_id
            ${whereClause}
            GROUP BY p.problem_id
            ORDER BY RANDOM()
            LIMIT 1
        `;
        
        const stmt = db.prepare(query);
        const result = stmt.get(...params);
        
        if (result) {
            result.examples = result.examples ? result.examples.split(',') : [];
            result.constraints = result.constraints ? result.constraints.split(',') : [];
        }
        
        return result;
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

const problemsManager = new ProblemsManager();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Check if it's a request for a random problem
        if (searchParams.get('random') === 'true') {
            const difficulty = searchParams.get('difficulty') || 'all';
            const randomProblem = problemsManager.getRandomProblem(difficulty);
            
            if (!randomProblem) {
                return NextResponse.json(
                    { error: 'No problems found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: {
                    id: randomProblem.problem_id,
                    title: randomProblem.title,
                    slug: randomProblem.slug,
                    difficulty: randomProblem.difficulty,
                    description: randomProblem.description,
                    examples: randomProblem.examples,
                    constraints: randomProblem.constraints,
                    url: randomProblem.url
                }
            });
        }

        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const search = searchParams.get('search') || '';
        const difficulty = searchParams.get('difficulty') || 'all';
        const sortBy = searchParams.get('sortBy') || 'title';
        const sortOrder = searchParams.get('sortOrder') || 'ASC';

        const result = problemsManager.getAllProblems({
            page,
            limit,
            search,
            difficulty,
            sortBy,
            sortOrder
        });

        // Transform problems to match frontend interface
        const transformedProblems = result.problems.map(problem => ({
            id: problem.problem_id,
            title: problem.title,
            slug: problem.slug,
            difficulty: problem.difficulty,
            description: problem.description.substring(0, 200) + '...', // Truncate for list view
            url: problem.url,
            exampleCount: problem.example_count,
            constraintCount: problem.constraint_count
        }));

        return NextResponse.json({
            success: true,
            data: {
                problems: transformedProblems,
                pagination: result.pagination,
                filters: result.filters
            }
        });

    } catch (error) {
        console.error('Error fetching problems:', error);
        return NextResponse.json(
            { error: 'Failed to fetch problems', details: error.message },
            { status: 500 }
        );
    }
} 