import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors.js';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for Railway (required for rate limiting behind reverse proxy)
if (config.env === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware - configure for serving frontend
app.use(helmet({
  contentSecurityPolicy: config.env === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://accounts.google.com"],
    },
  } : false,
}));
app.use(corsConfig);

// Parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookie.secret));

// Logging
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
}

// Rate limiting
app.use(rateLimiter);

// API routes
app.use('/api', routes);

// Serve static frontend in production
if (config.env === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../build');
  app.use(express.static(frontendBuildPath));

  // Catch-all route for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // 404 handler for development (frontend runs separately)
  app.use(notFoundHandler);
}

// Error handling
app.use(errorHandler);

export default app;
