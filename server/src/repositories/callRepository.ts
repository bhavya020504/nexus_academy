import { CallStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export class CallRepository {
  async create(data: {
    leadId: string;
    agentId: string;
    status?: CallStatus;
    duration?: number;
    recordingUrl?: string | null;
    transcript?: string | null;
    aiSummary?: string | null;
    successEvaluation?: string | null;
  }) {
    return prisma.call.create({
      data: {
        leadId: data.leadId,
        agentId: data.agentId,
        status: data.status || CallStatus.INITIATED,
        duration: data.duration || 0,
        recordingUrl: data.recordingUrl,
        transcript: data.transcript,
        aiSummary: data.aiSummary,
        successEvaluation: data.successEvaluation,
      },
      include: {
        lead: true,
        agent: true,
      },
    });
  }

  async findAll(options?: {
    agentId?: string;
    status?: CallStatus;
    evaluation?: string;
  }) {
    const where: Prisma.CallWhereInput = {};

    if (options?.agentId) {
      where.agentId = options.agentId;
    }

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.evaluation) {
      where.successEvaluation = options.evaluation;
    }

    return prisma.call.findMany({
      where,
      include: {
        lead: true,
        agent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.call.findUnique({
      where: { id },
      include: {
        lead: true,
        agent: true,
      },
    });
  }

  async countCompleted() {
    return prisma.call.count({
      where: { status: CallStatus.COMPLETED },
    });
  }

  async countByAgent() {
    const calls = await prisma.call.groupBy({
      by: ['agentId'],
      _count: { id: true },
    });

    const agents = await prisma.agent.findMany();

    return agents.map((agent) => {
      const match = calls.find((c) => c.agentId === agent.id);
      return {
        agentId: agent.id,
        agentName: agent.name,
        totalCalls: match ? match._count.id : 0,
      };
    });
  }
}
