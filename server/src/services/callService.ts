import { CallStatus } from '@prisma/client';
import { CallRepository } from '../repositories/callRepository.js';

export class CallService {
  constructor(private readonly callRepository: CallRepository) {}

  async getCalls(options?: {
    agentId?: string;
    status?: CallStatus;
    evaluation?: string;
  }) {
    return this.callRepository.findAll(options);
  }

  async getCallById(id: string) {
    return this.callRepository.findById(id);
  }

  async createCall(data: {
    leadId: string;
    agentId: string;
    status?: CallStatus;
    duration?: number;
    recordingUrl?: string | null;
    transcript?: string | null;
    aiSummary?: string | null;
    successEvaluation?: string | null;
  }) {
    return this.callRepository.create(data);
  }
}
