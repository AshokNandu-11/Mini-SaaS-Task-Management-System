import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav
      style={{
        background: 'rgba(15,15,26,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              ✦
            </div>
            <span
              className="gradient-text"
              style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}
            >
              TaskFlow
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {token ? (
            <>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                👋 {user?.email?.split('@')[0]}
              </span>
              <button
                id="logout-btn"
                onClick={handleLogout}
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(239,68,68,0.25)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(239,68,68,0.12)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: location.pathname === '/login' ? '#818cf8' : '#94a3b8',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
                style={{ textDecoration: 'none', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
