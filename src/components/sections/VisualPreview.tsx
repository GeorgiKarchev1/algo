'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Play, CheckCircle, ArrowRight, Code2, Lightbulb, X, Zap } from 'lucide-react';

const demoQuestion = {
      question: "What&apos;s the time complexity of this binary search?",
  code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
  answers: [
    { id: 'a', text: 'O(log n) - Logarithmic time', isCorrect: true },
    { id: 'b', text: 'O(n) - Linear time', isCorrect: false },
    { id: 'c', text: 'O(n²) - Quadratic time', isCorrect: false },
    { id: 'd', text: 'O(1) - Constant time', isCorrect: false }
  ],
  hint: "Think about how the search space changes with each iteration. Does it get smaller by a constant amount or by a fraction?",
  explanation: "Correct! Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity. This is what makes it so efficient for searching sorted arrays!"
};

export default function VisualPreview() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showingCode, setShowingCode] = useState(true);

  const handleAnswerSelect = (answerId: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answerId);
  };

  const handleExplain = () => {
    if (!selectedAnswer) return;
    
    const answer = demoQuestion.answers.find(a => a.id === selectedAnswer);
    if (answer) {
      setIsCorrect(answer.isCorrect);
      setShowExplanation(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
    setIsCorrect(null);
    setShowingCode(true);
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            See it in action
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Try our interactive demo! This is exactly how learning works in the full platform.
          </p>
        </motion.div>

        {/* Interactive Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Main Demo Card */}
          <Card className="p-3 sm:p-4 md:p-6 lg:p-8 glass backdrop-blur-2xl border border-white/20 overflow-hidden">
            {/* Browser Window Mockup */}
            <div className="bg-neutral-900 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border-b border-neutral-700">
                <div className="flex gap-1.5 sm:gap-2">
                  <motion.div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-neutral-700 rounded-md sm:rounded-lg px-2 sm:px-3 md:px-4 py-1 text-xs sm:text-sm text-neutral-300">
                    <span className="hidden xs:inline">lazyalgoclub.com/demo</span>
                    <span className="xs:hidden">demo</span>
                    <span className="ml-1">🚀</span>
                  </div>
                </div>
                <motion.button
                  onClick={handleReset}
                  className="text-neutral-400 hover:text-white transition-colors"
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              </div>

              {/* Interactive Content Area */}
              <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] bg-gradient-to-br from-neutral-900 to-neutral-800">
                {/* Progress Bar */}
                <motion.div 
                  className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto">
                    <motion.div 
                      className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-xs sm:text-sm text-neutral-400">Arrays</span>
                    </motion.div>
                    <motion.div 
                      className="w-4 sm:w-6 md:w-8 h-px bg-neutral-600 flex-shrink-0"
                      animate={{ scaleX: [0, 1] }}
                      transition={{ delay: 0.5 }}
                    />
                    <motion.div 
                      className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary-500 flex items-center justify-center">
                        <motion.div 
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm text-white font-medium">
                        <span className="hidden xs:inline">Binary Search</span>
                        <span className="xs:hidden">Search</span>
                      </span>
                    </motion.div>
                    <div className="w-4 sm:w-6 md:w-8 h-px bg-neutral-600 flex-shrink-0" />
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-neutral-600" />
                      <span className="text-xs sm:text-sm text-neutral-400">Trees</span>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-400 flex-shrink-0 ml-2">
                    <motion.span
                      key={showExplanation ? 'complete' : 'progress'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {showExplanation ? '✨ Nice!' : '2/5'}
                    </motion.span>
                  </div>
                </motion.div>

                {/* Interactive Question Card */}
                <motion.div 
                  className="bg-card rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-white/10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <motion.div 
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                        <span className="hidden sm:inline">Binary Search: Time Complexity</span>
                        <span className="sm:hidden">Time Complexity</span>
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {demoQuestion.question}
                      </p>
                    </div>
                    {isCorrect !== null && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Interactive Code Block */}
                  <AnimatePresence mode="wait">
                    {showingCode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neutral-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 font-mono text-xs sm:text-sm overflow-hidden"
                      >
                        <pre className="text-neutral-300 whitespace-pre-wrap overflow-x-auto">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                          >
                            {demoQuestion.code.split('\n').map((line, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                {line}
                              </motion.div>
                            ))}
                          </motion.div>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive Answer Options */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {demoQuestion.answers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => handleAnswerSelect(answer.id)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAnswer === answer.id
                            ? showExplanation
                              ? answer.isCorrect
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-red-500 bg-red-500/10'
                              : 'border-primary-500 bg-primary-500/10'
                            : 'border-border hover:border-border/80 hover:bg-white/5'
                        } ${showExplanation ? 'pointer-events-none' : ''}`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <motion.div 
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                              selectedAnswer === answer.id
                                ? showExplanation
                                  ? answer.isCorrect
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                  : 'border-primary-500 bg-primary-500'
                                : 'border-muted-foreground'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {selectedAnswer === answer.id && (
                              <motion.div 
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              />
                            )}
                          </motion.div>
                          <span className="text-xs sm:text-sm font-medium">{answer.text}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hint Section */}
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="flex-shrink-0"
                          >
                            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mt-0.5" />
                          </motion.div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-yellow-500 mb-1 text-sm sm:text-base">💡 Hint</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{demoQuestion.hint}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Explanation Section */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                          isCorrect 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="flex-shrink-0"
                          >
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5" />
                            )}
                          </motion.div>
                          <div className="min-w-0">
                            <h4 className={`font-medium mb-1 text-sm sm:text-base ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                              {isCorrect ? '🎉 Correct!' : '❌ Not quite!'}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{demoQuestion.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                        disabled={showExplanation}
                        className="group text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <motion.div
                          animate={{ rotate: showHint ? 180 : 0 }}
                          className="mr-1 sm:mr-2"
                        >
                          <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.div>
                        <span className="hidden xs:inline">{showHint ? 'Hide hint' : 'Show hint'}</span>
                        <span className="xs:hidden">Hint</span>
                        <span className="ml-1">💡</span>
                      </Button>
                    </motion.div>
                    
                    <div className="flex gap-2 sm:gap-3">
                      {!showExplanation ? (
                        <>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs sm:text-sm px-2 sm:px-3">
                              <span className="hidden xs:inline">Skip</span>
                              <span className="xs:hidden">Skip</span>
                              <span className="ml-1">⏭️</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={handleExplain}
                              disabled={!selectedAnswer}
                              className="group relative overflow-hidden text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <motion.div
                                animate={{ x: selectedAnswer ? 0 : 5 }}
                                transition={{ type: "spring" }}
                              >
                                <span className="hidden xs:inline">Explain</span>
                                <span className="xs:hidden">Go</span>
                                <span className="ml-1">✨</span>
                              </motion.div>
                              <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button size="sm" onClick={handleReset} className="group text-xs sm:text-sm px-2 sm:px-3">
                            <span className="hidden xs:inline">Try Again</span>
                            <span className="xs:hidden">Again</span>
                            <span className="ml-1">🔄</span>
                            <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>

          {/* Interactive Floating Elements - Hidden on mobile */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open('/demo', '_blank')}
            className="absolute -top-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg cursor-pointer group hidden sm:flex"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white group-hover:text-yellow-200 transition-colors" />
            </motion.div>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -bottom-8 -left-8 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer group hidden sm:flex"
            onClick={handleReset}
          >
            <motion.div
              animate={{ 
                scale: showExplanation ? [1, 1.2, 1] : 1,
                rotate: showExplanation ? [0, 360] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white group-hover:text-green-200 transition-colors" />
            </motion.div>
          </motion.div>

          {/* Floating Action Bubble - Hidden on mobile */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('/demo', '_blank')}
                className="absolute top-1/2 -translate-y-1/2 -right-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full p-3 sm:p-4 shadow-2xl cursor-pointer group hidden lg:block"
              >
                <div className="flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <span className="group-hover:text-yellow-200 transition-colors">
                    More like this! 🚀
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <motion.p 
            className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            This is just a taste! The full platform has{' '}
            <span className="text-primary-400 font-semibold">hundreds</span> of interactive lessons.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="group relative overflow-hidden w-full sm:w-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="hidden sm:inline">Start Learning Now</span>
                <span className="sm:hidden">Start Now</span>
                <span className="ml-1 sm:ml-2">✨</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('/demo', '_blank')}
                className="group w-full sm:w-auto"
              >
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">View Full Demo</span>
                <span className="sm:hidden">Full Demo</span>
                <span className="ml-1 sm:ml-2">🎮</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 