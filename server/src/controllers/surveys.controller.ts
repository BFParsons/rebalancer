import type { Request, Response } from 'express';
import { surveysService } from '../services/surveys.service.js';

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await surveysService.getAll({
      week: req.query.week as string,
      teamMemberId: req.query.teamMemberId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    });

    res.set('X-Total-Count', result.pagination.total.toString());
    res.set('X-Page', result.pagination.page.toString());
    res.set('X-Per-Page', result.pagination.limit.toString());

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentWeek = async (req: Request, res: Response) => {
  try {
    const surveys = await surveysService.getCurrentWeek();
    res.json(surveys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyResponses = async (req: Request, res: Response) => {
  try {
    if (!req.user?.teamMemberId) {
      return res.status(400).json({ error: 'User is not linked to a team member' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const surveys = await surveysService.getMyResponses(req.user.teamMemberId, limit);
    res.json(surveys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const survey = await surveysService.getById(req.params.id);
    res.json(survey);
  } catch (error: any) {
    if (error.message === 'Survey response not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    // Use current user's teamMemberId if not provided
    const teamMemberId = req.body.teamMemberId || req.user?.teamMemberId;

    if (!teamMemberId) {
      return res.status(400).json({
        error: 'Team member ID required. User is not linked to a team member.',
      });
    }

    const survey = await surveysService.create({
      ...req.body,
      teamMemberId,
    });

    res.status(201).json(survey);
  } catch (error: any) {
    if (error.message === 'Survey response already exists for this week') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const survey = await surveysService.update(req.params.id, req.body);
    res.json(survey);
  } catch (error: any) {
    if (error.message === 'Survey response not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteSurvey = async (req: Request, res: Response) => {
  try {
    await surveysService.delete(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Survey response not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
