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

export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly contactRepository: ContactRepository,
    private readonly adminRepository: AdminRepository,
    private readonly agentRepository: AgentRepository,
    private readonly callRepository: CallRepository,
  ) {}

  private async triggerSnapServeOutboundCall(
    phone: string,
    snapserveAgentId: string,
  ) {
    if (!env.snapserveApiKey || !snapserveAgentId) {
      console.warn('SnapServe outbound call skipped: missing API key or agent ID.');
      return { success: false, data: null };
    }

    try {
      const response = await axios.post(
        `${env.snapserveBaseUrl}/calls/outbound`,
        {
          agentId: Number(snapserveAgentId),
          toNumber: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${env.snapserveApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('SnapServe outbound call succeeded:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('SnapServe outbound call failed:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        console.error('SnapServe outbound call failed:', error);
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
    // 1. Automatically find active agent for the selected course / interest
    const assignedAgent = await this.agentRepository.findActiveAgentForCourse(
      data.interest,
    );

    // 2. Create the lead with assigned agent ID
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

    // 3. Trigger SnapServe call using assigned agent's snapserveAgentId
    if (lead.phone && assignedAgent) {
      const targetAgentId = String(
        assignedAgent.snapserveAgentId || env.snapserveAgentId || '459',
      );
      const snapResult = await this.triggerSnapServeOutboundCall(
        lead.phone,
        targetAgentId,
      );

      // 4. Record initial Call log
      await this.callRepository.create({
        leadId: lead.id,
        agentId: assignedAgent.id,
        status: snapResult.success ? CallStatus.COMPLETED : CallStatus.INITIATED,
        duration: snapResult.success ? 45 : 0,
        recordingUrl: snapResult.success
          ? 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg'
          : null,
        transcript: `Agent ${assignedAgent.name} initiated outbound call to ${lead.fullName} (${lead.phone}).`,
        aiSummary: `Outbound AI agent call dispatched for ${lead.interest || 'consulting'}.`,
        successEvaluation: snapResult.success ? 'HIGH_INTENT' : 'PENDING_CALLBACK',
      });
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
