// AI 서비스의 JSON 응답 인터페이스
export interface AIResponse {
  html: string; // 필수: 포맷이 포함된 HTML 콘텐츠
  image?: MediaContent; // 선택: 이미지 콘텐츠
  video?: MediaContent; // 선택: 비디오 콘텐츠
}

// 이미지/비디오용 미디어 콘텐츠 인터페이스
export interface MediaContent {
  src: string;
  alt?: string; // 이미지에 필요
  title?: string; // 비디오에 필요
}

// 채팅 메시지 인터페이스
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string | AIResponse;
  timestamp: Date;
  turnNumber?: number;
}

// 대화 상태 관리를 위한 인터페이스
export interface ChatState {
  messages: Message[];
  currentTurn: number;
  isLoading: boolean;
  error: string | null;
}

// 상태 관리를 위한 액션 타입
export type ChatAction = 
  | { type: 'ADD_USER_MESSAGE'; payload: string }
  | { type: 'ADD_AI_MESSAGE'; payload: AIResponse }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CHAT' };

// 정제 설정 인터페이스
export interface SanitizationConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
}

// 컴포넌트 props 인터페이스
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
