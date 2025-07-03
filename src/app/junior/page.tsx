'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code2, Zap, Trophy, Target, Brain, Clock, CheckCircle2, AlertCircle, Sparkles, Flame, Star } from 'lucide-react';
import Link from 'next/link';

interface DailyProblem {
    id: number;
    title: string;
    slug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: string[];
    constraints: string[];
    url: string;
    featuredDate: string;
}

interface Stats {
    totalProblems: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    dailyProblems: number;
}



export default function JuniorPage() {
    const [dailyProblem, setDailyProblem] = useState<DailyProblem | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/leetcode/daily');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch daily problem');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    setDailyProblem(result.data.dailyProblem);
                    setStats(result.data.stats);
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load daily problem');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const toggleStep = (stepIndex: number) => {
        setCompletedSteps(prev => 
            prev.includes(stepIndex) 
                ? prev.filter(s => s !== stepIndex)
                : [...prev, stepIndex]
        );
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
                            style={{ willChange: 'transform' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-16 h-16 border-3 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                            <motion.div
                                className="absolute inset-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                                style={{ willChange: 'transform' }}
                                animate={{ 
                                    scale: [0.9, 1.1, 0.9],
                                }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Code2 className="w-5 h-5 text-white" />
                            </motion.div>
                        </motion.div>
                        
                        <motion.h2 
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Loading Your Daily Challenge...
                        </motion.h2>
                        
                        <div className="flex justify-center space-x-1">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                    style={{ willChange: 'transform' }}
                                    animate={{
                                        scale: [1, 1.3, 1],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.15
                                    }}
                                />
                            ))}
                        </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 opacity-50"></div>
            
            {/* Optimized Floating Sparkles */}
            {!prefersReducedMotion && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: `${20 + i * 25}%`,
                                top: `${30 + (i % 2) * 30}%`,
                                willChange: 'transform',
                            }}
                            animate={{
                                scale: [0.9, 1.1, 0.9],
                                rotate: [0, 180]
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 1
                            }}
                        >
                            <Sparkles className="w-2 h-2 text-purple-400/50" />
                        </motion.div>
                    ))}
                </div>
            )}

            <motion.div 
                className="container mx-auto px-4 py-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Header */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-8 relative"
                        style={{ willChange: 'transform' }}
                        animate={{ 
                            y: [-8, 8, -8],
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Trophy className="w-10 h-10 text-white" />
                        <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            style={{ willChange: 'transform' }}
                            animate={{ 
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Star className="w-3 h-3 text-white" />
                        </motion.div>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-5xl md:text-7xl font-bold mb-6"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", damping: 20 }}
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Junior Developer
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Arena
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        🚀 Start your coding journey with easy LeetCode problems designed for beginners. 
                        <br />
                        <span className="text-purple-400 font-semibold">Build confidence with fundamental algorithms and data structures!</span>
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                {stats && (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {[
                            { label: 'Total Problems', value: stats.totalProblems, icon: Brain, color: 'from-blue-500 to-cyan-500' },
                            { label: 'Easy Problems', value: stats.easyProblems, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
                            { label: 'Daily Challenges', value: stats.dailyProblems, icon: Target, color: 'from-purple-500 to-pink-500' }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className={`bg-gradient-to-br ${stat.color}/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group shadow-lg`}
                                style={{ willChange: 'transform' }}
                                whileHover={{ 
                                    scale: 1.03,
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                
                                <motion.div
                                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}
                                    style={{ willChange: 'transform' }}
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <stat.icon className="w-6 h-6 text-white" />
                                </motion.div>
                                
                                <motion.div 
                                    className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-sm text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Daily Problem Card */}
                {dailyProblem && (
                    <motion.div 
                        className="max-w-5xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <motion.div 
                            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10"
                            style={{ willChange: 'transform' }}
                            whileHover={{ scale: 1.005 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20" />
                                <motion.div 
                                    className="relative z-10 flex items-center justify-between"
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div>
                                        <motion.h2 
                                            className="text-3xl font-bold text-white flex items-center gap-3 mb-3"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <motion.span
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                📅
                                            </motion.span>
                                            Today's Epic Challenge
                                        </motion.h2>
                                        <p className="text-blue-100 text-lg">
                                            {new Date(dailyProblem.featuredDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-blue-200 mb-2 font-medium"># {dailyProblem.id}</div>
                                        <motion.div 
                                            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getDifficultyColor(dailyProblem.difficulty)} rounded-full text-white font-semibold shadow-lg`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {getDifficultyIcon(dailyProblem.difficulty)}
                                            {dailyProblem.difficulty}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="p-8 space-y-8">
                                {/* Problem Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                        <Code2 className="w-8 h-8 text-purple-400" />
                                        {dailyProblem.title}
                                    </h3>
                                    <div className="prose prose-lg prose-invert max-w-none">
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {dailyProblem.description}
                                        </p>
                                    </div>
                                </motion.div>



                                {/* Constraints Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <motion.span
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            🎯
                                        </motion.span>
                                        Constraints
                                    </h4>
                                    <div className="space-y-3">
                                        {dailyProblem.constraints.map((constraint, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-start gap-4 group"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                            >
                                                <motion.div
                                                    className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0"
                                                    whileHover={{ scale: 1.5 }}
                                                    animate={{ 
                                                        boxShadow: [
                                                            "0 0 0 0 rgba(59, 130, 246, 0.3)",
                                                            "0 0 0 10px rgba(59, 130, 246, 0)",
                                                        ]
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <code className="text-gray-300 font-mono text-sm bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700 group-hover:border-purple-500/30 transition-colors duration-300">
                                                    {constraint}
                                                </code>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Interactive Steps */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Brain className="w-7 h-7 text-blue-400" />
                                        Problem-Solving Steps
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            "Read and understand the problem thoroughly",
                                            "Identify patterns and edge cases",
                                            "Design your algorithm approach",
                                            "Implement your solution",
                                            "Test with provided examples",
                                            "Optimize time and space complexity"
                                        ].map((step, index) => (
                                            <motion.div
                                                key={index}
                                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                                                    completedSteps.includes(index) 
                                                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                                                        : 'bg-slate-800/30 border-slate-700 hover:border-blue-500/30'
                                                }`}
                                                onClick={() => toggleStep(index)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1 + index * 0.1 }}
                                            >
                                                <motion.div
                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                                        completedSteps.includes(index)
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400'
                                                            : 'border-gray-500'
                                                    }`}
                                                    animate={completedSteps.includes(index) ? { scale: [1, 1.2, 1] } : {}}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {completedSteps.includes(index) ? (
                                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <span className="text-gray-400 font-bold">{index + 1}</span>
                                                    )}
                                                </motion.div>
                                                <span className={`font-medium ${
                                                    completedSteps.includes(index) ? 'text-green-300' : 'text-gray-300'
                                                }`}>
                                                    {step}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <motion.button 
                                        className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                                        onClick={() => window.open(dailyProblem.url, '_blank')}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <Zap className="w-6 h-6" />
                                        Solve on LeetCode
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                    
                                    <motion.button 
                                        className="flex-1 px-8 py-4 border-2 border-purple-500 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3"
                                        onClick={() => window.location.href = `/problems/${dailyProblem.slug}`}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.span
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        >
                                            📖
                                        </motion.span>
                                        View Solution
                                    </motion.button>
                                </motion.div>

                                {/* Browse All Problems Button */}
                                <motion.div 
                                    className="pt-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.3 }}
                                >
                                    <Link href="/junior/problems">
                                        <motion.button 
                                            className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-emerald-500/25"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            <motion.div
                                                animate={{ 
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 180, 360]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                            >
                                                📚
                                            </motion.div>
                                            Browse Easy Problems ({stats?.easyProblems || 88})
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </motion.div>
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}



                {/* Tips Section */}
                <motion.div 
                    className="max-w-5xl mx-auto mt-12"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    <motion.div 
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                        whileHover={{ scale: 1.01 }}
                    >
                        <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <motion.span
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                💡
                            </motion.span>
                            Pro Interview Tips
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h5 className="font-bold text-blue-300 text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Before You Start
                                </h5>
                                <ul className="space-y-3">
                                    {[
                                        "Read the problem statement twice",
                                        "Understand all constraints clearly",
                                        "Think about edge cases first",
                                        "Ask clarifying questions"
                                    ].map((tip, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-3 text-gray-300"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.4 + index * 0.1 }}
                                        >
                                            <motion.div
                                                className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                                            />
                                            {tip}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="space-y-4">
                                <h5 className="font-bold text-purple-300 text-lg flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Problem Solving
                                </h5>
                                <ul className="space-y-3">
                                    {[
                                        "Start with brute force approach",
                                        "Explain your thinking out loud",
                                        "Optimize step by step",
                                        "Test with provided examples"
                                    ].map((tip, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-start gap-3 text-gray-300"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.6 + index * 0.1 }}
                                        >
                                            <motion.div
                                                className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"
                                                animate={{ scale: [1, 1.3, 1] }}
                                                transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                                            />
                                            {tip}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
} 