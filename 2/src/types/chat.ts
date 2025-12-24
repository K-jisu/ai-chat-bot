// AI Response interface for JSON data from AI service
export interface AIResponse {
  html: string; // Required: HTML content with formatting
  image?: MediaContent; // Optional: Image for turn 4
  video?: MediaContent; // Optional: Video for turn 6
}

// Media content interface for images and videos
export interface MediaContent {
  src: string;
  alt?: string; // Required for images
  title?: string; // Required for videos
}

// Message interface for chat messages
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string | AIResponse;
  timestamp: Date;
  turnNumber?: number;
}

// Chat state interface for managing conversation state
export interface ChatState {
  messages: Message[];
  currentTurn: number;
  isLoading: boolean;
  error: string | null;
}

// Chat action types for state management
export type ChatAction = 
  | { type: 'ADD_USER_MESSAGE'; payload: string }
  | { type: 'ADD_AI_MESSAGE'; payload: AIResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CHAT' };

// Sanitization configuration interface
export interface SanitizationConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
}

// Component prop interfaces
export interface ChatContainerProps {
  initialMessages?: Message[];
  onMessageSend: (message: string) => Promise<AIResponse>;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export interface AIMessageProps {
  response: AIResponse;
  turnNumber: number;
}