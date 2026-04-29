require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { syncDB } = require('./models');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Security Headers (Helmet) ────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, curl) in development
    if (!origin && NODE_ENV === 'development') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed.`));
  },
  credentials: true,
}));

// ── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Prevent huge payload attacks

// ── Global Rate Limiter ──────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again later.' },
});
app.use(globalLimiter);

// ── Auth-specific Rate Limiter (stricter) ────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // max 20 login/signup attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Please wait 15 minutes and try again.' },
});

// ── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Mini SaaS Task API is running!',
    status: 'OK',
    env: NODE_ENV,
  });
});

// ── Routes ───────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', taskRoutes);

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  // Don't expose stack traces in production
  const message = NODE_ENV === 'production'
    ? 'An unexpected error occurred.'
    : err.message || 'An unexpected error occurred.';

  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: message });
});

// ── Start Server ─────────────────────────────────────────
syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT} [${NODE_ENV}]`);
  });
});
