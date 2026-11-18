import Card from '../components/Card.jsx';
import { certificates, skills } from '../data/content.js';

export default function Spec() {
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
            {certificates.map((cert) => (
              <Card key={cert.title} hover className="cert-card">
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
          </div>
        </div>

        <div className="stack gap-2">
          <span className="caption eyebrow">SKILLSET</span>
          <h1 className="h1">기술 스택</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)', marginBottom: 6 }}>
            프로젝트와 학습 과정에서 사용한 기술입니다.
          </p>
          <div className="tag-grid">
            {skills.map((skill) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
