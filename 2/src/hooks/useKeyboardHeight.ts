'use client';

import { useState, useEffect } from 'react';

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Visual Viewport API 지원 여부 확인
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport!;
      
      const handleViewportChange = () => {
        const windowHeight = window.innerHeight;
        const viewportHeight = visualViewport.height;
        const heightDifference = windowHeight - viewportHeight;
        
        // 높이 차이가 크면 키보드가 열린 것으로 판단
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
      // Visual Viewport API가 없는 브라우저용 대체 처리
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
