import { CourseRepository } from '../repositories/courseRepository.js';

export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async getCourses(activeOnly?: boolean) {
    return this.courseRepository.findAll(activeOnly);
  }

  async getCourseById(id: string) {
    return this.courseRepository.findById(id);
  }

  async createCourse(data: {
    title: string;
    description: string;
    level?: string;
    duration?: string;
    price?: number;
    slug?: string;
    isActive?: boolean;
  }) {
    if (!data.title || !data.description) {
      throw Object.assign(new Error('Title and description are required'), {
        status: 400,
      });
    }

    return this.courseRepository.create(data);
  }

  async updateCourse(
    id: string,
    data: {
      title?: string;
      description?: string;
      level?: string;
      duration?: string;
      price?: number;
      slug?: string;
      isActive?: boolean;
    },
  ) {
    return this.courseRepository.update(id, data);
  }

  async deleteCourse(id: string) {
    await this.courseRepository.delete(id);
  }

  async toggleCourseActive(id: string) {
    return this.courseRepository.toggleActive(id);
  }
}
