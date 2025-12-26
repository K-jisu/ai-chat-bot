import DOMPurify from 'dompurify';
import { SanitizationConfig } from '@/types/chat';

// 보안 요구사항에 맞춘 정제 설정
export const SANITIZATION_CONFIG: SanitizationConfig = {
  allowedTags: [
    'h1', 'h2', 'h3', 'p', 'br', 'b', 'strong', 'i', 'em', 
    'ul', 'ol', 'li', 'a'
  ],
  allowedAttributes: {
    'a': ['href', 'rel', 'target']
  },
  allowedSchemes: ['http', 'https']
};

// DOMPurify에 보안 설정 적용
export const configureDOMPurify = () => {
  if (typeof window !== 'undefined') {
    DOMPurify.setConfig({
      ALLOWED_TAGS: SANITIZATION_CONFIG.allowedTags,
      ALLOWED_ATTR: Object.keys(SANITIZATION_CONFIG.allowedAttributes).reduce(
        (acc, tag) => [...acc, ...SANITIZATION_CONFIG.allowedAttributes[tag]], 
        [] as string[]
      ),
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }
};

// 렌더링 전에 HTML 내용을 정제
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 그대로 반환하고 클라이언트에서 정제
    return html;
  }
  
  configureDOMPurify();
  
  // 정제 후 링크에 보안 속성 부여
  const sanitized = DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload', 'onmouseover'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
  });
  
  // 후처리로 링크에 보안 속성 추가
  if (sanitized.includes('<a ')) {
    return sanitized.replace(
      /<a\s+([^>]*href="[^"]*"[^>]*)>/gi,
      '<a $1 rel="noreferrer noopener" target="_blank">'
    );
  }
  
  return sanitized;
};

// 미디어 URL 유효성 검사
export const validateMediaURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return SANITIZATION_CONFIG.allowedSchemes.includes(urlObj.protocol.slice(0, -1));
  } catch {
    return false;
  }
};
