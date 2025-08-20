'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Code, Zap, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-gradient opacity-20" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 rounded-full bg-primary-500/10 blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-32 right-20 w-24 h-24 rounded-full bg-secondary-500/10 blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-20 h-20 rounded-full bg-accent-500/10 blur-xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">


        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Learn algorithms{' '}
          <motion.span 
            className="gradient-text cursor-pointer"
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            transition={{ duration: 0.5 }}
          >
            without trying
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-block"
          >
            too hard
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              className="inline-block ml-2 text-yellow-400"
            >
              😴
            </motion.span>
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          DSA for humans, not grinders. Daily 1-minute challenges with visual explanations and zero pressure.
        </motion.p>

        {/* Features Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm cursor-pointer group"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Code className="w-4 h-4 text-primary-400 group-hover:text-pink-400 transition-colors" />
            </motion.div>
            <span className="group-hover:text-pink-400 transition-colors">Visual explanations 👀</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm cursor-pointer group"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-accent-400 group-hover:text-yellow-400 transition-colors" />
            </motion.div>
            <span className="group-hover:text-yellow-400 transition-colors">1-5 min sessions ⚡</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm cursor-pointer group"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-4 h-4 text-secondary-400 group-hover:text-green-400 transition-colors" />
            </motion.div>
            <span className="group-hover:text-green-400 transition-colors">Zero overwhelm 🧠</span>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/demo">
            <Button size="lg" className="group">
              Try the demo
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/junior">
            <Button variant="outline" size="lg" className="group border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
              Junior Track 🚀
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center justify-center gap-8 mt-16 text-sm text-muted-foreground"
        >
          <motion.div 
            className="text-center cursor-pointer group"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-2xl font-bold text-foreground group-hover:text-primary-400 transition-colors"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              5k+ 🚀
            </motion.div>
            <div className="group-hover:text-foreground transition-colors">Lazy learners</div>
          </motion.div>
          <motion.div 
            className="w-px h-8 bg-border"
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="text-center cursor-pointer group"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-2xl font-bold text-foreground group-hover:text-secondary-400 transition-colors"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              50+ 📚
            </motion.div>
            <div className="group-hover:text-foreground transition-colors">Concepts covered</div>
          </motion.div>
          <motion.div 
            className="w-px h-8 bg-border"
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          <motion.div 
            className="text-center cursor-pointer group"
            whileHover={{ scale: 1.1, y: -5 }}
          >
            <motion.div 
              className="text-2xl font-bold text-foreground group-hover:text-accent-400 transition-colors"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              98% 🎯
            </motion.div>
            <div className="group-hover:text-foreground transition-colors">Retention rate</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-muted-foreground rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 