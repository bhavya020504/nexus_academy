import type { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getDashboardData = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.analyticsService.getDashboardData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getAnalyticsData = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.analyticsService.getAnalyticsData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
