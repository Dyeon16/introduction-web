// AI 챗봇 페이지 동작
// - 빈 입력 전송 금지
// - 입력 글자수 500자 제한
// - API_GATEWAY(Bedrock 연동)로 질의 전송, 실패 시 데모 응답으로 대체
(function () {
  const MAX_LEN = 500;
  const FALLBACK_MESSAGE =
    '죄송해요, 그 부분은 제가 가진 정보로는 답변드리기 어려워요. 직접 연락처로 문의해주세요!';

  const log = document.querySelector('.chat-log');
  const form = document.querySelector('.chat-input');
  const textarea = document.querySelector('.chat-input textarea');
  const sendBtn = document.querySelector('.chat-send');
  const countEl = document.querySelector('.chat-count');

  if (!log || !textarea || !sendBtn || !countEl) return;

  function updateCount() {
    const len = textarea.value.length;
    countEl.textContent = `${len}/${MAX_LEN}`;
    countEl.classList.toggle('is-near-limit', len >= MAX_LEN);
    sendBtn.disabled = len === 0;
  }

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }

  function addBubble(text, variant) {
    const bubble = document.createElement('div');
    bubble.className = `bubble bubble--${variant}`;
    const span = document.createElement('span');
    span.className = 'body-small';
    span.textContent = text;
    bubble.appendChild(span);
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  async function askBot(message) {
    const apiUrl = window.APP_CONFIG && window.APP_CONFIG.CHAT_API_URL;

    // 엔드포인트가 아직 설정되지 않은 경우: 데모 응답
    if (!apiUrl) {
      await new Promise((r) => setTimeout(r, 500));
      return '[데모 응답] 아직 API 엔드포인트가 연결되지 않았어요. assets/js/config.js의 CHAT_API_URL을 배포된 API Gateway 주소로 교체해 주세요.';
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data && data.reply ? data.reply : FALLBACK_MESSAGE;
  }

  async function handleSend() {
    const text = textarea.value.trim();
    if (!text) return; // 빈 입력 전송 금지

    addBubble(text, 'user');
    textarea.value = '';
    updateCount();
    autoResize();

    const loadingBubble = addBubble('답변 생성 중...', 'loading');

    try {
      const reply = await askBot(text);
      loadingBubble.remove();
      addBubble(reply, 'bot');
    } catch (err) {
      loadingBubble.remove();
      addBubble('일시적으로 응답을 받아오지 못했어요. 잠시 후 다시 시도해 주세요.', 'error');
    }
  }

  textarea.addEventListener('input', () => {
    if (textarea.value.length > MAX_LEN) {
      textarea.value = textarea.value.slice(0, MAX_LEN);
    }
    updateCount();
    autoResize();
  });

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  updateCount();
})();
