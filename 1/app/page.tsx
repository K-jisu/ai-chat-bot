"use client";

import DOMPurify from "dompurify";
import { useEffect, useMemo, useRef, useState } from "react";

type MediaImage = {
  src: string;
  alt: string;
};

type MediaVideo = {
  src: string;
  title: string;
};

type AiTurn = {
  id: string;
  html: string;
  image?: MediaImage;
  video?: MediaVideo;
};

type Message = AiTurn & {
  role: "ai" | "user";
};

const aiScript: AiTurn[] = [
  {
    id: "ai-1",
    html: "<h2>새로운 여정을 시작해요</h2><p>모바일 메신저처럼 가볍게 이어지는 <b>선형 대화</b>입니다. 어떤 말을 해도 흐름은 끊기지 않고 다음 장면으로 넘어가요.</p><p><i>작은 상상</i>으로 시작해볼까요?</p>",
  },
  {
    id: "ai-2",
    html: "<p>지금 들고 있는 것은 따뜻한 머그컵. 손바닥에 감기는 온도, 그리고 잔잔한 <b>흔들림</b>을 떠올려보세요.</p>",
  },
  {
    id: "ai-3",
    html: "<h3>당신의 속도 체크</h3><ul><li>느긋하게, 천천히</li><li>조금은 설레고 빠르게</li><li>그냥 지금 느낌 그대로</li></ul><p>어떤 마음이든 괜찮아요.</p>",
  },
  {
    id: "ai-4",
    html: "<p>파도가 묻은 나무 데크 위를 걷습니다. 발끝에 물이 닿는 순간, 시원한 공기가 몰려오죠.</p>",
    image: {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      alt: "새벽 파도와 나무 산책로가 이어진 해변",
    },
  },
  {
    id: "ai-5",
    html: "<p>머리 위 갈매기 소리, 멀리서 들리는 버스커의 기타. 당신은 <b>어떤 멜로디</b>를 듣고 있나요?</p>",
  },
  {
    id: "ai-6",
    html: "<p>짧은 영상으로 공기를 전해볼게요. 들꽃 사이로 바람이 지나가는 순간을 상상하며 재생해보세요.</p>",
    video: {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: "햇살 아래 들꽃 필드",
    },
  },
  {
    id: "ai-7",
    html: "<p>당신의 말은 곧 <i>이야기 재료</i>가 됩니다. 방금 본 장면에서 한 가지 향을 고른다면 무엇일까요?</p>",
  },
  {
    id: "ai-8",
    html: "<h3>다음 장면 예고</h3><p>갈대숲 사이로 난 길, 그리고 초저녁 노을. 당신이 한 걸음 내디딜 때마다 조명이 켜집니다.</p>",
  },
  {
    id: "ai-9",
    html: "<p>조금 더 걸으며, 당신의 <b>목소리 톤</b>을 바꿔볼까요? 속삭이듯 말하거나, 장난스럽게 던져도 좋습니다.</p>",
  },
  {
    id: "ai-10",
    html: '<p>한 바퀴를 돌았어요. 계속 이어갈까요? <a href="https://example.com">링크</a>는 없지만 마음속 지도는 열려 있어요.</p>',
  },
];

const allowedTags = ["h1", "h2", "h3", "p", "br", "b", "strong", "i", "em", "ul", "ol", "li", "a"];
const allowedAttrs = ["href", "target", "rel"];

const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    FORBID_ATTR: ["style", "onerror", "onclick", "onload"],
  });

function SanitizedContent({ html }: { html: string }) {
  const safeHtml = useMemo(() => sanitizeHtml(html), [html]);

  return (
    <div
      className="space-y-2 text-sm leading-relaxed text-slate-50 [&_b]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_li]:list-disc [&_li]:ml-5 [&_a]:underline [&_a]:underline-offset-4"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAi = message.role === "ai";

  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[90%] rounded-2xl border px-4 py-3 shadow-lg sm:max-w-[80%] ${
          isAi
            ? "border-white/10 bg-white/5 text-white backdrop-blur"
            : "border-indigo-200/30 bg-indigo-500 text-white"
        }`}
      >
        <SanitizedContent html={message.html} />

        {message.image && (
          <figure className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black/30">
            <img
              src={message.image.src}
              alt={message.image.alt}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
            <figcaption className="px-3 py-2 text-xs text-slate-200/80">{message.image.alt}</figcaption>
          </figure>
        )}

        {message.video && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black/30">
            <video
              className="h-auto w-full"
              src={message.video.src}
              title={message.video.title}
              controls
              playsInline
              preload="metadata"
            />
            <div className="px-3 py-2 text-xs text-slate-200/80">{message.video.title}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const anchorHookApplied = useRef(false);
  const aiCursorRef = useRef(0);

  useEffect(() => {
    if (anchorHookApplied.current) return;
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noreferrer noopener");
      }
    });
    anchorHookApplied.current = true;
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      aiCursorRef.current = 1 % aiScript.length;
      const first = aiScript[0];
      setMessages([{ ...first, role: "ai" }]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const queueAiResponse = () => {
    setIsTyping(true);
    const delay = 650 + Math.random() * 400;

    window.setTimeout(() => {
      const turn = aiScript[aiCursorRef.current];
      aiCursorRef.current = (aiCursorRef.current + 1) % aiScript.length;
      setMessages((prev) => [...prev, { ...turn, role: "ai", id: `${turn.id}-${Date.now()}` }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userHtml = sanitizeHtml(`<p>${trimmed}</p>`);
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", html: userHtml },
    ]);
    setInput("");
    queueAiResponse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090f2c] via-[#0b122f] to-[#04060f] text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-6 pt-8 sm:px-6">
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">Linear Story</p>
            <h1 className="text-lg font-semibold text-white">AI Chat Flow</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-indigo-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            흐름 유지
          </div>
        </header>

        <div className="mt-4 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
          <div
            ref={scrollRef}
            className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto px-4 pb-28 pt-6"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-indigo-100">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-300" />
                다음 장면을 불러오는 중...
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 flex items-center gap-3 border-t border-white/10 bg-[#0b1124]/95 px-4 py-3 backdrop-blur"
          >
            <div className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-inner">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="어떤 말이든 남기면 다음 장면으로 이어집니다."
                className="h-full w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-900/60"
            >
              보내기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
