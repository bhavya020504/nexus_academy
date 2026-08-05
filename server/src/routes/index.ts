import { Router } from 'express';
import { CourseController } from '../controllers/courseController.js';
import { LeadController } from '../controllers/leadController.js';
import { AgentController } from '../controllers/agentController.js';
import { CallController } from '../controllers/callController.js';
import { AnalyticsController } from '../controllers/analyticsController.js';

import { CourseService } from '../services/courseService.js';
import { LeadService } from '../services/leadService.js';
import { AgentService } from '../services/agentService.js';
import { CallService } from '../services/callService.js';
import { AnalyticsService } from '../services/analyticsService.js';

import { CourseRepository } from '../repositories/courseRepository.js';
import { LeadRepository } from '../repositories/leadRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';
import { AdminRepository } from '../repositories/adminRepository.js';
import { AgentRepository } from '../repositories/agentRepository.js';
import { CallRepository } from '../repositories/callRepository.js';

import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Repositories
const courseRepository = new CourseRepository();
const leadRepository = new LeadRepository();
const contactRepository = new ContactRepository();
const adminRepository = new AdminRepository();
const agentRepository = new AgentRepository();
const callRepository = new CallRepository();

// Services
const courseService = new CourseService(courseRepository);
const agentService = new AgentService(agentRepository);
const callService = new CallService(callRepository);
const analyticsService = new AnalyticsService();
const leadService = new LeadService(
  leadRepository,
  contactRepository,
  adminRepository,
  agentRepository,
  callRepository,
);

// Controllers
const courseController = new CourseController(courseService);
const leadController = new LeadController(leadService);
const agentController = new AgentController(agentService);
const callController = new CallController(callService);
const analyticsController = new AnalyticsController(analyticsService);

// Public Routes
router.get('/courses', courseController.getCourses);
router.post('/leads', leadController.createLead);
router.post('/contact', leadController.createContactMessage);
router.post('/admin/login', leadController.adminLogin);

// Protected Admin Routes
// Dashboard & Analytics
router.get('/admin/dashboard', requireAuth, analyticsController.getDashboardData);
router.get('/admin/analytics', requireAuth, analyticsController.getAnalyticsData);

// Leads Management
router.get('/admin/leads', requireAuth, leadController.getLeads);
router.get('/admin/leads/:id', requireAuth, leadController.getLeadById);
router.patch('/admin/leads/:id', requireAuth, leadController.updateLeadStatus);
router.delete('/admin/leads/:id', requireAuth, leadController.deleteLead);

// Agents Management
router.get('/admin/agents', requireAuth, agentController.getAgents);
router.get('/admin/agents/:id', requireAuth, agentController.getAgentById);
router.post('/admin/agents', requireAuth, agentController.createAgent);
router.put('/admin/agents/:id', requireAuth, agentController.updateAgent);
router.delete('/admin/agents/:id', requireAuth, agentController.deleteAgent);

// Calls Management
router.get('/admin/calls', requireAuth, callController.getCalls);
router.get('/admin/calls/:id', requireAuth, callController.getCallById);

// Contact Messages
router.get('/admin/messages', requireAuth, leadController.getMessages);
router.delete('/admin/messages/:id', requireAuth, leadController.deleteMessage);

export { router };
