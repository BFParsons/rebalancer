import { Router } from 'express';
import * as controller from '../controllers/analytics.controller.js';
import { validate } from '../middleware/validation.js';
import { analyticsSchemas } from '../validators/schemas.js';

const router = Router();

// GET /api/analytics/team-trends - Historical team averages
router.get('/team-trends', validate(analyticsSchemas.teamTrends), controller.getTeamTrends);

// GET /api/analytics/user-trends/:userId - Individual member history
router.get('/user-trends/:userId', validate(analyticsSchemas.userTrends), controller.getUserTrends);

// GET /api/analytics/weekly-summary - Current week stats
router.get('/weekly-summary', validate(analyticsSchemas.weeklySummary), controller.getWeeklySummary);

// GET /api/analytics/stress-alerts - High stress members
router.get('/stress-alerts', controller.getStressAlerts);

// GET /api/analytics/capacity-distribution - Capacity breakdown
router.get('/capacity-distribution', controller.getCapacityDistribution);

export default router;
