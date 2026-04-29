import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Home / Landing page
const Home = () => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 100%, rgba(124,58,237,0.12) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative orb */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '20px',
            padding: '0.35rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#818cf8',
            marginBottom: '1.5rem',
          }}
        >
          ✦ Multi-User SaaS Task Manager
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}
        >
          Organize your work
          <br />
          <span className="gradient-text">beautifully.</span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: '480px',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          A secure, private task manager where your tasks stay yours.
          Sign up in seconds and start getting things done.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/signup"
            id="home-signup-btn"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              animation: 'pulse-glow 3s infinite',
            }}
          >
            Get Started Free →
          </Link>
          <Link
            to="/login"
            id="home-login-btn"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Feature chips */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '3rem',
          }}
        >
          {['🔐 Secure JWT Auth', '⚡ Instant Updates', '🎯 Private Tasks', '📊 Progress Stats'].map(f => (
            <span
              key={f}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '0.4rem 0.9rem',
                fontSize: '0.8rem',
                color: '#64748b',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
