import DOMPurify from 'dompurify';

export default function MessageBubble({ data, isUser }) {
  const sanitize = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  };

  return (
    <div className={`message-row ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className="message-bubble">
        {isUser ? (
          <div className="message-text">{data.text}</div>
        ) : (
          <div 
            className="message-html"
            dangerouslySetInnerHTML={{ __html: sanitize(data.html) }}
          />
        )}
        
        {data.image && (
          <div className="message-media">
            <img src={data.image.src} alt={data.image.alt} />
          </div>
        )}

        {data.video && (
          <div className="message-media">
            <video controls>
              <source src={data.video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
