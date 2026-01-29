import { db } from '../db/connection.js';
import { getCurrentWeekStart, formatDateString } from '../utils/date.js';

export class AnalyticsService {
  async getTeamTrends(startDate?: string, endDate?: string) {
    let query = db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('tm.is_active', true)
      .groupBy('sr.week_start')
      .orderBy('sr.week_start')
      .select(
        'sr.week_start',
        db.raw('ROUND(AVG(sr.capacity), 1) as avg_capacity'),
        db.raw('ROUND(AVG(sr.stress_level), 1) as avg_stress'),
        db.raw('COUNT(DISTINCT sr.team_member_id) as response_count'),
        db.raw(`COUNT(CASE WHEN sr.stress_level >= 7 THEN 1 END) as high_stress_count`),
        db.raw(`COUNT(CASE WHEN sr.anticipated_workload = 'high' THEN 1 END) as high_workload_count`)
      );

    if (startDate) {
      query = query.where('sr.week_start', '>=', startDate);
    }

    if (endDate) {
      query = query.where('sr.week_start', '<=', endDate);
    }

    const results = await query;

    return results.map((row) => ({
      weekStart: row.week_start,
      avgCapacity: parseFloat(row.avg_capacity),
      avgStress: parseFloat(row.avg_stress),
      responseCount: parseInt(row.response_count, 10),
      highStressCount: parseInt(row.high_stress_count, 10),
      highWorkloadCount: parseInt(row.high_workload_count, 10),
    }));
  }

  async getUserTrends(teamMemberId: string, startDate?: string, endDate?: string) {
    let query = db('survey_responses')
      .where('team_member_id', teamMemberId)
      .orderBy('week_start')
      .select(
        'week_start',
        'capacity',
        'stress_level',
        'anticipated_workload'
      );

    if (startDate) {
      query = query.where('week_start', '>=', startDate);
    }

    if (endDate) {
      query = query.where('week_start', '<=', endDate);
    }

    const results = await query;

    return results.map((row) => ({
      weekStart: row.week_start,
      capacity: row.capacity,
      stressLevel: row.stress_level,
      anticipatedWorkload: row.anticipated_workload,
    }));
  }

  async getWeeklySummary(week?: string) {
    const weekStart = week || formatDateString(getCurrentWeekStart());

    // Get aggregate stats
    const summary = await db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('sr.week_start', weekStart)
      .where('tm.is_active', true)
      .first(
        db.raw('ROUND(AVG(sr.capacity), 1) as avg_capacity'),
        db.raw('ROUND(AVG(sr.stress_level), 1) as avg_stress'),
        db.raw('MIN(sr.capacity) as min_capacity'),
        db.raw('MAX(sr.capacity) as max_capacity'),
        db.raw('COUNT(*) as total_responses'),
        db.raw(`COUNT(CASE WHEN sr.stress_level >= 7 THEN 1 END) as high_stress_count`),
        db.raw(`COUNT(CASE WHEN sr.anticipated_workload = 'low' THEN 1 END) as low_workload`),
        db.raw(`COUNT(CASE WHEN sr.anticipated_workload = 'medium' THEN 1 END) as medium_workload`),
        db.raw(`COUNT(CASE WHEN sr.anticipated_workload = 'high' THEN 1 END) as high_workload`)
      );

    // Get total active team members
    const [{ count: totalMembers }] = await db('team_members')
      .where('is_active', true)
      .count('* as count');

    // Get team members who haven't responded
    const nonResponders = await db('team_members')
      .where('is_active', true)
      .whereNotIn(
        'id',
        db('survey_responses').where('week_start', weekStart).select('team_member_id')
      )
      .select('id', 'name', 'email', 'avatar_initials');

    return {
      weekStart,
      avgCapacity: summary?.avg_capacity ? parseFloat(summary.avg_capacity) : null,
      avgStress: summary?.avg_stress ? parseFloat(summary.avg_stress) : null,
      minCapacity: summary?.min_capacity,
      maxCapacity: summary?.max_capacity,
      totalResponses: parseInt(summary?.total_responses || '0', 10),
      totalTeamMembers: parseInt(totalMembers as string, 10),
      highStressCount: parseInt(summary?.high_stress_count || '0', 10),
      workloadDistribution: {
        low: parseInt(summary?.low_workload || '0', 10),
        medium: parseInt(summary?.medium_workload || '0', 10),
        high: parseInt(summary?.high_workload || '0', 10),
      },
      nonResponders: nonResponders.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        avatarInitials: m.avatar_initials,
      })),
    };
  }

  async getStressAlerts(week?: string) {
    const weekStart = week || formatDateString(getCurrentWeekStart());

    const alerts = await db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('sr.week_start', weekStart)
      .where('tm.is_active', true)
      .where((builder) => {
        builder.where('sr.stress_level', '>=', 7).orWhere('sr.capacity', '>', 100);
      })
      .select(
        'tm.id',
        'tm.name',
        'tm.email',
        'tm.avatar_initials',
        'sr.capacity',
        'sr.stress_level',
        'sr.anticipated_workload',
        'sr.high_workload_reason',
        'sr.stress_reduction'
      )
      .orderBy('sr.stress_level', 'desc');

    return alerts.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      avatarInitials: a.avatar_initials,
      capacity: a.capacity,
      stressLevel: a.stress_level,
      anticipatedWorkload: a.anticipated_workload,
      highWorkloadReason: a.high_workload_reason,
      stressReduction: a.stress_reduction,
      alertType: a.stress_level >= 7 ? 'high_stress' : 'overloaded',
    }));
  }

  async getCapacityDistribution(week?: string) {
    const weekStart = week || formatDateString(getCurrentWeekStart());

    const distribution = await db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('sr.week_start', weekStart)
      .where('tm.is_active', true)
      .select(
        db.raw(`
          CASE
            WHEN sr.capacity <= 50 THEN 'low'
            WHEN sr.capacity <= 80 THEN 'moderate'
            WHEN sr.capacity <= 100 THEN 'optimal'
            ELSE 'overloaded'
          END as category
        `),
        db.raw('COUNT(*) as count')
      )
      .groupBy('category');

    const result = {
      low: 0,
      moderate: 0,
      optimal: 0,
      overloaded: 0,
    };

    distribution.forEach((d) => {
      result[d.category as keyof typeof result] = parseInt(d.count, 10);
    });

    return result;
  }
}

export const analyticsService = new AnalyticsService();
