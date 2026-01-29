import { Router } from 'express';
import * as controller from '../controllers/surveys.controller.js';
import { validate } from '../middleware/validation.js';
import { surveySchemas } from '../validators/schemas.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/surveys - List surveys with filters
router.get('/', validate(surveySchemas.query), controller.getAll);

// GET /api/surveys/current-week - Get current week's surveys
router.get('/current-week', controller.getCurrentWeek);

// GET /api/surveys/my-responses - Get current user's survey history
router.get('/my-responses', controller.getMyResponses);

// GET /api/surveys/:id - Get single survey response
router.get('/:id', validate(surveySchemas.getById), controller.getById);

// POST /api/surveys - Submit new survey response
router.post('/', validate(surveySchemas.create), controller.create);

// PUT /api/surveys/:id - Update survey response
router.put('/:id', validate(surveySchemas.update), controller.update);

// DELETE /api/surveys/:id - Delete survey response (admin only)
router.delete('/:id', requireRole(['admin']), controller.deleteSurvey);

export default router;
