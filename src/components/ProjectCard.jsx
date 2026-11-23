import { useState } from 'react';
import Card from './Card.jsx';

export default function ProjectCard({ project, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const stack = project.stack ?? [];

  return (
    <Card hover className="project-card">
      <button
        type="button"
        className="project-card__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          <span className="h2 project-card__title">{project.title}</span>
          <span className="caption project-card__period">{project.period}</span>
        </span>
        <span className="body-small project-card__chip">
          {open ? '접기 ▴' : '펼치기 ▾'}
        </span>
      </button>

      {open && (
        <div className="project-card__detail">
          {stack.length > 0 && (
            <div className="project-card__stack">
              {stack.map((tech) => (
                <span key={tech} className="stack-chip">{tech}</span>
              ))}
            </div>
          )}
          {project.role && <span className="body-small project-card__role">담당 역할: {project.role}</span>}
          {project.description && <p className="body project-card__desc">{project.description}</p>}
          {project.link && (
            <a className="body-small project-card__link" href={project.link} target="_blank" rel="noopener">
              {project.linkLabel || '프로젝트 링크'} ↗
            </a>
          )}
        </div>
      )}
    </Card>
  );
}
