import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CallStatus, LeadStatus } from '@prisma/client';
import { env } from '../config/env.js';
import { AdminRepository } from '../repositories/adminRepository.js';
import { LeadRepository } from '../repositories/leadRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';
import { AgentRepository } from '../repositories/agentRepository.js';
import { CallRepository } from '../repositories/callRepository.js';
import { AgentService } from './agentService.js';

export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly contactRepository: ContactRepository,
    private readonly adminRepository: AdminRepository,
    private readonly agentRepository: AgentRepository,
    private readonly callRepository: CallRepository,
  ) {}

  private formatPhoneNumber(rawPhone: string): string {
    if (!rawPhone) return '';
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    // 10-digit Indian number standard format
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    // 11-digit US number format
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    // 12-digit Indian number format
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  }

  private async triggerSnapServeOutboundCall(
    phone: string,
    snapserveAgentId: string,
  ) {
    const formattedPhone = this.formatPhoneNumber(phone);
    const agentIdNum = Number(snapserveAgentId);

    if (!env.snapserveApiKey || !agentIdNum || isNaN(agentIdNum)) {
      console.warn('SnapServe outbound call skipped: missing API key or invalid agent ID.', {
        hasApiKey: !!env.snapserveApiKey,
        snapserveAgentId,
        agentIdNum,
      });
      return { success: false, data: null };
    }

    const endpoint = `${env.snapserveBaseUrl.replace(/\/$/, '')}/calls/outbound`;
    const payload = {
      agentId: agentIdNum,
      toNumber: formattedPhone,
    };
    const headers = {
      Authorization: `Bearer ${env.snapserveApiKey}`,
      'Content-Type': 'application/json',
    };

    console.log('--- SnapServe Outbound Call Request ---');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Headers: Authorization: Bearer *** (Key configured)`);
    console.log(`Payload:`, JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(endpoint, payload, {
        headers,
        timeout: 15000,
      });

      console.log('--- SnapServe Outbound Call Response ---');
      console.log(`Status Code: ${response.status} ${response.statusText}`);
      console.log(`Response Body:`, JSON.stringify(response.data, null, 2));

      return { success: true, data: response.data };
    } catch (error) {
      console.error('--- SnapServe Outbound Call Failed ---');
      if (axios.isAxiosError(error)) {
        console.error(`Status Code: ${error.response?.status || 'N/A'}`);
        console.error(`Status Text: ${error.response?.statusText || 'N/A'}`);
        console.error(`Full Error Payload:`, JSON.stringify(error.response?.data || {}, null, 2));
      } else {
        console.error(`Error:`, error);
      }
      return { success: false, data: null };
    }
  }

  async createLead(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    companyName?: string | null;
    industry?: string | null;
    interest?: string | null;
    source?: string | null;
  }) {
    // 1. Synchronize live SnapServe agents to prune stale legacy DB records
    try {
      const agentService = new AgentService(this.agentRepository);
      await agentService.getAgents();
    } catch (err) {
      console.warn('Live agent synchronization prior to lead creation skipped:', err);
    }

    // 2. Automatically find active agent for the selected course / interest
    const assignedAgent = await this.agentRepository.findActiveAgentForCourse(
      data.interest,
    );

    console.log('Automatic Agent Assignment Result:', {
      courseInterest: data.interest,
      assignedAgentId: assignedAgent?.id,
      assignedAgentName: assignedAgent?.name,
      snapserveAgentId: assignedAgent?.snapserveAgentId,
    });

    // 3. Create the lead in PostgreSQL database
    const lead = await this.leadRepository.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      industry: data.industry,
      interest: data.interest,
      source: data.source,
      assignedAgentId: assignedAgent?.id || null,
      status: LeadStatus.PENDING,
    });

    // 4. Trigger SnapServe call using assigned agent's snapserveAgentId
    if (lead.phone) {
      const targetAgentId = String(
        assignedAgent?.snapserveAgentId || env.snapserveAgentId || '459',
      );
      const snapResult = await this.triggerSnapServeOutboundCall(
        lead.phone,
        targetAgentId,
      );

      // 5. Record initial Call log in PostgreSQL
      if (assignedAgent) {
        await this.callRepository.create({
          leadId: lead.id,
          agentId: assignedAgent.id,
          status: snapResult.success ? CallStatus.INITIATED : CallStatus.FAILED,
          duration: 0,
          transcript: `Agent ${assignedAgent.name} initiated outbound call to ${lead.fullName} (${lead.phone}).`,
          aiSummary: `Outbound AI agent call dispatched for ${lead.interest || 'consulting'}.`,
          successEvaluation: snapResult.success ? 'INITIATED' : 'FAILED',
        });
      }
    }

    return lead;
  }

  async createContactMessage(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    message: string;
  }) {
    return this.contactRepository.create(data);
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const token = jwt.sign({ sub: admin.id, email: admin.email }, env.jwtSecret, {
      expiresIn: '8h',
    });

    return { token, admin: { id: admin.id, email: admin.email } };
  }

  async getLeads(options?: {
    search?: string;
    status?: LeadStatus;
    course?: string;
  }) {
    return this.leadRepository.findAll(options);
  }

  async getLeadById(id: string) {
    return this.leadRepository.findById(id);
  }

  async updateLeadStatus(id: string, status: LeadStatus) {
    return this.leadRepository.updateStatus(id, status);
  }

  async getMessages() {
    return this.contactRepository.findAll();
  }

  async deleteLead(id: string) {
    await this.leadRepository.delete(id);
  }

  async deleteMessage(id: string) {
    await this.contactRepository.delete(id);
  }
}
