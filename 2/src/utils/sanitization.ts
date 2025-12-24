import DOMPurify from 'dompurify';
import { SanitizationConfig } from '@/types/chat';

// Sanitization configuration following security requirements
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

// Configure DOMPurify with our security settings
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

// Sanitize HTML content before rendering
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return as-is, will be sanitized on client
    return html;
  }
  
  configureDOMPurify();
  
  // Sanitize and ensure links have proper security attributes
  const sanitized = DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload', 'onmouseover'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
  });
  
  // Post-process to add security attributes to links
  if (sanitized.includes('<a ')) {
    return sanitized.replace(
      /<a\s+([^>]*href="[^"]*"[^>]*)>/gi,
      '<a $1 rel="noreferrer noopener" target="_blank">'
    );
  }
  
  return sanitized;
};

// Validate media URLs
export const validateMediaURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return SANITIZATION_CONFIG.allowedSchemes.includes(urlObj.protocol.slice(0, -1));
  } catch {
    return false;
  }
};