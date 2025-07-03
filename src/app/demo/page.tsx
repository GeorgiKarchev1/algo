'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LessonCard from '@/components/demo/LessonCard';
import ProgressTracker from '@/components/demo/ProgressTracker';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

// Sample lesson data
const sampleLessons = [
  {
    id: '1',
    title: 'Binary Search: Time Complexity',
    question: 'What is the time complexity of binary search on a sorted array?',
    description: 'Understanding the efficiency of binary search algorithm',
    code: `<span class="text-blue-400">function</span> <span class="text-yellow-400">binarySearch</span><span class="text-white">(arr, target) {</span>
  <span class="text-blue-400">let</span> <span class="text-white">left = 0, right = arr.length - 1;</span>
  
  <span class="text-blue-400">while</span> <span class="text-white">(left <= right) {</span>
    <span class="text-blue-400">let</span> <span class="text-white">mid = Math.floor((left + right) / 2);</span>
    
    <span class="text-blue-400">if</span> <span class="text-white">(arr[mid] === target) return mid;</span>
    <span class="text-blue-400">if</span> <span class="text-white">(arr[mid] < target) left = mid + 1;</span>
    <span class="text-blue-400">else</span> <span class="text-white">right = mid - 1;</span>
  <span class="text-white">}</span>
  
  <span class="text-blue-400">return</span> <span class="text-white">-1;</span>
<span class="text-white">}</span>`,
    answers: [
      {
        id: 'a',
        text: 'O(log n) - Logarithmic time',
        isCorrect: true,
        explanation: 'Correct! Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity.'
      },
      {
        id: 'b',
        text: 'O(n) - Linear time',
        isCorrect: false,
        explanation: 'Incorrect. Linear time would mean checking every element, which is what linear search does, not binary search.'
      },
      {
        id: 'c',
        text: 'O(n²) - Quadratic time',
        isCorrect: false,
        explanation: 'Incorrect. Quadratic time involves nested loops, which binary search doesn\'t use.'
      },
      {
        id: 'd',
        text: 'O(1) - Constant time',
        isCorrect: false,
        explanation: 'Incorrect. Constant time means the operation takes the same time regardless of input size, which isn\'t true for binary search.'
      }
    ],
    hint: 'Think about how the search space changes with each iteration. Does it get smaller by a constant amount or by a fraction?',
    timeEstimate: '2 min'
  },
  {
    id: '2',
    title: 'Array Access: Time Complexity',
    question: 'What is the time complexity of accessing an element in an array by index?',
    description: 'Understanding direct array access efficiency',
    code: `<span class="text-blue-400">function</span> <span class="text-yellow-400">getElement</span><span class="text-white">(arr, index) {</span>
  <span class="text-blue-400">return</span> <span class="text-white">arr[index];</span>
<span class="text-white">}</span>

<span class="text-green-400">// Example usage:</span>
<span class="text-blue-400">const</span> <span class="text-white">numbers = [1, 2, 3, 4, 5];</span>
<span class="text-blue-400">const</span> <span class="text-white">thirdElement = getElement(numbers, 2); // Returns 3</span>`,
    answers: [
      {
        id: 'a',
        text: 'O(1) - Constant time',
        isCorrect: true,
        explanation: 'Correct! Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct access.'
      },
      {
        id: 'b',
        text: 'O(n) - Linear time',
        isCorrect: false,
        explanation: 'Incorrect. We don\'t need to search through the array; we can jump directly to the index.'
      },
      {
        id: 'c',
        text: 'O(log n) - Logarithmic time',
        isCorrect: false,
        explanation: 'Incorrect. No searching or dividing is involved in direct array access.'
      }
    ],
    hint: 'Consider how arrays are stored in memory. Do we need to search for the element or can we access it directly?',
    timeEstimate: '1 min'
  },
  {
    id: '3',
    title: 'Bubble Sort: Space Complexity',
    question: 'What is the space complexity of the bubble sort algorithm?',
    description: 'Understanding memory usage in sorting algorithms',
    code: `<span class="text-blue-400">function</span> <span class="text-yellow-400">bubbleSort</span><span class="text-white">(arr) {</span>
  <span class="text-blue-400">for</span> <span class="text-white">(let i = 0; i < arr.length; i++) {</span>
    <span class="text-blue-400">for</span> <span class="text-white">(let j = 0; j < arr.length - i - 1; j++) {</span>
      <span class="text-blue-400">if</span> <span class="text-white">(arr[j] > arr[j + 1]) {</span>
        <span class="text-green-400">// Swap elements</span>
        <span class="text-blue-400">let</span> <span class="text-white">temp = arr[j];</span>
        <span class="text-white">arr[j] = arr[j + 1];</span>
        <span class="text-white">arr[j + 1] = temp;</span>
      <span class="text-white">}</span>
    <span class="text-white">}</span>
  <span class="text-white">}</span>
<span class="text-white">}</span>`,
    answers: [
      {
        id: 'a',
        text: 'O(1) - Constant space',
        isCorrect: true,
        explanation: 'Correct! Bubble sort only uses a constant amount of extra memory (like the temp variable), regardless of input size.'
      },
      {
        id: 'b',
        text: 'O(n) - Linear space',
        isCorrect: false,
        explanation: 'Incorrect. We don\'t create any additional arrays or data structures that grow with input size.'
      },
      {
        id: 'c',
        text: 'O(n²) - Quadratic space',
        isCorrect: false,
        explanation: 'Incorrect. The nested loops affect time complexity, not space complexity.'
      }
    ],
    hint: 'Look at what additional memory the algorithm uses. Does it create new arrays or just use a few variables?',
    timeEstimate: '2 min'
  }
];

const stages = [
  {
    id: 'arrays',
    title: 'Arrays',
    status: 'completed' as const,
    lessons: 3,
    completedLessons: 3
  },
  {
    id: 'search',
    title: 'Binary Search',
    status: 'current' as const,
    lessons: 4,
    completedLessons: 2
  },
  {
    id: 'sorting',
    title: 'Sorting',
    status: 'current' as const,
    lessons: 5,
    completedLessons: 1
  },
  {
    id: 'trees',
    title: 'Trees',
    status: 'locked' as const,
    lessons: 6,
    completedLessons: 0
  },
  {
    id: 'graphs',
    title: 'Graphs',
    status: 'locked' as const,
    lessons: 4,
    completedLessons: 0
  }
];

export default function DemoPage() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const currentLesson = sampleLessons[currentLessonIndex];

  const handleLessonComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < sampleLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      // Reset to first lesson for demo purposes
      setCurrentLessonIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="w-px h-6 bg-border" />
              <h1 className="text-xl font-semibold gradient-text">
                Lazy Algo Club Demo
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {sampleLessons.length}
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Tracker */}
        <ProgressTracker stages={stages} currentStage="search" />

        {/* Lesson Card */}
        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <LessonCard
            lesson={currentLesson}
            onComplete={handleLessonComplete}
            onNext={handleNext}
          />
        </motion.div>

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-center"
        >
          <h3 className="font-semibold text-yellow-500 mb-2">🎯 Demo Mode</h3>
          <p className="text-sm text-muted-foreground">
            This is a preview of the Lazy Algo Club learning experience. 
            In the full version, you&apos;ll have access to 50+ lessons across multiple topics with personalized progress tracking.
          </p>
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                Learn More About Full Version
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 