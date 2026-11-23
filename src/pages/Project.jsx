import ProjectCard from '../components/ProjectCard.jsx';
import { ResourceView } from '../components/Status.jsx';
import { useResource } from '../lib/api.js';

// 데이터: GET /api/projects → DynamoDB Query(PK=PROJECT), 최신 프로젝트부터 정렬되어 옴
// 전체 목록을 한 번에 받고, 펼치기/접기는 서버 호출 없이 클라이언트에서 처리
export default function Project() {
  const { data, loading, error } = useResource('projects');
  const projects = data?.projects ?? [];

  return (
    <section className="section">
      <div className="container stack" style={{ gap: 28 }}>
        <div className="stack gap-2">
          <span className="caption eyebrow">PROJECTS</span>
          <h1 className="h1">프로젝트</h1>
          <p className="body-small" style={{ color: 'var(--ink-secondary)' }}>
            직접 기획하고 개발한 프로젝트를 소개합니다.
          </p>
        </div>

        <div className="project-list">
          <ResourceView loading={loading} error={error} isEmpty={!projects.length} emptyText="아직 등록된 프로젝트가 없어요.">
            {projects.map((project, i) => (
              <ProjectCard key={project.SK} project={project} defaultOpen={i === 0} />
            ))}
          </ResourceView>
        </div>
      </div>
    </section>
  );
}
