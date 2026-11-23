import Card from '../components/Card.jsx';
import ChatFab from '../components/ChatFab.jsx';
import { ResourceView } from '../components/Status.jsx';
import { useResource } from '../lib/api.js';

// 데이터: GET /api/profile → DynamoDB Query(PK=PROFILE), SK=MAIN 항목
export default function Home() {
  const { data, loading, error } = useResource('profile');
  const profile = data?.profile;
  const facts = profile?.facts ?? [];

  return (
    <>
      <ChatFab />

      <section className="hero">
        <div className="container">
          <ResourceView loading={loading} error={error} isEmpty={!profile} emptyText="아직 등록된 프로필이 없어요.">
            <div className="hero__inner">
              {profile?.photoUrl && (
                <img className="hero__photo" src={profile.photoUrl} alt={`${profile.name} 프로필 사진`} />
              )}
              <span className="caption eyebrow">PORTFOLIO</span>
              {profile?.school && <span className="body hero__school">{profile.school}</span>}
              <h1 className="display">{profile?.name}</h1>
              {profile?.intro && <p className="body hero__intro">{profile.intro}</p>}
            </div>
          </ResourceView>
        </div>
      </section>

      {facts.length > 0 && (
        <section className="section section--tight">
          <div className="container fact-grid">
            {facts.map((fact) => (
              <Card key={fact.label} hover className="fact-card">
                <span className="caption fact-card__label">{fact.label}</span>
                <p className="h2 fact-card__value">{fact.value}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {profile?.about && (
        <section className="section">
          <div className="container stack gap-4">
            <span className="caption eyebrow">ABOUT ME</span>
            <h2 className="h1">자기소개</h2>
            <Card className="about__body">
              <p className="body">{profile.about}</p>
            </Card>
          </div>
        </section>
      )}
    </>
  );
}
