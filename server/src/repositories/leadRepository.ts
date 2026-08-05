import { LeadStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export class LeadRepository {
  async create(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    companyName?: string | null;
    industry?: string | null;
    interest?: string | null;
    source?: string | null;
    assignedAgentId?: string | null;
    status?: LeadStatus;
  }) {
    return prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        industry: data.industry,
        interest: data.interest,
        source: data.source,
        assignedAgentId: data.assignedAgentId,
        status: data.status || LeadStatus.PENDING,
      },
      include: {
        assignedAgent: true,
        calls: true,
      },
    });
  }

  async findAll(options?: {
    search?: string;
    status?: LeadStatus;
    course?: string;
  }) {
    const where: Prisma.LeadWhereInput = {};

    if (options?.search) {
      const q = options.search;
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { companyName: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.course) {
      where.interest = { contains: options.course, mode: 'insensitive' };
    }

    return prisma.lead.findMany({
      where,
      include: {
        assignedAgent: true,
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
      include: {
        assignedAgent: true,
        calls: {
          include: { agent: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async updateStatus(id: string, status: LeadStatus) {
    return prisma.lead.update({
      where: { id },
      data: { status },
      include: { assignedAgent: true },
    });
  }

  async delete(id: string) {
    await prisma.lead.delete({ where: { id } });
  }

  async countByStatus() {
    const counts = await prisma.lead.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    return counts.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);
  }

  async countTotal() {
    return prisma.lead.count();
  }

  async countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return prisma.lead.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });
  }
}
