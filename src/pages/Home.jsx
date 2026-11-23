import Card from '../components/Card.jsx';
import ChatFab from '../components/ChatFab.jsx';
import { profile, quickFacts } from '../data/content.js';

export default function Home() {
  return (
    <>
      <ChatFab />

      <section className="hero">
        <div className="container hero__inner">
          <span className="caption eyebrow">PORTFOLIO</span>
          <span className="body hero__school">{profile.school}</span>
          <h1 className="display">{profile.name}</h1>
          <p className="body hero__intro">{profile.intro}</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container fact-grid">
          {quickFacts.map((fact) => (
            <Card key={fact.label} hover className="fact-card">
              <span className="caption fact-card__label">{fact.label}</span>
              <p className="h2 fact-card__value">{fact.value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container stack gap-4">
          <span className="caption eyebrow">ABOUT ME</span>
          <h2 className="h1">자기소개</h2>
          <Card className="about__body">
            <p className="body">{profile.about}</p>
          </Card>
        </div>
      </section>
    </>
  );
}
