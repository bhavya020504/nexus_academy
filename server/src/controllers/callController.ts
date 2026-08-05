import type { Request, Response, NextFunction } from 'express';
import { CallStatus } from '@prisma/client';
import { CallService } from '../services/callService.js';

export class CallController {
  constructor(private readonly callService: CallService) {}

  getCalls = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId, status, evaluation } = req.query;
      const calls = await this.callService.getCalls({
        agentId: typeof agentId === 'string' ? agentId : undefined,
        status: typeof status === 'string' ? (status as CallStatus) : undefined,
        evaluation: typeof evaluation === 'string' ? evaluation : undefined,
      });
      res.status(200).json({ success: true, data: calls });
    } catch (error) {
      next(error);
    }
  };

  getCallById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const call = await this.callService.getCallById(id);
      if (!call) {
        res.status(404).json({ success: false, message: 'Call record not found' });
        return;
      }
      res.status(200).json({ success: true, data: call });
    } catch (error) {
      next(error);
    }
  };
}
