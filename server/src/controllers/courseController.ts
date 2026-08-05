import type { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/courseService.js';
import { courseQuerySchema } from '../validators/course.js';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = courseQuerySchema.parse(req.query);
      const courses = await this.courseService.getCourses(parsed.limit, parsed.offset);
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  };
}
