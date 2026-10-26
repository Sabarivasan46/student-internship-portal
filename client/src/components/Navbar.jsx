import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-badge">S</span>
          <span className="brand-text">
            Intern<span className="brand-accent">Portal</span>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Internships
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Applications
          </NavLink>
        </nav>

        <Link to="/" className="cta-button">
          Browse Openings →
        </Link>
      </div>
    </header>
  );
}
