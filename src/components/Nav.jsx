import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: '홈' },
  { to: '/spec', label: '스펙' },
  { to: '/project', label: '프로젝트' },
  { to: '/chatbot', label: 'AI 챗봇' },
  { to: '/contact', label: '연락처' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
        이다연의 포트폴리오
      </NavLink>

      <button
        type="button"
        className="nav__toggle"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
      </button>

      <div className={`nav__links${open ? ' is-open' : ''}`}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
