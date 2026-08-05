import { CourseRepository } from '../repositories/courseRepository.js';

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getCourses(limit?: number, offset?: number) {
    const courses = await this.courseRepository.findAll();
    return courses.slice(offset ?? 0, limit ? (offset ?? 0) + limit : undefined);
  }
}
