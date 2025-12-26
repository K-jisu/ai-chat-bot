'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageInputProps } from '@/types/chat';

export default function MessageInput({
  onSend,
  disabled,
  placeholder = 'Type your message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 영역 자동 리사이즈
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // 마운트 시 입력창 포커스
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
      // 텍스트 영역 높이 초기화
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="px-5 pb-5 pt-3">
      <div className="flex items-center space-x-3">
        {/* 텍스트 입력 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full resize-none rounded-2xl bg-[#1a1c22]/90 px-4 py-3 pr-12
              text-sm leading-relaxed text-neutral-100 placeholder:text-neutral-500
              focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10
              disabled:bg-neutral-900/60 disabled:cursor-not-allowed
              max-h-[120px] overflow-y-auto
            `}
            style={{ minHeight: '48px' }}
          />

          {/* 글자 수 표시(선택) */}
          {message.length > 100 && (
            <div className="absolute bottom-1 right-12 text-xs text-neutral-500">
              {message.length}
            </div>
          )}
        </div>

        {/* 전송 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`
            flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-200 touch-manipulation
            ${
              disabled || !message.trim()
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-[#51556a] to-[#303444] text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] hover:from-[#5d6178] hover:to-[#3a3e52]'
            }
          `}
          style={{ minHeight: '44px', minWidth: '44px' }} // 접근성: 최소 터치 영역 확보
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile keyboard handling */}
      <style jsx>{`
        @media (max-width: 768px) {
          .message-input-container {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}
