import { Router } from 'express';
import * as controller from '../controllers/teamMembers.controller.js';
import { validate } from '../middleware/validation.js';
import { teamMemberSchemas } from '../validators/schemas.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/team-members - List all team members
router.get('/', controller.getAll);

// GET /api/team-members/:id - Get single team member
router.get('/:id', validate(teamMemberSchemas.getById), controller.getById);

// POST /api/team-members - Create team member (admin/manager only)
router.post(
  '/',
  requireRole(['admin', 'manager']),
  validate(teamMemberSchemas.create),
  controller.create
);

// PUT /api/team-members/:id - Update team member (admin/manager only)
router.put(
  '/:id',
  requireRole(['admin', 'manager']),
  validate(teamMemberSchemas.update),
  controller.update
);

// DELETE /api/team-members/:id - Soft delete (admin only)
router.delete('/:id', requireRole(['admin']), controller.softDelete);

// PUT /api/team-members/:id/avatar - Update avatar
router.put('/:id/avatar', controller.updateAvatar);

// POST /api/team-members/:id/link-user - Link current user to team member
router.post('/:id/link-user', controller.linkToUser);

export default router;
