import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminRepository } from '../repositories/adminRepository.js';
import { LeadRepository } from '../repositories/leadRepository.js';
import { ContactRepository } from '../repositories/contactRepository.js';

export class LeadService {
  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly contactRepository: ContactRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  private async triggerSnapServeOutboundCall(lead: { phone?: string | null }) {
    if (!lead.phone) {
      console.log('SnapServe outbound call skipped: lead phone number is missing.');
      return;
    }

    if (!env.snapserveApiKey || !env.snapserveAgentId) {
      console.warn('SnapServe outbound call skipped: missing API key or agent ID in environment.');
      return;
    }

    try {
      const response = await axios.post(
        `${env.snapserveBaseUrl}/calls/outbound`,
        {
          agentId: Number(env.snapserveAgentId),
          toNumber: lead.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${env.snapserveApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('SnapServe outbound call succeeded:', response.data);
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
    }
  }

  async createLead(data: {
    fullName: string;
    email: string;
    phone?: string | null;
    interest?: string | null;
    source?: string | null;
  }) {
    const lead = await this.leadRepository.create(data);
    await this.triggerSnapServeOutboundCall(lead);
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

  async getLeads() {
    return this.leadRepository.findAll();
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
