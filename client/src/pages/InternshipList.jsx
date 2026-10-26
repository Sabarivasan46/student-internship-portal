import { useEffect, useState } from 'react';
import InternshipCard from '../components/InternshipCard';
import { getInternships } from '../api';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInternships();
      setInternships(data);
    } catch (err) {
      setError(err.message || 'Unable to load internships.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">ByteXL Career Launchpad</span>
          <h1 className="hero-title">
            Discover Opportunities. <br />
            <span>Accelerate Your Career.</span>
          </h1>
          <p className="hero-subtitle">
            Explore verified industry internships in Software Development, Data Analytics,
            and Cloud Engineering. Apply directly with your student credentials.
          </p>
          <a href="#available-internships" className="button primary hero-button">
            Explore Internships ↓
          </a>
        </div>
      </section>

      {/* Internships Catalogue Section */}
      <section className="content-section" id="available-internships">
        <div className="section-header">
          <div>
            <span className="section-kicker">Curated Openings</span>
            <h2 className="section-title">Available Internships</h2>
          </div>
          {!loading && !error && (
            <span className="count-badge">{internships.length} Open Positions</span>
          )}
        </div>

        {loading && (
          <div className="state-box loading-box">
            <div className="spinner"></div>
            <p>Loading available internships from backend...</p>
          </div>
        )}

        {error && (
          <div className="state-box error-box">
            <p className="error-text">⚠️ {error}</p>
            <button className="button secondary" onClick={loadData}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && internships.length === 0 && (
          <div className="state-box empty-box">
            <p>No internships currently open. Please check back later.</p>
          </div>
        )}

        {!loading && !error && internships.length > 0 && (
          <div className="internship-grid">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
