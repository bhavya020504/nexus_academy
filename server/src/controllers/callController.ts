import type { Request, Response, NextFunction } from 'express';
import { CallService } from '../services/callService.js';

export class CallController {
  constructor(private readonly callService: CallService) {}

  getCalls = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { agentId, status, direction, search } = req.query;
      const calls = await this.callService.getCalls({
        agentId: typeof agentId === 'string' ? agentId : undefined,
        status: typeof status === 'string' ? status : undefined,
        direction: typeof direction === 'string' ? direction : undefined,
        search: typeof search === 'string' ? search : undefined,
      });
      res.status(200).json({ success: true, data: calls });
    } catch (error: any) {
      console.error('Error in getCalls controller:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Failed to fetch call logs from SnapServe API',
      });
    }
  };

  getCallById = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const call = await this.callService.getCallById(id);
      if (!call) {
        res.status(404).json({ success: false, message: 'Call record not found' });
        return;
      }
      res.status(200).json({ success: true, data: call });
    } catch (error: any) {
      console.error('Error in getCallById controller:', error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Failed to fetch call details from SnapServe API',
      });
    }
  };
}
