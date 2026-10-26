import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main className="page-container">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Database Tracker</span>
            <h1 className="section-title">Submitted Applications</h1>
            <p className="section-desc">
              Applications saved to MongoDB, retrieved in real time via <code>GET /api/applications</code>.
            </p>
          </div>
          <button
            className="button secondary refresh-button"
            onClick={loadApplications}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh Data'}
          </button>
        </div>

        {loading && (
          <div className="state-box loading-box">
            <div className="spinner"></div>
            <p>Fetching submitted applications from MongoDB...</p>
          </div>
        )}

        {error && (
          <div className="state-box error-box">
            <p className="error-text">⚠️ {error}</p>
            <button className="button secondary" onClick={loadApplications}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="state-box empty-box">
            <h3>No applications submitted yet</h3>
            <p>Select an internship from the catalogue and submit your application.</p>
            <Link to="/" className="button primary">
              Explore Internships →
            </Link>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                  <th>Internship Position</th>
                  <th>Application ID</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="cell-student font-semibold">
                      {app.studentName}
                    </td>
                    <td>
                      <span className="roll-badge">{app.rollNumber}</span>
                    </td>
                    <td className="cell-email">{app.email}</td>
                    <td>
                      <span className="internship-tag">
                        {app.internshipTitle || 'Internship'}
                      </span>
                    </td>
                    <td>
                      <code className="id-code">{app._id}</code>
                    </td>
                    <td className="cell-date">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
