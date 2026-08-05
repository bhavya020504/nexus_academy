import { prisma } from '../config/prisma.js';

export class AgentRepository {
  async findAll() {
    return prisma.agent.findMany({
      include: {
        agentCourses: true,
        _count: {
          select: { leads: true, calls: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.agent.findUnique({
      where: { id },
      include: {
        agentCourses: true,
        leads: { orderBy: { createdAt: 'desc' }, take: 10 },
        calls: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }

  async findBySnapserveAgentId(snapserveAgentId: string) {
    return prisma.agent.findUnique({
      where: { snapserveAgentId },
      include: {
        agentCourses: true,
        _count: {
          select: { leads: true, calls: true },
        },
      },
    });
  }

  async syncSnapServeAgent(agent: {
    id: number | string;
    name: string;
    status?: string;
    language?: string;
  }) {
    const snapserveAgentId = String(agent.id);
    const isActive = agent.status ? agent.status.toLowerCase() === 'active' : true;
    const languages = agent.language || 'English';

    return prisma.agent.upsert({
      where: { snapserveAgentId },
      update: {
        name: agent.name,
        isActive,
        languages,
      },
      create: {
        snapserveAgentId,
        name: agent.name,
        isActive,
        languages,
      },
      include: {
        agentCourses: true,
        _count: {
          select: { leads: true, calls: true },
        },
      },
    });
  }

  async pruneStaleAgents(validSnapServeIds: string[]) {
    if (!validSnapServeIds || validSnapServeIds.length === 0) return;
    await prisma.agent.deleteMany({
      where: {
        snapserveAgentId: {
          notIn: validSnapServeIds,
        },
      },
    });
  }

  async findActiveAgentForCourse(courseName?: string | null) {
    if (courseName) {
      // 1. Try to find an active agent mapped to this courseName
      const agentCourse = await prisma.agentCourse.findFirst({
        where: {
          courseName: { equals: courseName, mode: 'insensitive' },
          agent: { isActive: true },
        },
        include: { agent: true },
      });

      if (agentCourse?.agent) {
        return agentCourse.agent;
      }
    }

    // 2. Fallback to any active agent if no course-specific agent is found
    const activeAgent = await prisma.agent.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    if (activeAgent) return activeAgent;

    // 3. Fallback to any agent
    return prisma.agent.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: {
    name: string;
    snapserveAgentId: string;
    languages?: string;
    isActive?: boolean;
    courseNames: string[];
  }) {
    const { name, snapserveAgentId, languages, isActive, courseNames } = data;

    return prisma.agent.create({
      data: {
        name,
        snapserveAgentId,
        languages: languages || 'English',
        isActive: isActive !== undefined ? isActive : true,
        agentCourses: {
          create: courseNames.map((cName) => ({
            courseName: cName,
          })),
        },
      },
      include: {
        agentCourses: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      snapserveAgentId?: string;
      languages?: string;
      isActive?: boolean;
      courseNames?: string[];
    },
  ) {
    const { name, snapserveAgentId, languages, isActive, courseNames } = data;

    if (courseNames) {
      // Replace agentCourses
      await prisma.agentCourse.deleteMany({ where: { agentId: id } });
    }

    return prisma.agent.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(snapserveAgentId !== undefined && { snapserveAgentId }),
        ...(languages !== undefined && { languages }),
        ...(isActive !== undefined && { isActive }),
        ...(courseNames && {
          agentCourses: {
            create: courseNames.map((cName) => ({ courseName: cName })),
          },
        }),
      },
      include: {
        agentCourses: true,
      },
    });
  }

  async delete(id: string) {
    await prisma.agent.delete({ where: { id } });
  }
}
