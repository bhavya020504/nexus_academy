import { prisma } from '../config/prisma.js';

export class CourseRepository {
  async findAll() {
    return prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
