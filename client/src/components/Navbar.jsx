import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/listings');
    setNavOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?search=${encodeURIComponent(search.trim())}`);
    setNavOpen(false);
  };

  const closeNav = () => setNavOpen(false);

  return (
    <nav className="navbar navbar-expand-md tripnest-navbar">
      <div className="container-fluid">

        {/* Brand */}
        <Link to="/listings" className="navbar-brand-link me-3" onClick={closeNav}>
          <i className="fa-regular fa-compass brand-icon"></i>
          <div className="brand-text-wrapper">
            <span className="brand-text">
              Trip<span className="brand-highlight">N</span>est
            </span>
            <span className="brand-tagline">Find your perfect stay</span>
          </div>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapse */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto d-flex align-items-center flex-wrap gap-2 py-2 py-md-0">

            {/* Search */}
            <form className="d-flex align-items-center me-2" role="search" onSubmit={handleSearch}>
              <input
                className="form-control search-input me-2"
                type="search"
                placeholder="Search destinations"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ minWidth: '160px' }}
              />
              <button className="search-btn btn" type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            {/* Nav links */}
            <Link className="nav-pill" to="/listings" onClick={closeNav}><b>Explore</b></Link>

            {currentUser ? (
              <>
                <Link className="nav-pill" to="/listings/new" onClick={closeNav}><b>Add listing</b></Link>
                <span className="nav-pill" style={{ cursor: 'default', opacity: 0.7 }}>
                  👤 {currentUser.username}
                </span>
                <button
                  className="nav-pill border-0 bg-transparent"
                  onClick={handleLogout}
                  style={{ cursor: 'pointer' }}
                >
                  <b>Log out</b>
                </button>
              </>
            ) : (
              <>
                <Link className="nav-pill" to="/signup" onClick={closeNav}><b>Sign up</b></Link>
                <Link className="nav-pill" to="/login" onClick={closeNav}><b>Log in</b></Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
