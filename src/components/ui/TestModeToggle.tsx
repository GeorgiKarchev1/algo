'use client';

import { useState, useEffect } from 'react';

export default function TestModeToggle() {
  const [isTestMode, setIsTestMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toggle only in development or when explicitly enabled
    setIsVisible(
      process.env.NODE_ENV === 'development' || 
      process.env.NEXT_PUBLIC_ENABLE_TEST_MODE === 'true'
    );
  }, []);

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    // Store in localStorage for persistence
    localStorage.setItem('paddle-test-mode', (!isTestMode).toString());
  };

  useEffect(() => {
    // Load test mode preference from localStorage
    const savedTestMode = localStorage.getItem('paddle-test-mode');
    if (savedTestMode) {
      setIsTestMode(savedTestMode === 'true');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="test-mode"
              checked={isTestMode}
              onChange={toggleTestMode}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="test-mode" className="ml-2 text-sm font-medium text-yellow-800">
              Test Mode
            </label>
          </div>
          
          {isTestMode && (
            <div className="bg-yellow-200 px-2 py-1 rounded text-xs text-yellow-800 font-medium">
              TEST
            </div>
          )}
        </div>
        
        {isTestMode && (
          <div className="mt-2 text-xs text-yellow-700">
            <p>Using test cards:</p>
            <p>Success: 4000 0000 0000 0002</p>
            <p>Decline: 4000 0000 0000 0001</p>
          </div>
        )}
      </div>
    </div>
  );
}
