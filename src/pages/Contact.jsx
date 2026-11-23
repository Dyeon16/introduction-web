import Card from '../components/Card.jsx';
import { ResourceView } from '../components/Status.jsx';
import { useResource } from '../lib/api.js';

const DEFAULT_ICON = { EMAIL: '@', GITHUB: 'GH' };

// 데이터: GET /api/contacts → DynamoDB Query(PK=CONTACT), order 필드 순으로 정렬되어 옴
// 이메일(mailto:)은 메일 작성창, http 링크는 새 탭으로 이동
export default function Contact() {
  const { data, loading, error } = useResource('contacts');
  const contacts = data?.contacts ?? [];

  return (
    <section className="section">
      <div className="container stack gap-4">
        <div className="stack gap-2">
          <span className="caption eyebrow">CONTACT</span>
          <h1 className="h1">연락처</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)' }}>
            아래 채널로 편하게 연락 주세요.
          </p>
        </div>

        <div className="contact-list">
          <ResourceView loading={loading} error={error} isEmpty={!contacts.length} emptyText="아직 등록된 연락처가 없어요.">
            {contacts.map((c) => {
              const href = c.href ?? '#';
              const external = href.startsWith('http');
              return (
                <Card
                  key={c.SK}
                  as="a"
                  hover
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener' : undefined}
                  className="contact-row"
                >
                  <span className="contact-icon" aria-hidden="true">
                    {c.icon ?? DEFAULT_ICON[c.SK] ?? '+'}
                  </span>
                  <span>
                    <span className="body-small contact-label">{c.label}</span>
                    <span className="body contact-value">{c.value}</span>
                  </span>
                </Card>
              );
            })}
          </ResourceView>
        </div>
      </div>
    </section>
  );
}
