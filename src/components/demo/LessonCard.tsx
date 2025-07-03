'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowRight, Lightbulb, Code2, Clock } from 'lucide-react';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface LessonData {
  id: string;
  title: string;
  question: string;
  description: string;
  code?: string;
  answers: Answer[];
  hint: string;
  timeEstimate: string;
}

interface LessonCardProps {
  lesson: LessonData;
  onComplete: () => void;
  onNext: () => void;
}

export default function LessonCard({ lesson, onComplete, onNext }: LessonCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSelect = (answerId: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answerId);
  };

  const handleExplain = () => {
    if (!selectedAnswer) return;
    
    const answer = lesson.answers.find(a => a.id === selectedAnswer);
    if (answer) {
      setIsCorrect(answer.isCorrect);
      setShowExplanation(true);
      if (answer.isCorrect) {
        onComplete();
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
    setIsCorrect(null);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{lesson.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.timeEstimate}</span>
                  </div>
                </div>
              </div>
              
              {isCorrect !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>
            
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>

          {/* Question */}
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{lesson.question}</h3>
            
            {/* Code Block */}
            {lesson.code && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 rounded-xl p-4 mb-6 font-mono text-sm overflow-x-auto"
              >
                <pre className="text-neutral-300">
                  <code dangerouslySetInnerHTML={{ __html: lesson.code }} />
                </pre>
              </motion.div>
            )}

            {/* Answers */}
            <div className="space-y-3 mb-6">
              {lesson.answers.map((answer, index) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedAnswer === answer.id
                      ? showExplanation
                        ? answer.isCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : 'border-primary-500 bg-primary-500/10'
                      : 'border-border hover:border-border/80 hover:bg-white/5'
                  } ${showExplanation ? 'pointer-events-none' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedAnswer === answer.id
                        ? showExplanation
                          ? answer.isCorrect
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-primary-500 bg-primary-500'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedAnswer === answer.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{answer.text}</span>
                  </div>
                  
                  {/* Explanation */}
                  <AnimatePresence>
                    {showExplanation && selectedAnswer === answer.id && answer.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-border/50"
                      >
                        <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-500 mb-1">Hint</h4>
                      <p className="text-sm text-muted-foreground">{lesson.hint}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                disabled={showExplanation}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide hint' : 'Show hint'}
              </Button>
              
              <div className="flex gap-3">
                {!showExplanation ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleNext}>
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExplain}
                      disabled={!selectedAnswer}
                      className="group"
                    >
                      Explain
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={handleNext} className="group">
                    {isCorrect ? 'Continue' : 'Try again'}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 