'use client';

import { useReducer, useCallback } from 'react';
import { ChatState, ChatAction, Message, AIResponse, ChatContainerProps } from '@/types/chat';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// 채팅 상태 리듀서
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: action.payload,
        timestamp: new Date(),
      };
      return {
        ...state,
        messages: [...state.messages, userMessage],
        isLoading: true,
        error: null,
      };
    
    case 'ADD_AI_MESSAGE':
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: action.payload,
        timestamp: new Date(),
        turnNumber: state.currentTurn,
      };
      return {
        ...state,
        messages: [...state.messages, aiMessage],
        currentTurn: state.currentTurn + 1,
        isLoading: false,
        error: null,
      };

    case 'ADD_SYSTEM_MESSAGE':
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: action.payload,
        timestamp: new Date(),
      };
      return {
        ...state,
        messages: [...state.messages, systemMessage],
        isLoading: false,
        error: null,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'RESET_CHAT':
      return {
        messages: [],
        currentTurn: 1,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
};

// 초기 채팅 상태
const initialState: ChatState = {
  messages: [],
  currentTurn: 1,
  isLoading: false,
  error: null,
};

export default function ChatContainer({ initialMessages = [], onMessageSend }: ChatContainerProps) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    messages: initialMessages,
  });

  const { keyboardHeight, isKeyboardVisible } = useKeyboardHeight();

  const handleMessageSend = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    // 사용자 메시지 추가
    dispatch({ type: 'ADD_USER_MESSAGE', payload: message.trim() });

    try {
      // AI 응답 가져오기
      const aiResponse = await onMessageSend(message.trim());
      
      // AI 응답 추가
      if (aiResponse.type === 'system') {
        dispatch({ type: 'ADD_SYSTEM_MESSAGE', payload: aiResponse });
      } else {
        dispatch({ type: 'ADD_AI_MESSAGE', payload: aiResponse });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to get AI response' 
      });
    }
  }, [onMessageSend, state.isLoading]);

  return (
    <div 
      className="chat-container relative"
      style={{
        paddingBottom: isKeyboardVisible ? `${keyboardHeight}px` : '0px',
        transition: 'padding-bottom 0.2s ease-in-out'
      }}
    >
      {/* 헤더 */}
      <div className="flex-shrink-0 border-b border-white/5 px-5 py-4 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-wide text-neutral-100">AI Chat</h1>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={state.messages} isLoading={state.isLoading} />
      </div>

      {/* 에러 표시 */}
            {state.error && (         <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-24">           <div className="pointer-events-auto w-full max-w-md">             <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-lg">               <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700">                 !               </div>               <div className="flex-1">                 <p className="text-sm font-medium text-red-800">Something went wrong</p>                 <p className="text-sm text-red-700">{state.error}</p>               </div>               <button                 type="button"                 onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}                 className="text-xs font-medium text-red-700 hover:text-red-900"               >                 Dismiss               </button>             </div>           </div>         </div>       )}

      {/* 메시지 입력 */}
      <div className="message-input-container">
        <MessageInput
          onSend={handleMessageSend}
          disabled={state.isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}

