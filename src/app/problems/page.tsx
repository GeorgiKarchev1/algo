'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Code2, 
    Zap, 
    Trophy, 
    Target, 
    Brain, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Flame, 
    Sparkles,
    ArrowUpDown,
    Grid3X3,
    List,
    Shuffle,
    BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface Problem {
    id: number;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    url: string;
    exampleCount: number;
    constraintCount: number;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface FiltersInfo {
    search: string;
    difficulty: string;
    sortBy: string;
    sortOrder: string;
}

export default function ProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [filters, setFilters] = useState<FiltersInfo>({
        search: '',
        difficulty: 'medium-hard', // Only show medium and hard problems
        sortBy: 'title',
        sortOrder: 'ASC'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchInput, setSearchInput] = useState('');

    const fetchProblems = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                search: filters.search,
                difficulty: filters.difficulty,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            });

            const response = await fetch(`/api/leetcode/problems?${params}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch problems');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setProblems(result.data.problems);
                setPagination(result.data.pagination);
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error fetching problems:', err);
            setError(err instanceof Error ? err.message : 'Failed to load problems');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProblems(1);
    }, [fetchProblems]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInput }));
    };

    const handleFilterChange = (key: keyof FiltersInfo, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (page: number) => {
        fetchProblems(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'from-emerald-400 to-green-600';
            case 'medium': return 'from-yellow-400 to-orange-600';
            case 'hard': return 'from-red-400 to-pink-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return <CheckCircle2 className="w-4 h-4" />;
            case 'medium': return <AlertCircle className="w-4 h-4" />;
            case 'hard': return <Flame className="w-4 h-4" />;
            default: return <Target className="w-4 h-4" />;
        }
    };

    const handleRandomProblem = async () => {
        try {
            const response = await fetch('/api/leetcode/problems?random=true&difficulty=medium-hard');
            const result = await response.json();
            
            if (result.success) {
                window.location.href = `/problems/${result.data.slug}`;
            }
        } catch (err) {
            console.error('Error fetching random problem:', err);
        }
    };

    if (loading && problems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50"></div>
                
                <motion.div 
                    className="flex items-center justify-center min-h-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center">
                        <motion.div
                            className="relative inline-block mb-8"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                            <motion.div
                                className="absolute inset-2 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Code2 className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                        
                        <motion.h2 
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Loading Problems...
                        </motion.h2>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center">
                <motion.div 
                    className="max-w-md mx-auto p-8"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                >
                    <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <AlertCircle className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Oops! Something went wrong
                        </h3>
                        <p className="text-gray-300 mb-6">{error}</p>
                        
                        <motion.button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-50"></div>
            
            {/* Optimized Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                            willChange: 'transform',
                        }}
                        animate={{
                            y: [-15, 15],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.4,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-4"
                        animate={{ 
                            scale: [1, 1.02, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                                animate={{ 
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Sparkles className="w-2 h-2 text-white" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Problem Browser
                        </h1>
                    </motion.div>
                    
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Challenge yourself with {pagination?.total || 50} medium and hard LeetCode problems. 
                        Master advanced algorithms and data structures for coding interviews.
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                />
                            </div>
                        </form>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <select
                                value={filters.difficulty}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="medium-hard">Medium & Hard</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <select
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    handleFilterChange('sortBy', sortBy);
                                    handleFilterChange('sortOrder', sortOrder);
                                }}
                                className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="title-ASC">Title A-Z</option>
                                <option value="title-DESC">Title Z-A</option>
                                <option value="difficulty-ASC">Difficulty ↑</option>
                                <option value="difficulty-DESC">Difficulty ↓</option>
                                <option value="problem_id-ASC">ID ↑</option>
                                <option value="problem_id-DESC">ID ↓</option>
                            </select>

                            <motion.button
                                onClick={handleRandomProblem}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Shuffle className="w-4 h-4" />
                                Random
                            </motion.button>

                            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-600/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Summary */}
                {pagination && (
                    <motion.div
                        className="mb-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <p className="text-gray-300">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} problems
                        </p>
                    </motion.div>
                )}

                {/* Problems Grid/List */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            className="flex justify-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="text-center">
                                <motion.div
                                    className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="text-gray-400">Loading problems...</p>
                            </div>
                        </motion.div>
                    ) : problems.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="text-center py-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No problems found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="problems"
                            className={viewMode === 'grid' 
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                : 'space-y-4'
                            }
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {problems.map((problem, index) => (
                                <motion.div
                                    key={problem.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="group"
                                >
                                    <Link href={`/problems/${problem.slug}`}>
                                        <div className={`
                                            relative bg-gradient-to-br from-slate-800/40 to-purple-800/40 backdrop-blur-xl 
                                            border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 
                                            hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer
                                            ${viewMode === 'list' ? 'flex items-center gap-6' : 'h-full'}
                                        `}>
                                            {/* Difficulty Badge */}
                                            <div className={`
                                                absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                                                bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white
                                                flex items-center gap-1 shadow-lg
                                                ${viewMode === 'list' ? 'relative top-0 right-0' : ''}
                                            `}>
                                                {getDifficultyIcon(problem.difficulty)}
                                                {problem.difficulty}
                                            </div>

                                            <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                                <h3 className={`
                                                    font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300
                                                    ${viewMode === 'list' ? 'text-xl' : 'text-lg pr-20'}
                                                `}>
                                                    {problem.title}
                                                </h3>

                                                <p className={`
                                                    text-gray-300 mb-4 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300
                                                    ${viewMode === 'list' ? 'text-base' : 'text-sm'}
                                                `}>
                                                    {problem.description}
                                                </p>

                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Code2 className="w-3 h-3" />
                                                            {problem.exampleCount} examples
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-3 h-3" />
                                                            {problem.constraintCount} constraints
                                                        </span>
                                                    </div>
                                                    
                                                    <motion.div
                                                        className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <motion.div
                        className="flex justify-center items-center gap-2 mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <motion.button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                            className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all duration-300 flex items-center gap-2"
                            whileHover={pagination.hasPrev ? { scale: 1.05 } : {}}
                            whileTap={pagination.hasPrev ? { scale: 0.95 } : {}}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </motion.button>

                        <div className="flex gap-1">
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                const page = i + 1;
                                const isActive = page === pagination.page;
                                
                                return (
                                    <motion.button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`
                                            w-10 h-10 rounded-lg font-medium transition-all duration-300
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                                : 'bg-slate-800/50 border border-slate-600/50 text-gray-300 hover:bg-slate-700/50'
                                            }
                                        `}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {page}
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                            className="px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all duration-300 flex items-center gap-2"
                            whileHover={pagination.hasNext ? { scale: 1.05 } : {}}
                            whileTap={pagination.hasNext ? { scale: 0.95 } : {}}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
} 