import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import InternshipList from './pages/InternshipList';
import InternshipDetails from './pages/InternshipDetails';
import Applications from './pages/Applications';

function NotFound() {
  return (
    <main className="page-container state-box not-found-box">
      <h1>404 — Page Not Found</h1>
      <p>The page or internship position you requested could not be found.</p>
      <Link to="/" className="button primary">
        Back to Internships
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-badge">S</span>
            <span className="brand-text">
              Intern<span className="brand-accent">Portal</span>
            </span>
          </div>
          <p className="footer-copy">
            ByteXL Student Internship Portal • Powered by MERN Stack & MongoDB
          </p>
          <div className="footer-links">
            <Link to="/">Internships</Link>
            <Link to="/applications">Applications</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
