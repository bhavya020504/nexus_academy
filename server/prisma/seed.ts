import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@runit.ai' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@runit.ai',
      passwordHash: adminPasswordHash,
    },
  });

  const courses = [
    {
      title: 'AI Foundations for Teams',
      description: 'Learn the practical use of AI tools for business workflows.',
      level: 'Beginner',
      duration: '4 weeks',
      price: 299,
      slug: 'ai-foundations-for-teams',
    },
    {
      title: 'Prompt Engineering Mastery',
      description: 'Write, test, and refine prompts to drive real-world AI output.',
      level: 'Intermediate',
      duration: '6 weeks',
      price: 499,
      slug: 'prompt-engineering-mastery',
    },
    {
      title: 'AI Strategy Consulting Sprint',
      description: 'Build a tailored AI roadmap for an organization.',
      level: 'Advanced',
      duration: '8 weeks',
      price: 799,
      slug: 'ai-strategy-consulting-sprint',
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }

  console.log('Seed completed with demo courses and a default admin account.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
