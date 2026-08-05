import type { Request, Response, NextFunction } from 'express';
import { LeadStatus } from '@prisma/client';
import { LeadService } from '../services/leadService.js';
import { leadSchema, leadStatusSchema, adminLoginSchema } from '../validators/lead.js';
import { contactMessageSchema } from '../validators/contact.js';

export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  createLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = leadSchema.parse(req.body);
      const lead = await this.leadService.createLead(parsed);
      res.status(201).json({ success: true, data: lead });
    } catch (error) {
      next(error);
    }
  };

  createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = contactMessageSchema.parse(req.body);
      const message = await this.leadService.createContactMessage(parsed);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = adminLoginSchema.parse(req.body);
      const result = await this.leadService.adminLogin(parsed.email, parsed.password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, status, course } = req.query;

      const leads = await this.leadService.getLeads({
        search: typeof search === 'string' ? search : undefined,
        status: typeof status === 'string' ? (status as LeadStatus) : undefined,
        course: typeof course === 'string' ? course : undefined,
      });

      res.status(200).json({ success: true, data: leads });
    } catch (error) {
      next(error);
    }
  };

  getLeadById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const lead = await this.leadService.getLeadById(id);
      if (!lead) {
        res.status(404).json({ success: false, message: 'Lead not found' });
        return;
      }
      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const parsed = leadStatusSchema.parse(req.body);
      const updated = await this.leadService.updateLeadStatus(id, parsed.status as LeadStatus);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await this.leadService.getMessages();
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  };

  deleteLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.leadService.deleteLead(id);
      res.status(200).json({ success: true, message: 'Lead deleted' });
    } catch (error) {
      next(error);
    }
  };

  deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.leadService.deleteMessage(id);
      res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
      next(error);
    }
  };
}
