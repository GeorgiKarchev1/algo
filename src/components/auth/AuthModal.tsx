'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onSuccess 
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Safe event handlers
  const handleClose = useCallback(() => {
    try {
      onClose();
    } catch (error) {
      // Ignore Chrome extension errors
      if (error instanceof Error && error.message.includes('chrome-extension://')) {
        return;
      }
      console.error('Error closing modal:', error);
    }
  }, [onClose]);

  const handleSuccess = useCallback(() => {
    try {
      onSuccess?.();
      onClose();
    } catch (error) {
      // Ignore Chrome extension errors
      if (error instanceof Error && error.message.includes('chrome-extension://')) {
        return;
      }
      console.error('Error in success handler:', error);
    }
  }, [onSuccess, onClose]);

  // Reset mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);



  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 400,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationStart={() => {
            // Prevent Chrome extension interference
            try {
              document.body.style.pointerEvents = 'auto';
            } catch {
              // Ignore Chrome extension errors
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {mode === 'login' && (
                  <LoginForm
                    onSuccess={handleSuccess}
                    onSwitchToSignUp={() => setMode('signup')}
                    onSwitchToReset={() => setMode('reset')}
                  />
                )}
                
                {mode === 'signup' && (
                  <SignUpForm
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => setMode('login')}
                  />
                )}
                
                {mode === 'reset' && (
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-50">
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      
                      <h2 className="text-3xl font-bold text-white mb-2">
                        Reset Password 🔑
                      </h2>
                      <p className="text-gray-400 mb-8">
                        We&apos;ll send you a link to reset your password
                      </p>
                      
                      <div className="space-y-4">
                        <input
                          type="email"
                          name="resetEmail"
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-300"
                          autoComplete="email"
                          spellCheck="false"
                          data-form-type="other"
                        />
                        
                        <motion.button
                          className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Send Reset Link 📧
                        </motion.button>
                        
                        <button
                          onClick={() => setMode('login')}
                          className="w-full text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                          ← Back to Sign In
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 