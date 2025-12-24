'use client';

import { AIResponse } from '@/types/chat';
import ChatContainer from '@/components/ChatContainer';
import ErrorBoundary from '@/components/ErrorBoundary';

// Mock AI response data for testing
const mockAIResponses: AIResponse[] = [
  {
    html: "<h2>Welcome to AI Chat!</h2><p>I'm here to help you with anything you need. Feel free to ask me questions or just have a conversation.</p>"
  },
  {
    html: "<p>That's a great question! Let me think about that for a moment.</p><p><strong>Here's what I think:</strong></p><ul><li>First point to consider</li><li>Second important aspect</li><li>Third key element</li></ul>"
  },
  {
    html: "<p>I understand what you're asking about. Let me provide you with some detailed information.</p><p><em>This is particularly interesting because...</em></p>"
  },
  {
    html: "<h3>Here's an image for you!</h3><p>This image should help illustrate the concept we're discussing.</p>",
    image: {
      src: "https://picsum.photos/400/300?random=1",
      alt: "A beautiful random image to demonstrate image display functionality"
    }
  },
  {
    html: "<p>Let me continue with more information about this topic.</p><p>There are several aspects to consider here.</p>"
  },
  {
    html: "<h3>Here's a video demonstration!</h3><p>This video will show you exactly how this works in practice.</p>",
    video: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Sample video demonstration"
    }
  },
  {
    html: "<p>I hope that video was helpful! Do you have any other questions about this topic?</p>"
  },
  {
    html: "<p>Thank you for the great conversation! Is there anything else you'd like to know?</p>"
  },
  {
    html: "<p>I'm always here to help. Feel free to ask me anything else!</p>"
  },
  {
    html: "<h2>Conversation Complete</h2><p>We've reached the end of our sample conversation. In a real implementation, this would continue indefinitely!</p>"
  }
];

let responseIndex = 0;

// Mock AI service function
async function mockAIService(message: string): Promise<AIResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Return next response in sequence
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
