import { Router } from 'express';
import { CourseController } from '../controllers/courseController.js';
import { LeadController } from '../controllers/leadController.js';
import { CourseService } from '../services/courseService.js';
import { LeadService } from '../services/leadService.js';
import { CourseRepository } from '../repositories/courseRepository.js';
import { LeadRepository } from '../repositories/leadRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';
import { AdminRepository } from '../repositories/adminRepository.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const courseRepository = new CourseRepository();
const leadRepository = new LeadRepository();
const contactRepository = new ContactRepository();
const adminRepository = new AdminRepository();

const courseService = new CourseService(courseRepository);
const leadService = new LeadService(leadRepository, contactRepository, adminRepository);

const courseController = new CourseController(courseService);
const leadController = new LeadController(leadService);

router.get('/courses', courseController.getCourses);
router.post('/leads', leadController.createLead);
router.post('/contact', leadController.createContactMessage);
router.post('/admin/login', leadController.adminLogin);
router.get('/admin/leads', requireAuth, leadController.getLeads);
router.get('/admin/messages', requireAuth, leadController.getMessages);
router.delete('/admin/leads/:id', requireAuth, leadController.deleteLead);
router.delete('/admin/messages/:id', requireAuth, leadController.deleteMessage);

export { router };
