import Card from '../components/Card.jsx';
import { ResourceView } from '../components/Status.jsx';
import { useResource } from '../lib/api.js';

// 데이터: GET /api/spec → DynamoDB Query(PK=SPEC)
// 자격증(SK=CERT#...)은 취득일 최신순, 기술 스택(SK=SKILL#...)은 추가 순서로 Lambda가 정렬해서 반환
export default function Spec() {
  const { data, loading, error } = useResource('spec');
  const certificates = data?.certificates ?? [];
  const skills = data?.skills ?? [];
  const others = data?.others ?? []; // 어학/수상 (SK=LANG#..., AWARD#...)

  return (
    <section className="section">
      <div className="container stack" style={{ gap: 56 }}>

        <div className="stack gap-2">
          <span className="caption eyebrow">CERTIFICATE</span>
          <h1 className="h1">자격증</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)' }}>
            학습을 통해 취득한 자격증을 소개합니다.
          </p>

          <div className="cert-list" style={{ marginTop: 10 }}>
            <ResourceView loading={loading} error={error} isEmpty={!certificates.length} emptyText="아직 등록된 자격증이 없어요.">
              {certificates.map((cert) => (
                <Card key={cert.SK} hover className="cert-card">
                  <div className="cert-card__head">
                    <span className="caption" style={{ color: 'var(--ink-muted)' }}>자격증</span>
                    <span className="caption cert-card__date">{cert.date}</span>
                  </div>
                  <div className="cert-card__body">
                    <p className="h2 cert-card__title">{cert.title}</p>
                    <p className="body-small cert-card__issuer">{cert.issuer}</p>
                  </div>
                </Card>
              ))}
            </ResourceView>
          </div>
        </div>

        <div className="stack gap-2">
          <span className="caption eyebrow">SKILLSET</span>
          <h1 className="h1">기술 스택</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)', marginBottom: 6 }}>
            프로젝트와 학습 과정에서 사용한 기술입니다.
          </p>
          <ResourceView loading={loading} error={error} isEmpty={!skills.length} emptyText="아직 등록된 기술 스택이 없어요.">
            <div className="tag-grid">
              {skills.map((skill) => (
                <span key={skill.SK} className="tag">{skill.name}</span>
              ))}
            </div>
          </ResourceView>
        </div>

        {others.length > 0 && (
          <div className="stack gap-2">
            <span className="caption eyebrow">AWARDS · LANGUAGE</span>
            <h1 className="h1">어학 · 수상</h1>
            <div className="cert-list" style={{ marginTop: 10 }}>
              {others.map((item) => (
                <Card key={item.SK} hover className="cert-card">
                  <div className="cert-card__head">
                    <span className="caption" style={{ color: 'var(--ink-muted)' }}>
                      {item.SK.startsWith('LANG#') ? '어학' : item.SK.startsWith('AWARD#') ? '수상' : '기타'}
                    </span>
                    <span className="caption cert-card__date">{item.date}</span>
                  </div>
                  <div className="cert-card__body">
                    <p className="h2 cert-card__title">{item.title}</p>
                    {(item.issuer || item.detail) && (
                      <p className="body-small cert-card__issuer">
                        {[item.issuer, item.detail].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
