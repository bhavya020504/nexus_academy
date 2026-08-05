import { AgentRepository } from '../repositories/agentRepository.js';
import { SnapServeService } from './snapserveService.js';

export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly snapServeService: SnapServeService = new SnapServeService(),
  ) {}

  async getAgents() {
    try {
      const snapAgents = await this.snapServeService.fetchAgents();

      // Synchronize each SnapServe agent into Postgres & attach database mappings
      const enrichedAgents = await Promise.all(
        snapAgents.map(async (snapAgent) => {
          const dbAgent = await this.agentRepository.syncSnapServeAgent({
            id: snapAgent.id,
            name: snapAgent.name,
            status: snapAgent.status,
            language: snapAgent.language,
          });

          return {
            id: dbAgent.id,
            snapserveAgentId: String(snapAgent.id),
            name: snapAgent.name,
            status: snapAgent.status || (dbAgent.isActive ? 'active' : 'draft'),
            language: snapAgent.language || dbAgent.languages || 'English',
            agentType: snapAgent.agentType || 'general',
            description: snapAgent.description || '',
            isActive: dbAgent.isActive,
            languages: dbAgent.languages,
            agentCourses: dbAgent.agentCourses || [],
            _count: dbAgent._count || { leads: 0, calls: 0 },
            rawSnapServe: snapAgent,
          };
        }),
      );

      return enrichedAgents;
    } catch (error) {
      console.error('Error fetching live SnapServe agents, falling back to database agents:', error);
      const dbAgents = await this.agentRepository.findAll();
      return dbAgents.map((dbAgent) => ({
        id: dbAgent.id,
        snapserveAgentId: dbAgent.snapserveAgentId,
        name: dbAgent.name,
        status: dbAgent.isActive ? 'active' : 'inactive',
        language: dbAgent.languages || 'English',
        agentType: 'general',
        description: '',
        isActive: dbAgent.isActive,
        languages: dbAgent.languages,
        agentCourses: dbAgent.agentCourses || [],
        _count: dbAgent._count || { leads: 0, calls: 0 },
      }));
    }
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
