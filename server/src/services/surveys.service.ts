import { db } from '../db/connection.js';
import { getCurrentWeekStart, formatDateString, getWeekStart } from '../utils/date.js';
import type { WorkloadLevel, HighWorkloadReason } from '../types/index.js';

export interface CreateSurveyData {
  teamMemberId: string;
  weekStart: string;
  capacity: number;
  stressLevel: number;
  anticipatedWorkload: WorkloadLevel;
  comments?: string;
  highWorkloadReason?: HighWorkloadReason;
  highWorkloadOther?: string;
  stressReduction?: string;
}

export interface UpdateSurveyData {
  capacity?: number;
  stressLevel?: number;
  anticipatedWorkload?: WorkloadLevel;
  comments?: string;
  highWorkloadReason?: HighWorkloadReason;
  highWorkloadOther?: string;
  stressReduction?: string;
}

export interface SurveyQueryParams {
  week?: string;
  teamMemberId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class SurveysService {
  async getAll(params: SurveyQueryParams) {
    const { week, teamMemberId, startDate, endDate, page = 1, limit = 20 } = params;

    let query = db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .select(
        'sr.*',
        'tm.name as team_member_name',
        'tm.avatar_initials as team_member_avatar'
      )
      .orderBy('sr.submitted_at', 'desc');

    if (week) {
      query = query.where('sr.week_start', week);
    }

    if (teamMemberId) {
      query = query.where('sr.team_member_id', teamMemberId);
    }

    if (startDate) {
      query = query.where('sr.week_start', '>=', startDate);
    }

    if (endDate) {
      query = query.where('sr.week_start', '<=', endDate);
    }

    // Get total count
    const countQuery = query.clone();
    const [{ count }] = await countQuery.clearSelect().count('* as count');
    const total = parseInt(count as string, 10);

    // Apply pagination
    const offset = (page - 1) * limit;
    const surveys = await query.limit(limit).offset(offset);

    return {
      data: surveys.map(this.formatSurvey),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCurrentWeek() {
    const weekStart = formatDateString(getCurrentWeekStart());

    const surveys = await db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('sr.week_start', weekStart)
      .where('tm.is_active', true)
      .select(
        'sr.*',
        'tm.name as team_member_name',
        'tm.avatar_initials as team_member_avatar'
      )
      .orderBy('tm.name');

    return surveys.map(this.formatSurvey);
  }

  async getMyResponses(teamMemberId: string, limit = 10) {
    const surveys = await db('survey_responses')
      .where('team_member_id', teamMemberId)
      .orderBy('week_start', 'desc')
      .limit(limit);

    return surveys.map(this.formatSurvey);
  }

  async getById(id: string) {
    const survey = await db('survey_responses as sr')
      .join('team_members as tm', 'sr.team_member_id', 'tm.id')
      .where('sr.id', id)
      .select(
        'sr.*',
        'tm.name as team_member_name',
        'tm.avatar_initials as team_member_avatar'
      )
      .first();

    if (!survey) {
      throw new Error('Survey response not found');
    }

    return this.formatSurvey(survey);
  }

  async create(data: CreateSurveyData) {
    // Normalize week_start to Monday
    const weekStart = formatDateString(getWeekStart(new Date(data.weekStart)));

    // Check for existing response
    const existing = await db('survey_responses')
      .where({
        team_member_id: data.teamMemberId,
        week_start: weekStart,
      })
      .first();

    if (existing) {
      throw new Error('Survey response already exists for this week');
    }

    const [survey] = await db('survey_responses')
      .insert({
        team_member_id: data.teamMemberId,
        week_start: weekStart,
        capacity: data.capacity,
        stress_level: data.stressLevel,
        anticipated_workload: data.anticipatedWorkload,
        comments: data.comments,
        high_workload_reason: data.highWorkloadReason,
        high_workload_other: data.highWorkloadOther,
        stress_reduction: data.stressReduction,
      })
      .returning('*');

    return this.formatSurvey(survey);
  }

  async update(id: string, data: UpdateSurveyData) {
    const updateData: Record<string, any> = {};

    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.stressLevel !== undefined) updateData.stress_level = data.stressLevel;
    if (data.anticipatedWorkload !== undefined)
      updateData.anticipated_workload = data.anticipatedWorkload;
    if (data.comments !== undefined) updateData.comments = data.comments;
    if (data.highWorkloadReason !== undefined)
      updateData.high_workload_reason = data.highWorkloadReason;
    if (data.highWorkloadOther !== undefined)
      updateData.high_workload_other = data.highWorkloadOther;
    if (data.stressReduction !== undefined)
      updateData.stress_reduction = data.stressReduction;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const [survey] = await db('survey_responses')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!survey) {
      throw new Error('Survey response not found');
    }

    return this.formatSurvey(survey);
  }

  async delete(id: string) {
    const deleted = await db('survey_responses').where({ id }).delete();

    if (!deleted) {
      throw new Error('Survey response not found');
    }
  }

  private formatSurvey(survey: any) {
    return {
      id: survey.id,
      teamMemberId: survey.team_member_id,
      teamMemberName: survey.team_member_name,
      teamMemberAvatar: survey.team_member_avatar,
      weekStart: survey.week_start,
      capacity: survey.capacity,
      stressLevel: survey.stress_level,
      anticipatedWorkload: survey.anticipated_workload,
      comments: survey.comments,
      highWorkloadReason: survey.high_workload_reason,
      highWorkloadOther: survey.high_workload_other,
      stressReduction: survey.stress_reduction,
      submittedAt: survey.submitted_at,
      updatedAt: survey.updated_at,
    };
  }
}

export const surveysService = new SurveysService();
