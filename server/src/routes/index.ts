import { Router } from 'express';
import authRoutes from './auth.routes.js';
import teamMemberRoutes from './teamMembers.routes.js';
import surveyRoutes from './surveys.routes.js';
import analyticsRoutes from './analytics.routes.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Health check (public)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected routes
router.use('/team-members', authMiddleware, teamMemberRoutes);
router.use('/surveys', authMiddleware, surveyRoutes);
router.use('/analytics', authMiddleware, analyticsRoutes);

export default router;
