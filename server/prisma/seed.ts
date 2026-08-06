import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Seed Admin accounts
  await prisma.admin.upsert({
    where: { email: 'admin@runit.ai' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@runit.ai',
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.admin.upsert({
    where: { email: 'admin@ainexus.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@ainexus.com',
      passwordHash: adminPasswordHash,
    },
  });

  console.log('Production seed completed successfully. Admin accounts configured.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });

