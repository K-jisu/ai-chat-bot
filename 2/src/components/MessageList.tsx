'use client';

import { useEffect, useRef } from 'react';
import { MessageListProps, Message, AIResponse } from '@/types/chat';
import AIMessage from './AIMessage';
import { sanitizeHTML } from '@/utils/sanitization';

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 오면 자동으로 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="message-list flex-1 overflow-y-auto px-5 py-6 space-y-3">
        {/* 비어 있는 상태 */}
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-neutral-400">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium text-neutral-200">
                Start a conversation
              </p>
              <p className="text-sm">
                Send a message to begin chatting with AI
              </p>
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
            <div className="bg-neutral-900/80 rounded-2xl px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)] border border-white/5 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-sm text-neutral-400">
                  AI is typing...
                </span>
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
  const isSystem = message.type === 'system';

  if (isSystem) {
    const systemContent = message.content as AIResponse;
    const sanitizedHTML = sanitizeHTML(systemContent.html || '');

    return (
      <div className="flex justify-center">
        <div
          className="max-w-[85%] rounded-2xl bg-neutral-900/70 px-4 py-2 text-center text-sm text-neutral-200 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/5 backdrop-blur"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
          isUser ? 'order-2' : 'order-1'
        }`}
      >
        {isUser ? (
          <UserMessage
            content={message.content as string}
            timestamp={message.timestamp}
          />
        ) : (
          <div className="flex items-start gap-3">
            <AIProfile />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">
                AI
              </p>
              <AIMessage response={message.content as any} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({
  content,
  timestamp,
}: {
  content: string;
  timestamp: Date;
}) {
  return (
    <div className="bg-gradient-to-br from-[#3a3d4a] to-[#2a2d37] text-white rounded-2xl px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.35)] border border-white/5">
      <p className="text-sm leading-relaxed text-neutral-100">{content}</p>
      <p className="text-xs text-neutral-400 mt-1">
        {timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
}

function AIProfile() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4b4f61] to-[#232531] text-xs font-semibold text-neutral-100 shadow-[0_6px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
      AI
    </div>
  );
}
