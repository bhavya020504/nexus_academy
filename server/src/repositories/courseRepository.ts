import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export class CourseRepository {
  async findAll(activeOnly?: boolean) {
    const where: Prisma.CourseWhereInput = {};
    if (activeOnly) {
      where.isActive = true;
    }
    return prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        agentCourses: {
          include: { agent: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.course.findUnique({
      where: { slug },
    });
  }

  async create(data: {
    title: string;
    description: string;
    level?: string;
    duration?: string;
    price?: number;
    slug?: string;
    isActive?: boolean;
  }) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level || 'Intermediate',
        duration: data.duration || '4 weeks',
        price: data.price !== undefined ? data.price : 499,
        slug,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async update(
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
    const updateData: Prisma.CourseUpdateInput = { ...data };
    if (data.title && !data.slug) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    return prisma.course.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await prisma.course.delete({ where: { id } });
  }

  async toggleActive(id: string) {
    const course = await this.findById(id);
    if (!course) {
      throw Object.assign(new Error('Course not found'), { status: 404 });
    }
    return prisma.course.update({
      where: { id },
      data: { isActive: !course.isActive },
    });
  }
}
