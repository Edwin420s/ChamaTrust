import React, { useEffect, useRef } from 'react';

const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    previousFocusRef.current = document.activeElement;

    // Get all focusable elements within the container
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        // Return focus to the previously focused element
        previousFocusRef.current?.focus();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore focus when the trap is cleaned up
      previousFocusRef.current?.focus();
    };
  }, [isActive]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
};

export default FocusTrap;
