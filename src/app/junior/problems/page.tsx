'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    Grid3X3, 
    List, 
    BookOpen, 
    ExternalLink, 
    ArrowLeft,
    CheckCircle2,
    Target,
    Brain
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

interface Stats {
    totalProblems: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    dailyProblems: number;
}

export default function JuniorProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [problemsResponse, statsResponse] = await Promise.all([
                    fetch('/api/leetcode/problems?difficulty=Easy&limit=100'),
                    fetch('/api/leetcode/daily')
                ]);

                if (!problemsResponse.ok || !statsResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [problemsResult, statsResult] = await Promise.all([
                    problemsResponse.json(),
                    statsResponse.json()
                ]);

                if (problemsResult.success) {
                    setProblems(problemsResult.data.problems);
                }

                if (statsResult.success) {
                    setStats(statsResult.data.stats);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load problems');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-teal-900/10 opacity-50"></div>
                
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
                            <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"></div>
                            <motion.div
                                className="absolute inset-2 w-16 h-16 border-4 border-teal-500/30 border-b-teal-500 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <BookOpen className="w-6 h-6 text-white" />
                            </motion.div>
                        </motion.div>
                        
                        <motion.h2 
                            className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Loading Easy Problems...
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
                        <h3 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h3>
                        <p className="text-gray-300 mb-6">{error}</p>
                        
                        <div className="flex gap-4 justify-center">
                            <Link href="/junior">
                                <motion.button 
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Back to Junior Track
                                </motion.button>
                            </Link>
                            
                            <motion.button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Try Again
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-teal-900/10 opacity-50"></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Bar */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/junior">
                        <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/40 to-emerald-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white hover:border-emerald-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Junior Track
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-4"
                        animate={{ 
                            scale: [1, 1.02, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
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
                                <CheckCircle2 className="w-2 h-2 text-white" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Easy Problems Collection
                        </h1>
                    </motion.div>
                    
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Perfect for building your foundation in algorithms & data structures. 
                        Master {stats?.easyProblems || 88} carefully selected easy problems.
                    </p>
                </motion.div>

                {/* Main Content */}
                <motion.div 
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Target className="w-7 h-7" />
                                    Browse & Practice
                                </h3>
                                <p className="text-emerald-100 mt-1">
                                    Start your coding journey with beginner-friendly challenges
                                </p>
                            </div>
                            <div className="text-emerald-100 text-right">
                                <div className="text-sm opacity-75">Total Problems</div>
                                <div className="text-2xl font-bold">{problems.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-6 border-b border-slate-700/50">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search easy problems..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-600/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Results count */}
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                            <div>
                                {searchTerm ? (
                                    <>Found {filteredProblems.length} problems matching "{searchTerm}"</>
                                ) : (
                                    <>Showing all {problems.length} easy problems</>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <span>💡 Avg. difficulty: Beginner</span>
                                <span>⏱️ Est. time: 15-30 min each</span>
                            </div>
                        </div>
                    </div>

                    {/* Problems List */}
                    <div className="p-6">
                        {filteredProblems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">No problems found</h4>
                                <p className="text-gray-400">Try adjusting your search terms</p>
                            </div>
                        ) : (
                            <motion.div
                                className={viewMode === 'grid' 
                                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                    : 'space-y-3'
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                {filteredProblems.map((problem, index) => (
                                    <motion.div
                                        key={problem.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.02 }}
                                    >
                                        <Link href={`/problems/${problem.slug}`}>
                                            <motion.div
                                                className={`bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group ${
                                                    viewMode === 'list' ? 'flex items-center gap-4' : ''
                                                }`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-emerald-400 font-medium">
                                                            #{problem.id}
                                                        </span>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Easy
                                                        </div>
                                                    </div>
                                                    
                                                    <h5 className="font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                                                        {problem.title}
                                                    </h5>
                                                    
                                                    {viewMode === 'grid' && (
                                                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                                            {problem.description.slice(0, 100)}...
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span>{problem.exampleCount} examples</span>
                                                            <span>{problem.constraintCount} constraints</span>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                {stats && (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {[
                            { label: 'Easy Problems', value: stats.easyProblems, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
                            { label: 'Ready to Practice', value: problems.length, icon: Brain, color: 'from-teal-500 to-cyan-500' },
                            { label: 'Daily Challenges', value: stats.dailyProblems, icon: Target, color: 'from-purple-500 to-pink-500' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className={`bg-gradient-to-br ${stat.color}/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group shadow-lg`}
                                whileHover={{ scale: 1.03 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <motion.div
                                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <stat.icon className="w-6 h-6 text-white" />
                                </motion.div>
                                
                                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
} 