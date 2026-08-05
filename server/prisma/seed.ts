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

  // 2. Seed Courses
  const coursesData = [
    {
      title: 'Executive AI Leadership & Strategy',
      description: 'C-suite strategy for deploying enterprise generative AI and automation frameworks.',
      level: 'Executive',
      duration: '4 weeks',
      price: 1299,
      slug: 'executive-ai-leadership',
    },
    {
      title: 'Enterprise Generative AI & LLM Systems',
      description: 'Architecting high-throughput RAG systems and LLM agent pipelines.',
      level: 'Advanced',
      duration: '8 weeks',
      price: 1899,
      slug: 'enterprise-generative-ai-llm',
    },
    {
      title: 'AI Product Management & Architecture',
      description: 'Bridging engineering and product strategy for AI-first products.',
      level: 'Intermediate',
      duration: '6 weeks',
      price: 999,
      slug: 'ai-product-management',
    },
    {
      title: 'Prompt Engineering Mastery',
      description: 'Write, test, and refine system prompts to drive deterministic AI outputs.',
      level: 'Intermediate',
      duration: '4 weeks',
      price: 499,
      slug: 'prompt-engineering-mastery',
    },
    {
      title: 'AI Strategy Consulting Sprint',
      description: 'Build a practical AI adoption roadmap for fast-scaling companies.',
      level: 'Advanced',
      duration: '6 weeks',
      price: 799,
      slug: 'ai-strategy-consulting-sprint',
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
        'Executive AI Leadership & Strategy',
        'AI Strategy Consulting Sprint',
        'Executive AI Leadership',
      ],
    },
    {
      name: 'Alex Rivera',
      snapserveAgentId: '460',
      languages: 'English, German',
      isActive: true,
      supportedCourseNames: [
        'Enterprise Generative AI & LLM Systems',
        'AI Product Management & Architecture',
      ],
    },
    {
      name: 'Elena Rostova',
      snapserveAgentId: '461',
      languages: 'English, French',
      isActive: true,
      supportedCourseNames: [
        'Prompt Engineering Mastery',
        'AI Product Management & Architecture',
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

    // Link agent to courses
    for (const courseName of a.supportedCourseNames) {
      const courseId = createdCourses[courseName] || null;
      const existingLink = await prisma.agentCourse.findFirst({
        where: { agentId: agent.id, courseName },
      });

      if (!existingLink) {
        await prisma.agentCourse.create({
          data: {
            agentId: agent.id,
            courseId,
            courseName,
          },
        });
      }
    }
  }

  // Fetch agents for creating sample leads
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
      interest: 'Executive AI Leadership & Strategy',
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
      interest: 'Enterprise Generative AI & LLM Systems',
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
      interest: 'AI Product Management & Architecture',
      source: 'Direct Referral',
      status: LeadStatus.CONVERTED,
      assignedAgentId: elena?.id,
    },
    {
      fullName: 'Emily Taylor',
      email: 'emily.t@retailpulse.com',
      phone: '+1 (555) 901-2345',
      companyName: 'RetailPulse Inc.',
      industry: 'E-commerce',
      interest: 'Prompt Engineering Mastery',
      source: 'Webinar Signup',
      status: LeadStatus.PENDING,
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

  console.log('Seed completed successfully with Agents, Courses, Leads, and Calls.');
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
