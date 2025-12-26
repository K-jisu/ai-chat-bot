'use client';

import { AIResponse } from '@/types/chat';
import ChatContainer from '@/components/ChatContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

// 테스트용 목업 AI 응답 데이터
const mockAIResponses: AIResponse[] = [
  {
    type: 'system',
    html: "<h2>AI 채팅에 오신 것을 환영합니다!</h2><p>무엇이든 도와드릴게요. 질문을 하셔도 되고 편하게 대화해도 좋아요.</p>"
  },
  {
    type: 'character',
    html: "<p>좋은 질문이에요! 잠깐 생각해볼게요.</p><p><strong>제가 생각한 내용은 다음과 같아요:</strong></p><ul><li>첫 번째 고려사항</li><li>두 번째 중요한 요소</li><li>세 번째 핵심 포인트</li></ul>"
  },
  {
    type: 'system',
    html: "<p>무엇을 묻는지 이해했어요. 자세히 설명해볼게요.</p><p><em>이 부분이 흥미로운 이유는...</em></p>"
  },
  {
    type: 'character',
    html: "<h3>이미지를 보여드릴게요!</h3><p>이 이미지는 우리가 이야기하는 내용을 돕기 위한 예시예요.</p>",
    image: {
      src: "https://picsum.photos/400/300?random=1",
      alt: "이미지 표시 기능을 보여주는 랜덤 이미지"
    }
  },
  {
    type: 'system',
    html: "<p>이 주제에 대해 더 설명을 이어갈게요.</p><p>고려해야 할 점이 몇 가지 있어요.</p>"
  },
  {
    type: 'character',
    html: "<h3>영상 데모를 보여드릴게요!</h3><p>이 영상은 실제 동작을 보여줍니다.</p>",
    video: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "샘플 영상 데모"
    }
  },
  {
    type: 'character',
    html: "<p>영상이 도움이 되었나요? 이 주제에 대해 더 궁금한 점이 있나요?</p>"
  },
  {
    type: 'system',
    html: "<p>대화가 즐거웠어요! 더 알고 싶은 게 있나요?</p>"
  },
  {
    type: 'system',
    html: "<p>언제든 도와드릴게요. 다른 질문이 있으면 편하게 물어보세요!</p>"
  },
  {
    type: 'character',
    html: "<h2>대화 종료</h2><p>샘플 대화의 끝에 도착했어요. 실제 서비스에서는 계속 이어질 수 있어요!</p>"
  }
];

let responseIndex = 0;

// 목업 AI 서비스 함수
async function mockAIService(message: string): Promise<AIResponse> {
  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // 다음 응답을 순서대로 반환
  const response = mockAIResponses[responseIndex % mockAIResponses.length];
  responseIndex++;
  
  return response;
}

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="h-screen bg-gray-50">
        <ChatContainer onMessageSend={mockAIService} />
      </div>
    </ErrorBoundary>
  );
}
