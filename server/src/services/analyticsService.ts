import { prisma } from '../config/prisma.js';

export class AnalyticsService {
  async getDashboardData() {
    try {
      const totalLeads = (await prisma.lead.count()) ?? 0;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayLeads = (await prisma.lead.count({
        where: { createdAt: { gte: startOfToday } },
      })) ?? 0;

      const pendingLeads = (await prisma.lead.count({
        where: { status: 'PENDING' },
      })) ?? 0;

      const completedCalls = (await prisma.call.count({
        where: { status: 'COMPLETED' },
      })) ?? 0;

      const activeAgents = (await prisma.agent.count({
        where: { isActive: true },
      })) ?? 0;

      const recentLeads = (await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { assignedAgent: true },
      })) ?? [];

      const recentCalls = (await prisma.call.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { lead: true, agent: true },
      })) ?? [];

      return {
        metrics: {
          totalLeads,
          todayLeads,
          pendingLeads,
          completedCalls,
          activeAgents,
        },
        recentActivity: {
          leads: recentLeads,
          calls: recentCalls,
        },
      };
    } catch (error) {
      console.error('Error in getDashboardData, returning default zero values:', error);
      return {
        metrics: {
          totalLeads: 0,
          todayLeads: 0,
          pendingLeads: 0,
          completedCalls: 0,
          activeAgents: 0,
        },
        recentActivity: {
          leads: [],
          calls: [],
        },
      };
    }
  }

  async getAnalyticsData() {
    try {
      const totalLeadsCount = (await prisma.lead.count()) ?? 0;

      // 1. Leads by Course
      const courses = await prisma.course.findMany({ select: { title: true } });
      const leadsByCourseRaw = await prisma.lead.groupBy({
        by: ['interest'],
        _count: { id: true },
      });

      const leadsByCourseMap: Record<string, number> = {};
      courses.forEach((c) => {
        leadsByCourseMap[c.title] = 0;
      });

      leadsByCourseRaw.forEach((item) => {
        const key = item.interest || 'Unspecified';
        leadsByCourseMap[key] = (leadsByCourseMap[key] || 0) + item._count.id;
      });

      let leadsByCourse = Object.entries(leadsByCourseMap).map(([course, count]) => ({
        course,
        count,
      }));

      if (leadsByCourse.length === 0) {
        leadsByCourse = [{ course: 'General Interest', count: 0 }];
      }

      // 2. Calls by Agent
      const agents = await prisma.agent.findMany({
        include: {
          _count: {
            select: { calls: true },
          },
        },
      });

      const callsByAgent = agents.map((agent) => ({
        agentName: agent.name,
        snapserveAgentId: agent.snapserveAgentId,
        totalCalls: agent._count?.calls ?? 0,
      }));

      // 3. Lead Status Distribution
      const defaultStatuses: Array<'PENDING' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED'> = [
        'PENDING',
        'CONTACTED',
        'QUALIFIED',
        'CONVERTED',
        'CLOSED',
      ];
      const statusMap: Record<string, number> = {
        PENDING: 0,
        CONTACTED: 0,
        QUALIFIED: 0,
        CONVERTED: 0,
        CLOSED: 0,
      };

      const statusRaw = await prisma.lead.groupBy({
        by: ['status'],
        _count: { id: true },
      });

      statusRaw.forEach((item) => {
        if (item.status && statusMap[item.status] !== undefined) {
          statusMap[item.status] = item._count.id;
        }
      });

      const leadStatusDistribution = defaultStatuses.map((status) => ({
        status,
        count: statusMap[status] || 0,
      }));

      // 4. Daily Leads (Last 7 Days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const rawLeads7Days = await prisma.lead.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      });

      const dailyLeadsMap: Record<string, number> = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dailyLeadsMap[dateStr] = 0;
      }

      rawLeads7Days.forEach((l) => {
        const dateStr = l.createdAt.toISOString().split('T')[0];
        if (dailyLeadsMap[dateStr] !== undefined) {
          dailyLeadsMap[dateStr]++;
        }
      });

      const dailyLeads = Object.entries(dailyLeadsMap).map(([date, count]) => ({
        date,
        count,
      }));

      // 5. Monthly Leads (Last 6 Months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const monthlyLeads: Array<{ month: string; count: number }> = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const mName = monthNames[d.getMonth()];

        const monthCount = await prisma.lead.count({
          where: {
            createdAt: {
              gte: d,
              lt: nextD,
            },
          },
        });

        monthlyLeads.push({
          month: mName,
          count: monthCount,
        });
      }

      // 6. Call Success Rate
      const totalCallsCount = (await prisma.call.count()) ?? 0;
      const completedCallsCount = (await prisma.call.count({
        where: { status: 'COMPLETED' },
      })) ?? 0;

      const callSuccessRate =
        totalCallsCount > 0
          ? Math.round((completedCallsCount / totalCallsCount) * 100)
          : 100;

      return {
        leadsByCourse,
        callsByAgent,
        leadStatusDistribution,
        dailyLeads,
        monthlyLeads,
        callSuccessRate,
      };
    } catch (error) {
      console.error('Error in getAnalyticsData, returning safe zero fallback payload:', error);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const fallbackMonthly = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        fallbackMonthly.push({ month: monthNames[d.getMonth()], count: 0 });
      }

      return {
        leadsByCourse: [{ course: 'General Interest', count: 0 }],
        callsByAgent: [],
        leadStatusDistribution: [
          { status: 'PENDING', count: 0 },
          { status: 'CONTACTED', count: 0 },
          { status: 'QUALIFIED', count: 0 },
          { status: 'CONVERTED', count: 0 },
          { status: 'CLOSED', count: 0 },
        ],
        dailyLeads: Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return { date: d.toISOString().split('T')[0], count: 0 };
        }),
        monthlyLeads: fallbackMonthly,
        callSuccessRate: 100,
      };
    }
  }
}

