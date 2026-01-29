import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

// Google OAuth
router.get('/google', authController.initiateGoogleAuth);
router.get('/google/callback', authController.googleCallback);

// Token management
router.post('/refresh', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

// Current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Development-only login (for testing without OAuth)
router.post('/dev-login', authController.devLogin);

export default router;
