'use client';

import { useReducer, useCallback, useEffect } from 'react';
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

// 로컬스토리지는 Date 객체를 저장할 수 없으니 문자열로 직렬화한다.
type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string };

// 나중에 API로 바꿀 때 키만 교체하면 되도록 고정 키로 관리한다.
const CHAT_STORAGE_KEY = 'chat-history';

// 저장된 대화를 불러오되, 실패 시 빈 배열을 반환한다.
const loadChatHistory = (): Message[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as StoredMessage[];
    if (!Array.isArray(parsed)) return [];

    // 문자열로 저장된 시간을 Date로 되돌려 UI 표시/정렬에 사용한다.
    return parsed.map((message) => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load chat history', error);
    return [];
  }
};

// 저장된 AI 메시지 수로 다음 턴 번호를 계산한다.
const getNextTurnNumber = (messages: Message[]) =>
  messages.filter((message) => message.type === 'ai').length + 1;

// 새로고침 후에도 이어지도록 전체 메시지를 저장한다.
const persistChatHistory = (messages: Message[]) => {
  if (typeof window === 'undefined') return;

  const serializedMessages: StoredMessage[] = messages.map((message) => ({
    ...message,
    timestamp: message.timestamp.toISOString(),
  }));

  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializedMessages));
  } catch (error) {
    console.error('Failed to persist chat history', error);
  }
};

export default function ChatContainer({ initialMessages = [], onMessageSend }: ChatContainerProps) {
  // 초기 메시지로 시작하되, 클라이언트에서는 저장된 대화가 있으면 우선한다.
  const [state, dispatch] = useReducer(
    chatReducer,
    {
      ...initialState,
      messages: initialMessages,
    },
    (state) => {
      // lazy initializer로 렌더링마다 localStorage를 읽지 않게 한다.
      const storedMessages = loadChatHistory();
      if (storedMessages.length === 0) return state;

      return {
        ...state,
        messages: storedMessages,
        currentTurn: getNextTurnNumber(storedMessages),
      };
    }
  );

  const { keyboardHeight, isKeyboardVisible } = useKeyboardHeight();

  useEffect(() => {
    // AI/시스템 응답이 끝난 시점에만 저장한다.
    if (state.isLoading) return;
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage || (lastMessage.type !== 'ai' && lastMessage.type !== 'system')) return;

    persistChatHistory(state.messages);
  }, [state.isLoading, state.messages]);

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

