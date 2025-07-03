'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  lessons: number;
  completedLessons: number;
}

interface ProgressTrackerProps {
  stages: Stage[];
  currentStage: string;
}

export default function ProgressTracker({ stages, currentStage }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border/50">
        <div className="flex items-center gap-6 flex-1">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Stage Icon */}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  stage.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : stage.status === 'current'
                    ? 'bg-primary-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stage.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : stage.status === 'current' ? (
                    <Circle className="w-5 h-5 fill-current" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  
                  {/* Pulse animation for current stage */}
                  {stage.status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Stage Info */}
                <div className="min-w-0">
                  <h3 className={`text-sm font-medium truncate ${
                    stage.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {stage.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {stage.completedLessons}/{stage.lessons} lessons
                  </p>
                </div>
              </motion.div>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className={`h-px flex-1 transition-colors duration-300 ${
                  stages[index + 1].status !== 'locked' ? 'bg-primary-500' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="text-right ml-6">
          <div className="text-sm font-medium text-foreground">
            {stages.reduce((acc, stage) => acc + stage.completedLessons, 0)} / {stages.reduce((acc, stage) => acc + stage.lessons, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Progress</div>
        </div>
      </div>

      {/* Current Stage Details */}
      {(() => {
        const current = stages.find(s => s.id === currentStage);
        if (!current) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-primary-500/10 rounded-xl border border-primary-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary-400">Currently Learning</h4>
                <p className="text-sm text-muted-foreground">{current.title}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary-400">
                  {Math.round((current.completedLessons / current.lessons) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-primary-950/50 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(current.completedLessons / current.lessons) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
} 