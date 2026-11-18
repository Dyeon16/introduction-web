import { useState } from 'react';
import Card from './Card.jsx';

export default function ProjectCard({ project }) {
  const [open, setOpen] = useState(!!project.defaultOpen);

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
          <div className="project-card__stack">
            {project.stack.map((tech) => (
              <span key={tech} className="stack-chip">{tech}</span>
            ))}
          </div>
          <span className="body-small project-card__role">담당 역할: {project.role}</span>
          <p className="body project-card__desc">{project.description}</p>
        </div>
      )}
    </Card>
  );
}
