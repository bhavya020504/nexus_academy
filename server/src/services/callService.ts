import { SnapServeService, SnapServeCall } from './snapserveService.js';
import { CallRepository } from '../repositories/callRepository.js';

export class CallService {
  constructor(
    private readonly callRepository?: CallRepository,
    private readonly snapServeService: SnapServeService = new SnapServeService(),
  ) {}

  async getCalls(options?: {
    agentId?: string;
    status?: string;
    direction?: string;
    search?: string;
  }): Promise<SnapServeCall[]> {
    try {
      const calls = await this.snapServeService.fetchCalls();

      let filtered = calls;

      if (options?.agentId) {
        filtered = filtered.filter(
          (c) =>
            String(c.agentId) === String(options.agentId) ||
            (c.agentName && c.agentName.toLowerCase().includes(options.agentId!.toLowerCase())),
        );
      }

      if (options?.status) {
        filtered = filtered.filter(
          (c) => c.status?.toLowerCase() === options.status!.toLowerCase(),
        );
      }

      if (options?.direction) {
        filtered = filtered.filter(
          (c) => c.direction?.toLowerCase() === options.direction!.toLowerCase(),
        );
      }

      if (options?.search) {
        const query = options.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            String(c.id).includes(query) ||
            (c.toNumber && c.toNumber.toLowerCase().includes(query)) ||
            (c.fromNumber && c.fromNumber.toLowerCase().includes(query)) ||
            (c.agentName && c.agentName.toLowerCase().includes(query)) ||
            (c.executionId && c.executionId.toLowerCase().includes(query)),
        );
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching live calls from SnapServe API:', error);
      throw error;
    }
  }

  async getCallById(id: string | number): Promise<SnapServeCall | null> {
    try {
      return await this.snapServeService.fetchCallById(id);
    } catch (error) {
      console.error(`Error fetching call details for ID ${id} from SnapServe API:`, error);
      throw error;
    }
  }
}
