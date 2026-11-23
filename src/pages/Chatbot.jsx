import { useRef, useState } from 'react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { askBot } from '../lib/chatApi.js';
import { initialChatMessages, CHAT_FALLBACK_MESSAGE } from '../data/content.js';

const MAX_LEN = 500;

export default function Chatbot() {
  const [messages, setMessages] = useState(initialChatMessages);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
  };

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || loading) return; // 빈 입력 전송 금지

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setText('');
    setLoading(true);
    scrollToBottom();

    try {
      const reply = await askBot(trimmed);
      setMessages((prev) => [...prev, { role: 'bot', text: reply ?? CHAT_FALLBACK_MESSAGE }]);
    } catch (err) {
      const text = err?.message?.startsWith('요청이 너무')
        ? err.message // API Gateway 요청 속도 제한(429)
        : '일시적으로 응답을 받아오지 못했어요. 잠시 후 다시 시도해 주세요.';
      setMessages((prev) => [...prev, { role: 'error', text }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const count = text.length;

  return (
    <section className="section">
      <div className="container chat-panel">
        <div className="stack gap-2">
          <span className="caption eyebrow">AI CHAT</span>
          <h1 className="h1">AI 챗봇에게 물어보세요</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)' }}>
            이력서 내용을 바탕으로 궁금한 점에 답해드려요.
          </p>
        </div>

        <Card className="chat-box">
          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.role}`}>
                <span className="body-small">{m.text}</span>
              </div>
            ))}
            {loading && (
              <div className="bubble bubble--loading">
                <span className="body-small">답변 생성 중...</span>
              </div>
            )}
          </div>

          <div className="chat-input">
            <div className="chat-input__row">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
                onKeyDown={handleKeyDown}
                placeholder="궁금한 점을 입력해 주세요"
                rows={1}
                maxLength={MAX_LEN}
              />
              <Button type="button" onClick={handleSend} disabled={!text.trim() || loading}>
                전송
              </Button>
            </div>
            <span className={`caption chat-count${count >= MAX_LEN ? ' is-near-limit' : ''}`}>
              {count}/{MAX_LEN}
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
