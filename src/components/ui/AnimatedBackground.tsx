'use client';

import React from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  'O(log n)',
  'if (true) {',
  'return 42;',
  '[1,2,3]',
  'while(lazy)',
  'sort()',
  'find()',
  'push()',
  '//TODO',
  'null',
  'async',
  'const',
  '===',
  '!==',
  '{}',
  '[]',
  'map()',
  'filter()',
  'reduce()',
  'setTimeout',
];

const FloatingElement = ({ children, delay = 0, duration = 20, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [windowDimensions, setWindowDimensions] = React.useState({ width: 1200, height: 800 });

  React.useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <motion.div
      className={`absolute text-primary-500/20 font-mono text-sm select-none pointer-events-none ${className}`}
      initial={{ 
        x: '-100px',
        y: Math.random() * windowDimensions.height,
        opacity: 0,
        rotate: Math.random() * 360
      }}
      animate={{
        x: windowDimensions.width + 100,
        y: Math.random() * windowDimensions.height,
        opacity: [0, 0.7, 0.7, 0],
        rotate: Math.random() * 360 + 180,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  );
};

const GeometricShape = ({ delay = 0, size = 40 }: { delay?: number; size?: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-secondary-500/10 to-accent-500/10 blur-sm"
    style={{
      width: size,
      height: size,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
    }}
    animate={{
      scale: [1, 1.2, 0.8, 1],
      rotate: [0, 180, 360],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const BinaryRain = ({ delay = 0 }: { delay?: number }) => {
  const [windowDimensions, setWindowDimensions] = React.useState({ width: 1200, height: 800 });

  React.useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <motion.div
      className="absolute text-primary-400/10 font-mono text-xs select-none pointer-events-none"
      initial={{
        x: Math.random() * windowDimensions.width,
        y: -50,
        opacity: 0
      }}
      animate={{
        y: windowDimensions.height + 50,
        opacity: [0, 0.5, 0]
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="mb-2">
          {Math.random() > 0.5 ? '1' : '0'}
        </div>
      ))}
    </motion.div>
  );
};

export default function AnimatedBackground() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Code Snippets */}
      {codeSnippets.map((snippet, index) => (
        <FloatingElement
          key={`code-${index}`}
          delay={index * 2}
          duration={25 + Math.random() * 10}
          className="text-xs md:text-sm"
        >
          {snippet}
        </FloatingElement>
      ))}

      {/* Geometric Shapes */}
      {Array.from({ length: 8 }, (_, i) => (
        <GeometricShape 
          key={`shape-${i}`} 
          delay={i * 3} 
          size={30 + Math.random() * 40}
        />
      ))}

      {/* Binary Rain */}
      {Array.from({ length: 5 }, (_, i) => (
        <BinaryRain key={`binary-${i}`} delay={i * 8} />
      ))}

      {/* Algorithm Visualization Bars */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={`bar-${i}`}
            className="inline-block w-2 bg-gradient-to-t from-primary-500 to-secondary-500 mr-1"
            style={{ height: Math.random() * 100 + 20 }}
            animate={{
              height: [
                Math.random() * 100 + 20,
                Math.random() * 100 + 20,
                Math.random() * 100 + 20,
              ],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Mathematical Symbols */}
      {['∑', '∞', 'π', '√', '∫', '∆', 'λ', 'Ω'].map((symbol, index) => (
        <motion.div
          key={`math-${index}`}
          className="absolute text-accent-500/20 text-2xl font-bold select-none pointer-events-none"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: index * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Cursor Trail Effect */}
      <motion.div
        className="absolute w-4 h-4 bg-primary-500/30 rounded-full blur-sm"
        animate={{
          x: [100, 1100, 100],
          y: [100, 700, 100],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
} 