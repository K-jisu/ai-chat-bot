'use client';

import { useEffect, useRef } from 'react';
import { MessageListProps, Message } from '@/types/chat';
import AIMessage from './AIMessage';

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 오면 자동으로 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 비어 있는 상태 */}
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">Send a message to begin chatting with AI</p>
            </div>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* 스크롤 앵커 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'order-2' : 'order-1'}`}>
        {isUser ? (
          <UserMessage content={message.content as string} timestamp={message.timestamp} />
        ) : (
          <AIMessage 
            response={message.content as any} 
            turnNumber={message.turnNumber || 1} 
          />
        )}
      </div>
    </div>
  );
}

function UserMessage({ content, timestamp }: { content: string; timestamp: Date }) {
  return (
    <div className="bg-blue-500 text-white rounded-2xl px-4 py-3 shadow-sm">
      <p className="text-sm leading-relaxed">{content}</p>
      <p className="text-xs text-blue-100 mt-1">
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
