import { Link } from 'react-router-dom';

export default function InternshipCard({ internship }) {
  if (!internship) return null;

  return (
    <article className="internship-card" data-testid={`internship-card-${internship.id}`}>
      <div className="card-top">
        <div className="company-avatar">
          {internship.company ? internship.company.charAt(0) : 'I'}
        </div>
        <span className="mode-badge">{internship.mode || 'Internship'}</span>
      </div>

      <h3 className="card-title">{internship.title}</h3>
      <p className="card-company">{internship.company}</p>
      <p className="card-description">{internship.description}</p>

      {internship.skills && internship.skills.length > 0 && (
        <div className="skills-wrap">
          {internship.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="card-meta">
        <span>📍 {internship.location}</span>
        <span>⏱️ {internship.duration}</span>
      </div>

      <div className="card-footer">
        <div className="stipend-block">
          <span className="stipend-amount">{internship.stipend}</span>
          <span className="stipend-label">Stipend</span>
        </div>
        <Link to={`/internships/${internship.id}`} className="button secondary">
          View Details →
        </Link>
      </div>
    </article>
  );
}
