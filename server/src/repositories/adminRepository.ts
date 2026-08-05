import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';

export class AdminRepository {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  }

  async getDefaultAdminHash() {
    return bcrypt.hashSync('admin123', 10);
  }
}
