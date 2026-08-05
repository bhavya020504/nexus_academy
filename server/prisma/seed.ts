import { PrismaClient, LeadStatus, CallStatus } from '@prisma/client';
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

  // 2. Seed Courses (including requested courses: Full Stack AI, Data Analytics, GenAI & LLM, AI Consulting, Python for AI, etc.)
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

  const createdCourses: Record<string, string> = {};
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    createdCourses[c.title] = course.id;
  }

  // 3. Seed Agents
  const agentsData = [
    {
      name: 'Sarah Jenkins',
      snapserveAgentId: '459',
      languages: 'English, Spanish',
      isActive: true,
      supportedCourseNames: [
        'Full Stack AI',
        'Executive AI Leadership & Strategy',
        'AI Consulting',
      ],
    },
    {
      name: 'Alex Rivera',
      snapserveAgentId: '460',
      languages: 'English, German',
      isActive: true,
      supportedCourseNames: [
        'GenAI & LLM',
        'Enterprise Generative AI & LLM Systems',
        'Python for AI',
      ],
    },
    {
      name: 'Elena Rostova',
      snapserveAgentId: '461',
      languages: 'English, French',
      isActive: true,
      supportedCourseNames: [
        'Data Analytics',
        'AI Product Management & Architecture',
        'Python for AI',
      ],
    },
  ];

  for (const a of agentsData) {
    let agent = await prisma.agent.findFirst({
      where: { snapserveAgentId: a.snapserveAgentId },
    });

    if (!agent) {
      agent = await prisma.agent.create({
        data: {
          name: a.name,
          snapserveAgentId: a.snapserveAgentId,
          languages: a.languages,
          isActive: a.isActive,
        },
      });
    } else {
      agent = await prisma.agent.update({
        where: { id: agent.id },
        data: {
          name: a.name,
          languages: a.languages,
          isActive: a.isActive,
        },
      });
    }

    // Clear existing agentCourses links and recreate
    await prisma.agentCourse.deleteMany({ where: { agentId: agent.id } });

    for (const courseName of a.supportedCourseNames) {
      const courseId = createdCourses[courseName] || null;
      await prisma.agentCourse.create({
        data: {
          agentId: agent.id,
          courseId,
          courseName,
        },
      });
    }
  }

  // Fetch agents for sample leads
  const sarah = await prisma.agent.findFirst({ where: { snapserveAgentId: '459' } });
  const alex = await prisma.agent.findFirst({ where: { snapserveAgentId: '460' } });
  const elena = await prisma.agent.findFirst({ where: { snapserveAgentId: '461' } });

  // 4. Seed Leads & Calls
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
      assignedAgentId: sarah?.id,
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
      assignedAgentId: alex?.id,
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
      assignedAgentId: elena?.id,
    },
  ];

  for (const leadData of sampleLeads) {
    const existing = await prisma.lead.findFirst({ where: { email: leadData.email } });
    let lead;
    if (!existing) {
      lead = await prisma.lead.create({ data: leadData });
    } else {
      lead = existing;
    }

    if (lead.assignedAgentId) {
      const existingCall = await prisma.call.findFirst({ where: { leadId: lead.id } });
      if (!existingCall) {
        await prisma.call.create({
          data: {
            leadId: lead.id,
            agentId: lead.assignedAgentId,
            status: CallStatus.COMPLETED,
            duration: Math.floor(Math.random() * 180) + 60,
            recordingUrl: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg',
            transcript: `Agent: Hello ${lead.fullName}, thank you for contacting AI Nexus Academy regarding ${lead.interest}.\nLead: Yes! I would like to learn more about the curriculum and start dates.\nAgent: Fantastic. Our next cohort starts next Monday with live mentorship.\nLead: Perfect, please send over the syllabus!`,
            aiSummary: `Discussed ${lead.interest} program curriculum and enrollment dates. Lead expressed strong purchasing intent.`,
            successEvaluation: 'HIGH_INTENT',
          },
        });
      }
    }
  }

  console.log('Seed completed successfully with dynamic courses, agents, and sample leads.');
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
