'use client';

import { AIMessageProps, AIResponse } from '@/types/chat';
import { sanitizeHTML, validateMediaURL } from '@/utils/sanitization';

export default function AIMessage({ response, turnNumber }: AIMessageProps) {
  // 응답 구조 유효성 검사
  if (!response || typeof response.html !== 'string') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 shadow-sm">
        <p className="text-sm text-red-600">Invalid AI response format</p>
      </div>
    );
  }

  // HTML 콘텐츠 정제
  const sanitizedHTML = sanitizeHTML(response.html);

  // 응답에 미디어가 있으면 표시
  const shouldShowImage = !!response.image;
  const shouldShowVideo = !!response.video;

  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
      {/* HTML 콘텐츠 */}
      <div 
        className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />

      {/* 이미지 콘텐츠 */}
      {shouldShowImage && (
        <div className="mt-3">
          <ImageContent image={response.image!} />
        </div>
      )}

      {/* 비디오 콘텐츠 */}
      {shouldShowVideo && (
        <div className="mt-3">
          <VideoContent video={response.video!} />
        </div>
      )}

      {/* 턴 표시 (디버깅용) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-400">
          Turn {turnNumber}
          {shouldShowImage && ' (image)'}
          {shouldShowVideo && ' (video)'}
        </div>
      )}
    </div>
  );
}

function ImageContent({ image }: { image: NonNullable<AIResponse['image']> }) {
  // 이미지 URL 유효성 검사
  if (!validateMediaURL(image.src)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
        <p className="text-sm text-yellow-700">Invalid image URL</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <img
        src={image.src}
        alt={image.alt || 'AI generated image'}
        className="w-full h-auto max-w-sm rounded-lg shadow-sm"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const errorDiv = document.createElement('div');
          errorDiv.className = 'bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600';
          errorDiv.textContent = 'Failed to load image';
          target.parentNode?.appendChild(errorDiv);
        }}
      />
      {image.alt && (
        <p className="text-xs text-gray-500 mt-1">{image.alt}</p>
      )}
    </div>
  );
}

function VideoContent({ video }: { video: NonNullable<AIResponse['video']> }) {
  // 비디오 URL 유효성 검사
  if (!validateMediaURL(video.src)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
        <p className="text-sm text-yellow-700">Invalid video URL</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <video
        src={video.src}
        controls
        className="w-full h-auto max-w-sm rounded-lg shadow-sm"
        preload="metadata"
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
          const errorDiv = document.createElement('div');
          errorDiv.className = 'bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600';
          errorDiv.textContent = 'Failed to load video';
          target.parentNode?.appendChild(errorDiv);
        }}
      >
        Your browser does not support the video tag.
      </video>
      {video.title && (
        <p className="text-xs text-gray-500 mt-1">{video.title}</p>
      )}
    </div>
  );
}
