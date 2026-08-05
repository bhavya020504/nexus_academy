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

export interface SnapServeCall {
  id: number;
  agentId?: number | null;
  agentName?: string | null;
  status: string;
  toNumber?: string | null;
  fromNumber?: string | null;
  durationSeconds?: number | null;
  transcript?: string | null;
  recordingUrl?: string | null;
  recordingEnabled?: boolean;
  recordingError?: string | null;
  errorMessage?: string | null;
  metadata?: string | null;
  createdAt: string;
  endedAt?: string | null;
  sttLatencyMs?: number | null;
  llmLatencyMs?: number | null;
  ttsFirstChunkMs?: number | null;
  executionId?: string | null;
  costCents?: number | null;
  callSummary?: string | null;
  successEvaluation?: string | null;
  dispositionResult?: string | null;
  direction?: string | null;
  [key: string]: any;
}

export class SnapServeService {
  private get baseApiUrl(): string {
    const rawUrl = env.snapserveBaseUrl ? env.snapserveBaseUrl.replace(/\/$/, '') : 'https://app.snapserve.ai/api';
    return rawUrl;
  }

  private formatRecordingUrl(rawUrl?: string | null): string | null {
    if (!rawUrl) return null;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }
    const origin = this.baseApiUrl.replace(/\/api$/, '');
    return `${origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
  }

  async fetchAgents(): Promise<SnapServeAgent[]> {
    if (!env.snapserveApiKey) {
      throw new Error('SNAPSERVE_API_KEY is missing in environment variables.');
    }

    const url = `${this.baseApiUrl}/agents`;

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

  async fetchCalls(): Promise<SnapServeCall[]> {
    if (!env.snapserveApiKey) {
      throw new Error('SNAPSERVE_API_KEY is missing in environment variables.');
    }

    const url = `${this.baseApiUrl}/calls`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${env.snapserveApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      let rawCalls: SnapServeCall[] = [];
      if (Array.isArray(response.data)) {
        rawCalls = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        rawCalls = response.data.data;
      } else if (response.data && Array.isArray(response.data.calls)) {
        rawCalls = response.data.calls;
      }

      return rawCalls.map((call) => ({
        ...call,
        recordingUrl: this.formatRecordingUrl(call.recordingUrl),
      }));
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

  async fetchCallById(id: string | number): Promise<SnapServeCall | null> {
    if (!env.snapserveApiKey) {
      throw new Error('SNAPSERVE_API_KEY is missing in environment variables.');
    }

    const url = `${this.baseApiUrl}/calls/${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${env.snapserveApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const call = response.data?.data || response.data?.call || response.data;
      if (!call) return null;

      return {
        ...call,
        recordingUrl: this.formatRecordingUrl(call.recordingUrl),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        const errorMsg = error.response?.data?.message || error.response?.statusText || error.message;
        throw Object.assign(new Error(`SnapServe API Error: ${errorMsg}`), {
          status: error.response?.status || 500,
        });
      }
      throw error;
    }
  }
}
