import { AgentRepository } from '../repositories/agentRepository.js';

export class AgentService {
  constructor(private readonly agentRepository: AgentRepository) {}

  async getAgents() {
    return this.agentRepository.findAll();
  }

  async getAgentById(id: string) {
    return this.agentRepository.findById(id);
  }

  async createAgent(data: {
    name: string;
    snapserveAgentId: string;
    languages?: string;
    isActive?: boolean;
    courseNames: string[];
  }) {
    if (!data.name || !data.snapserveAgentId) {
      throw Object.assign(new Error('Agent name and SnapServe Agent ID are required.'), {
        status: 400,
      });
    }

    return this.agentRepository.create(data);
  }

  async updateAgent(
    id: string,
    data: {
      name?: string;
      snapserveAgentId?: string;
      languages?: string;
      isActive?: boolean;
      courseNames?: string[];
    },
  ) {
    return this.agentRepository.update(id, data);
  }

  async deleteAgent(id: string) {
    await this.agentRepository.delete(id);
  }
}
