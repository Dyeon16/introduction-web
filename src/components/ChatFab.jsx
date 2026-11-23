import { Link } from 'react-router-dom';

export default function ChatFab() {
  return (
    <Link to="/chatbot" className="chat-fab" aria-label="AI 챗봇에게 물어보기">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 4.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.2 3.2A.5.5 0 0 1 4 18.8V16H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span>AI에게 물어보기</span>
    </Link>
  );
}
