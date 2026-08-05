import axios from 'axios';
import { env } from '../config/env.js';

export interface SnapServeAgent {
  id: number;
  name: string;
  agentMode?: string;
  agentType?: string;
  description?: string;
  status?: string;
  language?: string;
  asrProvider?: string;
  llmProvider?: string;
  ttsProvider?: string;
  telephonyProvider?: string;
  systemPrompt?: string;
  greetingMessage?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class SnapServeService {
  async fetchAgents(): Promise<SnapServeAgent[]> {
    if (!env.snapserveApiKey) {
      throw new Error('SNAPSERVE_API_KEY is missing in environment variables.');
    }

    const baseUrl = env.snapserveBaseUrl ? env.snapserveBaseUrl.replace(/\/$/, '') : 'https://app.snapserve.ai/api';
    const url = `${baseUrl}/agents`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${env.snapserveApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data.agents)) {
        return response.data.agents;
      }

      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || error.response?.statusText || error.message;
        throw Object.assign(new Error(`SnapServe API Error: ${errorMsg}`), {
          status: error.response?.status || 500,
        });
      }
      throw error;
    }
  }
}
