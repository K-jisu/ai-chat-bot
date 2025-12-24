'use client';

import { useReducer, useCallback } from 'react';
import { ChatState, ChatAction, Message, AIResponse, ChatContainerProps } from '@/types/chat';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// Chat state reducer
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

// Initial chat state
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

    // Add user message
    dispatch({ type: 'ADD_USER_MESSAGE', payload: message.trim() });

    try {
      // Get AI response
      const aiResponse = await onMessageSend(message.trim());
      
      // Add AI response
      dispatch({ type: 'ADD_AI_MESSAGE', payload: aiResponse });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to get AI response' 
      });
    }
  }, [onMessageSend, state.isLoading]);

  return (
    <div 
      className="chat-container bg-gray-50"
      style={{
        paddingBottom: isKeyboardVisible ? `${keyboardHeight}px` : '0px',
        transition: 'padding-bottom 0.2s ease-in-out'
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">AI Chat</h1>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={state.messages} isLoading={state.isLoading} />
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="flex-shrink-0 bg-red-50 border-t border-red-200 px-4 py-2">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      {/* Message Input */}
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