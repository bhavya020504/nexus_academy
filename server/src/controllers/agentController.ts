import type { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agentService.js';
import { createAgentSchema, updateAgentSchema } from '../validators/agent.js';

export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  getAgents = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const agents = await this.agentService.getAgents();
      res.status(200).json({ success: true, data: agents });
    } catch (error) {
      next(error);
    }
  };

  getAgentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const agent = await this.agentService.getAgentById(id);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Agent not found' });
        return;
      }
      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  };

  createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createAgentSchema.parse(req.body);
      const agent = await this.agentService.createAgent(parsed);
      res.status(201).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  };

  updateAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const parsed = updateAgentSchema.parse(req.body);
      const agent = await this.agentService.updateAgent(id, parsed);
      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  };

  deleteAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.agentService.deleteAgent(id);
      res.status(200).json({ success: true, message: 'Agent deleted' });
    } catch (error) {
      next(error);
    }
  };
}
