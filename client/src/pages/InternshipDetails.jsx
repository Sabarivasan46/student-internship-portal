import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import { getInternshipById } from '../api';

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    getInternshipById(id)
      .then((data) => {
        if (isMounted) setInternship(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Unable to load internship details.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <main className="page-container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">← Back to All Internships</Link>
      </nav>

      {loading && (
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p>Fetching internship specifications...</p>
        </div>
      )}

      {error && (
        <div className="state-box error-box">
          <h2>Internship Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="button primary">
            Browse Available Positions
          </Link>
        </div>
      )}

      {!loading && !error && internship && (
        <div className="details-layout">
          {/* Details Column */}
          <article className="details-card">
            <header className="details-header">
              <div className="company-tag-row">
                <span className="company-badge">🏢 {internship.company}</span>
                <span className="mode-badge">{internship.mode || 'Internship'}</span>
              </div>
              <h1 className="details-title">{internship.title}</h1>
            </header>

            <div className="details-summary-grid">
              <div className="summary-item">
                <span className="summary-label">Location</span>
                <span className="summary-value">📍 {internship.location}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration</span>
                <span className="summary-value">⏱️ {internship.duration}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Monthly Stipend</span>
                <span className="summary-value stipend-highlight">💰 {internship.stipend}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Work Mode</span>
                <span className="summary-value">💼 {internship.mode || 'Full-time'}</span>
              </div>
            </div>

            <section className="details-section">
              <h3 className="section-subtitle">Role Description</h3>
              <p className="details-description">{internship.description}</p>
            </section>

            {internship.skills && internship.skills.length > 0 && (
              <section className="details-section">
                <h3 className="section-subtitle">Key Skills & Technologies</h3>
                <div className="skills-wrap">
                  {internship.skills.map((skill, index) => (
                    <span key={index} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Form Column */}
          <aside className="details-sidebar">
            <ApplicationForm internship={internship} />
          </aside>
        </div>
      )}
    </main>
  );
}
