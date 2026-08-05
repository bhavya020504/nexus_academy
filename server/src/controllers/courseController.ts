import type { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/courseService.js';
import { createCourseSchema, updateCourseSchema } from '../validators/course.js';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  getPublicCourses = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await this.courseService.getCourses(true);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  };

  getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const courses = await this.courseService.getCourses(activeOnly);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  };

  getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  };

  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createCourseSchema.parse(req.body);
      const course = await this.courseService.createCourse(parsed);
      res.status(201).json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const parsed = updateCourseSchema.parse(req.body);
      const course = await this.courseService.updateCourse(id, parsed);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await this.courseService.deleteCourse(id);
      res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (error) {
      next(error);
    }
  };

  toggleCourseActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const course = await this.courseService.toggleCourseActive(id);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  };
}
