import { prisma } from '../config/prisma.js';

export class LeadRepository {
  async create(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    interest?: string | null;
    source?: string | null;
  }) {
    return prisma.lead.create({ data });
  }

  async findAll() {
    return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async delete(id: string) {
    await prisma.lead.delete({ where: { id } });
  }
}
