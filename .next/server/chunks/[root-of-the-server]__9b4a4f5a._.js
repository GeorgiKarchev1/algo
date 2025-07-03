module.exports = {

"[project]/.next-internal/server/app/api/leetcode/problems/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[project]/src/app/api/leetcode/problems/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
;
const DB_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'db', 'leetcode_problems.db');
class ProblemsManager {
    constructor(){
        this.db = null;
    }
    connect() {
        if (!this.db) {
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(DB_PATH)) {
                throw new Error('Database not found. Please initialize the database first.');
            }
            this.db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](DB_PATH);
        }
        return this.db;
    }
    getAllProblems(options = {}) {
        const db = this.connect();
        const { page = 1, limit = 12, search = '', difficulty = 'all', sortBy = 'title', sortOrder = 'ASC' } = options;
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
        const validSortFields = [
            'title',
            'difficulty',
            'problem_id'
        ];
        const validSortOrders = [
            'ASC',
            'DESC'
        ];
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
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // Check if it's a request for a random problem
        if (searchParams.get('random') === 'true') {
            const difficulty = searchParams.get('difficulty') || 'all';
            const randomProblem = problemsManager.getRandomProblem(difficulty);
            if (!randomProblem) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'No problems found'
                }, {
                    status: 404
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        const transformedProblems = result.problems.map((problem)=>({
                id: problem.problem_id,
                title: problem.title,
                slug: problem.slug,
                difficulty: problem.difficulty,
                description: problem.description.substring(0, 200) + '...',
                url: problem.url,
                exampleCount: problem.example_count,
                constraintCount: problem.constraint_count
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                problems: transformedProblems,
                pagination: result.pagination,
                filters: result.filters
            }
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch problems',
            details: error.message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9b4a4f5a._.js.map