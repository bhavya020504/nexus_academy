import type { PrismaClient } from '@prisma/client';

export class PrismaRepository<T> {
  constructor(private readonly prisma: PrismaClient, private readonly model: keyof PrismaClient) {}

  async findAll() {
    return (this.prisma[this.model] as any).findMany();
  }

  async findById(id: string) {
    return (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  async create(data: Partial<T>) {
    return (this.prisma[this.model] as any).create({ data });
  }

  async delete(id: string) {
    await (this.prisma[this.model] as any).delete({ where: { id } });
  }
}
