// Global error handler to ignore Chrome extension errors
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  const originalOnError = window.onerror;
  const originalOnUnhandledRejection = window.onunhandledrejection;

  // Block ALL Chrome extension scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName === 'SCRIPT' && element.getAttribute('src')?.includes('chrome-extension://')) {
            element.remove();
          }
        }
      });
    });
  });

  observer.observe(document.head, { childList: true, subtree: true });

  // Handle synchronous errors
  window.onerror = function(message, source, lineno, colno, error) {
    // Ignore ALL Chrome extension errors
    if (typeof source === 'string' && source.startsWith('chrome-extension://')) {
      return true; // Prevent default error handling
    }
    
    // Ignore specific Chrome extension error messages
    if (typeof message === 'string' && (
      message.includes('chrome-extension://') ||
      message.includes('extensionState.js') ||
      message.includes('utils.js') ||
      message.includes('heuristicsRedefinitions.js') ||
      message.includes('pejdijmoenmkgeppbflobdenhhabjlaj') ||
      message.includes('Failed to load resource') ||
      message.includes('net::ERR_FILE_NOT_FOUND') ||
      message.includes('Cannot read properties of null') ||
      message.includes('deref')
    )) {
      return true; // Prevent default error handling
    }

    // Call original handler if it exists
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }

    return false;
  };

  // Handle promise rejections
  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    
    // Ignore Chrome extension errors
    if (reason && typeof reason === 'string' && (
      reason.includes('chrome-extension://') ||
      reason.includes('extensionState.js') ||
      reason.includes('utils.js') ||
      reason.includes('heuristicsRedefinitions.js') ||
      reason.includes('pejdijmoenmkgeppbflobdenhhabjlaj')
    )) {
      event.preventDefault(); // Prevent default error handling
      return;
    }

    // Call original handler if it exists
    if (originalOnUnhandledRejection) {
      originalOnUnhandledRejection.call(window, event);
    }
  };

  // Handle console errors (for additional filtering)
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Ignore ALL Chrome extension errors
    if (message.includes('chrome-extension://') ||
        message.includes('extensionState.js') ||
        message.includes('utils.js') ||
        message.includes('heuristicsRedefinitions.js') ||
        message.includes('pejdijmoenmkgeppbflobdenhhabjlaj') ||
        message.includes('Failed to load resource') ||
        message.includes('net::ERR_FILE_NOT_FOUND') ||
        message.includes('FrameDoesNotExistError') ||
        message.includes('Cannot read properties of null') ||
        message.includes('deref') ||
        message.includes('content_script.js')) {
      return; // Don't log Chrome extension errors
    }

    // Call original console.error
    originalConsoleError.apply(console, args);
  };
}

  // Handle network errors (for Chrome extension resource loading)
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      // Block Chrome extension requests
      if (typeof input === 'string' && input.startsWith('chrome-extension://')) {
        return Promise.reject(new Error('Chrome extension requests blocked'));
      }
      
      return originalFetch.call(this, input, init);
    };
  }

  // Setup error handler when module is imported
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandler();
  } 