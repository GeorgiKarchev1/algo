'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    Code2, 
    CheckCircle2, 
    AlertCircle, 
    Flame, 
    Target, 
    Brain, 
    Clock,
    BookOpen,
    Lightbulb,
    Zap,
    Trophy,
    Share2,
    Bookmark,
    Eye
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Problem {
    id: number;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: string[];
    constraints: string[];
    url: string;
    navigation: {
        next: { slug: string; title: string } | null;
        previous: { slug: string; title: string } | null;
        related: { slug: string; title: string; difficulty: string }[];
    };
}

export default function ProblemDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const hintsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchProblem = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/leetcode/problems/${slug}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Problem not found');
                    }
                    throw new Error('Failed to fetch problem');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    setProblem(result.data);
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (err) {
                console.error('Error fetching problem:', err);
                setError(err instanceof Error ? err.message : 'Failed to load problem');
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [slug]);

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
            case 'easy': return <CheckCircle2 className="w-5 h-5" />;
            case 'medium': return <AlertCircle className="w-5 h-5" />;
            case 'hard': return <Flame className="w-5 h-5" />;
            default: return <Target className="w-5 h-5" />;
        }
    };

    const handleViewSolution = () => {
        if (problem?.url) {
            window.open(problem.url, '_blank');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: problem?.title,
                    text: `Check out this LeetCode problem: ${problem?.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could show a toast notification here
        }
    };

    if (loading) {
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
                            Loading Problem...
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
                            {error === 'Problem not found' ? 'Problem Not Found' : 'Oops! Something went wrong'}
                        </h3>
                        <p className="text-gray-300 mb-6">{error}</p>
                        
                        <div className="flex gap-4 justify-center">
                            <Link href="/problems">
                                <motion.button 
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Browse Problems
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

    if (!problem) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-50"></div>
            
            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
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

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Bar */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/problems">
                        <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white hover:border-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Problems
                        </motion.button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={handleShare}
                            className="p-2 bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white hover:border-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Share2 className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                            className="p-2 bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white hover:border-blue-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Bookmark className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Problem Header */}
                <motion.div
                    className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`
                                    px-4 py-2 rounded-full text-sm font-medium
                                    bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white
                                    flex items-center gap-2 shadow-lg
                                `}>
                                    {getDifficultyIcon(problem.difficulty)}
                                    {problem.difficulty}
                                </div>
                                
                                <div className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-gray-300">
                                    Problem #{problem.id}
                                </div>
                            </div>
                            
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {problem.title}
                            </h1>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    {problem.examples.length} Examples
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    {problem.constraints.length} Constraints
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                                onClick={handleViewSolution}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Eye className="w-5 h-5" />
                                View on LeetCode
                            </motion.button>
                            
                            <motion.button
                                onClick={() => {
                                    setShowSolution(!showSolution);
                                    if (!showSolution) {
                                        // Wait for the animation to start before scrolling
                                        setTimeout(() => {
                                            hintsRef.current?.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }, 100);
                                    }
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Lightbulb className="w-5 h-5" />
                                {showSolution ? 'Hide' : 'Show'} Hints
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Problem Description */}
                        <motion.div
                            className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Problem Description</h2>
                            </div>
                            
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {problem.description}
                                </p>
                            </div>
                        </motion.div>

                        {/* Examples */}
                        <motion.div
                            className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <Code2 className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Examples</h2>
                            </div>
                            
                            <div className="space-y-6">
                                {problem.examples.map((example, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-slate-900/50 border border-slate-600/30 rounded-xl p-6"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">
                                                Example {index + 1}
                                            </span>
                                        </div>
                                        <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
                                            {example}
                                        </pre>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Constraints */}
                        <motion.div
                            className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <Target className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Constraints</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {problem.constraints.map((constraint, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-600/30 rounded-xl"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                                    >
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-gray-300 font-mono text-sm">
                                            {constraint}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Solution Hints */}
                        <AnimatePresence>
                            {showSolution && (
                                <motion.div
                                    ref={hintsRef}
                                    className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                            <Lightbulb className="w-4 h-4 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Solution Hints</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                            <p className="text-yellow-100">
                                                💡 <strong>Approach:</strong> Think about the most efficient way to solve this problem. Consider the time and space complexity.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                            <p className="text-orange-100">
                                                🔍 <strong>Key Insight:</strong> Look for patterns in the examples and think about edge cases.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                            <p className="text-purple-100">
                                                ⚡ <strong>Optimization:</strong> Once you have a working solution, think about how to optimize it further.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Navigation */}
                        <motion.div
                            className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Navigation
                            </h3>
                            
                            <div className="space-y-3">
                                {problem.navigation.previous && (
                                    <Link href={`/problems/${problem.navigation.previous.slug}`}>
                                        <motion.div
                                            className="p-3 bg-slate-900/50 border border-slate-600/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                                                <span className="text-gray-400 group-hover:text-blue-400">Previous</span>
                                            </div>
                                            <p className="text-white font-medium truncate mt-1">
                                                {problem.navigation.previous.title}
                                            </p>
                                        </motion.div>
                                    </Link>
                                )}
                                
                                {problem.navigation.next && (
                                    <Link href={`/problems/${problem.navigation.next.slug}`}>
                                        <motion.div
                                            className="p-3 bg-slate-900/50 border border-slate-600/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-400 group-hover:text-blue-400">Next</span>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                                            </div>
                                            <p className="text-white font-medium truncate mt-1">
                                                {problem.navigation.next.title}
                                            </p>
                                        </motion.div>
                                    </Link>
                                )}
                            </div>
                        </motion.div>

                        {/* Related Problems */}
                        {problem.navigation.related.length > 0 && (
                            <motion.div
                                className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Related Problems
                                </h3>
                                
                                <div className="space-y-3">
                                    {problem.navigation.related.map((related, index) => (
                                        <Link key={index} href={`/problems/${related.slug}`}>
                                            <motion.div
                                                className="p-3 bg-slate-900/50 border border-slate-600/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                                                whileHover={{ scale: 1.02 }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                                                        {related.title}
                                                    </p>
                                                    <div className={`
                                                        px-2 py-1 rounded-full text-xs font-medium
                                                        bg-gradient-to-r ${getDifficultyColor(related.difficulty)} text-white
                                                        flex-shrink-0 ml-2
                                                    `}>
                                                        {related.difficulty}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Actions */}
                        <motion.div
                            className="bg-gradient-to-r from-slate-800/40 to-purple-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                Quick Actions
                            </h3>
                            
                            <div className="space-y-3">
                                <motion.button
                                    onClick={() => window.location.href = '/problems?random=true'}
                                    className="w-full p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-white hover:border-purple-400/50 transition-all duration-300 flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Zap className="w-4 h-4" />
                                    Random Problem
                                </motion.button>
                                
                                <motion.button
                                    className="w-full p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl text-white hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Clock className="w-4 h-4" />
                                    Start Timer
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 