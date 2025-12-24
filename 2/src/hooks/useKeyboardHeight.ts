'use client';

import { useState, useEffect } from 'react';

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Visual Viewport API is supported
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!;
      
      const handleViewportChange = () => {
        const windowHeight = window.innerHeight;
        const viewportHeight = visualViewport.height;
        const heightDifference = windowHeight - viewportHeight;
        
        // Consider keyboard visible if height difference is significant
        const keyboardVisible = heightDifference > 150;
        
        setKeyboardHeight(keyboardVisible ? heightDifference : 0);
        setIsKeyboardVisible(keyboardVisible);
      };

      visualViewport.addEventListener('resize', handleViewportChange);
      visualViewport.addEventListener('scroll', handleViewportChange);

      return () => {
        visualViewport.removeEventListener('resize', handleViewportChange);
        visualViewport.removeEventListener('scroll', handleViewportChange);
      };
    } else {
      // Fallback for browsers without Visual Viewport API
      const handleResize = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        const heightDifference = Math.abs(windowHeight - documentHeight);
        
        const keyboardVisible = heightDifference > 150;
        
        setKeyboardHeight(keyboardVisible ? heightDifference : 0);
        setIsKeyboardVisible(keyboardVisible);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return { keyboardHeight, isKeyboardVisible };
}