import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/content.js';

export default function Project() {
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
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
