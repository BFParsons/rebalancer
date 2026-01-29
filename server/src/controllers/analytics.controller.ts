import type { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service.js';

export const getTeamTrends = async (req: Request, res: Response) => {
  try {
    const trends = await analyticsService.getTeamTrends(
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserTrends = async (req: Request, res: Response) => {
  try {
    const trends = await analyticsService.getUserTrends(
      req.params.userId,
      req.query.startDate as string,
      req.query.endDate as string
    );
    res.json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeeklySummary = async (req: Request, res: Response) => {
  try {
    const summary = await analyticsService.getWeeklySummary(req.query.week as string);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStressAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await analyticsService.getStressAlerts(req.query.week as string);
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCapacityDistribution = async (req: Request, res: Response) => {
  try {
    const distribution = await analyticsService.getCapacityDistribution(
      req.query.week as string
    );
    res.json(distribution);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
