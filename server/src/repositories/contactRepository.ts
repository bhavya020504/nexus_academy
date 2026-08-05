import { prisma } from '../config/prisma.js';

export class ContactRepository {
  async create(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    message: string;
  }) {
    return prisma.contactMessage.create({ data });
  }

  async findAll() {
    return prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async delete(id: string) {
    await prisma.contactMessage.delete({ where: { id } });
  }
}
