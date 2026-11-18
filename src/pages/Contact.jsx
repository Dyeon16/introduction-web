import Card from '../components/Card.jsx';
import { contacts } from '../data/content.js';

export default function Contact() {
  return (
    <section className="section" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="container stack gap-4" style={{ maxWidth: 640 }}>
        <div className="stack gap-2">
          <span className="caption eyebrow">CONTACT</span>
          <h1 className="h1">연락처</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)' }}>
            아래 채널로 편하게 연락 주세요.
          </p>
        </div>

        <div className="contact-list">
          {contacts.map((c) => (
            <Card
              key={c.label}
              as="a"
              hover
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener' : undefined}
              className="contact-row"
            >
              <span className="contact-icon" aria-hidden="true">{c.icon}</span>
              <span>
                <span className="body-small contact-label">{c.label}</span>
                <span className="body contact-value">{c.value}</span>
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
