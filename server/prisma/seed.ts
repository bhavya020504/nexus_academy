import { PrismaClient, LeadStatus } from '@prisma/client';
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

  // 2. Seed Courses
  const coursesData = [
    {
      title: 'Full Stack AI',
      description: 'End-to-end full stack AI application development with React, Node, and Python LLM microservices.',
      level: 'Intermediate',
      duration: '10 weeks',
      price: 1499,
      slug: 'full-stack-ai',
      isActive: true,
    },
    {
      title: 'Data Analytics',
      description: 'Modern data analytics, SQL, Python, and automated business intelligence dashboards.',
      level: 'Beginner',
      duration: '6 weeks',
      price: 699,
      slug: 'data-analytics',
      isActive: true,
    },
    {
      title: 'GenAI & LLM',
      description: 'Generative AI engineering, fine-tuning LLMs, agentic workflows, and RAG architectures.',
      level: 'Advanced',
      duration: '8 weeks',
      price: 1599,
      slug: 'genai-and-llm',
      isActive: true,
    },
    {
      title: 'AI Consulting',
      description: 'Enterprise AI strategy, digital transformation frameworks, and ROI advisory.',
      level: 'Executive',
      duration: '4 weeks',
      price: 1199,
      slug: 'ai-consulting',
      isActive: true,
    },
    {
      title: 'Python for AI',
      description: 'Foundational and scientific Python programming for machine learning, PyTorch, and NumPy.',
      level: 'Beginner',
      duration: '6 weeks',
      price: 599,
      slug: 'python-for-ai',
      isActive: true,
    },
    {
      title: 'Executive AI Leadership & Strategy',
      description: 'C-suite strategy for deploying enterprise generative AI and automation frameworks.',
      level: 'Executive',
      duration: '4 weeks',
      price: 1299,
      slug: 'executive-ai-leadership',
      isActive: true,
    },
    {
      title: 'Enterprise Generative AI & LLM Systems',
      description: 'Architecting high-throughput RAG systems and LLM agent pipelines.',
      level: 'Advanced',
      duration: '8 weeks',
      price: 1899,
      slug: 'enterprise-generative-ai-llm',
      isActive: true,
    },
    {
      title: 'AI Product Management & Architecture',
      description: 'Bridging engineering and product strategy for AI-first products.',
      level: 'Intermediate',
      duration: '6 weeks',
      price: 999,
      slug: 'ai-product-management',
      isActive: true,
    },
  ];

  for (const c of coursesData) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // 3. Seed Sample Leads (without hardcoded mock agents)
  const sampleLeads = [
    {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@techcorp.com',
      phone: '+1 (555) 234-8901',
      companyName: 'TechCorp Solutions',
      industry: 'Fintech',
      interest: 'Full Stack AI',
      source: 'Google Search',
      status: LeadStatus.QUALIFIED,
    },
    {
      fullName: 'Sophia Chen',
      email: 'sophia@innovate.ai',
      phone: '+1 (555) 876-5432',
      companyName: 'Innovate AI Labs',
      industry: 'Software',
      interest: 'GenAI & LLM',
      source: 'LinkedIn Ad',
      status: LeadStatus.CONTACTED,
    },
    {
      fullName: 'David Miller',
      email: 'david.m@nexushealth.org',
      phone: '+1 (555) 345-6789',
      companyName: 'Nexus Healthcare',
      industry: 'Healthcare',
      interest: 'Data Analytics',
      source: 'Direct Referral',
      status: LeadStatus.CONVERTED,
    },
  ];

  for (const leadData of sampleLeads) {
    const existing = await prisma.lead.findFirst({ where: { email: leadData.email } });
    if (!existing) {
      await prisma.lead.create({ data: leadData });
    }
  }

  console.log('Seed completed successfully with dynamic courses and initial leads. Agents are fetched live from SnapServe API.');
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
