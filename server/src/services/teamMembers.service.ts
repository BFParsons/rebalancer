import { db } from '../db/connection.js';
import { generateInitials } from '../utils/date.js';
import type { UserRole } from '../types/index.js';

export interface CreateTeamMemberData {
  name: string;
  email: string;
  role?: UserRole;
  weeklyHours?: number;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  role?: UserRole;
  weeklyHours?: number;
  isActive?: boolean;
}

export class TeamMembersService {
  async getAll(includeInactive = false) {
    const query = db('team_members').orderBy('name');

    if (!includeInactive) {
      query.where('is_active', true);
    }

    const members = await query;

    return members.map(this.formatTeamMember);
  }

  async getById(id: string) {
    const member = await db('team_members').where({ id }).first();

    if (!member) {
      throw new Error('Team member not found');
    }

    return this.formatTeamMember(member);
  }

  async create(data: CreateTeamMemberData) {
    const avatarInitials = generateInitials(data.name);

    const [member] = await db('team_members')
      .insert({
        name: data.name,
        email: data.email,
        role: data.role || 'member',
        avatar_initials: avatarInitials,
        weekly_hours: data.weeklyHours || 40,
      })
      .returning('*');

    return this.formatTeamMember(member);
  }

  async update(id: string, data: UpdateTeamMemberData) {
    const updateData: Record<string, any> = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.avatar_initials = generateInitials(data.name);
    }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.weeklyHours !== undefined) updateData.weekly_hours = data.weeklyHours;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const [member] = await db('team_members')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!member) {
      throw new Error('Team member not found');
    }

    return this.formatTeamMember(member);
  }

  async softDelete(id: string) {
    const [member] = await db('team_members')
      .where({ id })
      .update({ is_active: false })
      .returning('*');

    if (!member) {
      throw new Error('Team member not found');
    }

    return this.formatTeamMember(member);
  }

  async updateAvatar(id: string, data: {
    type: 'initials' | 'animal' | 'custom';
    animal?: string;
    imageUrl?: string;
  }) {
    const updateData: Record<string, any> = {
      avatar_type: data.type,
    };

    if (data.type === 'animal') {
      updateData.avatar_animal = data.animal;
      updateData.avatar_image_url = null;
    } else if (data.type === 'custom') {
      updateData.avatar_image_url = data.imageUrl;
      updateData.avatar_animal = null;
    } else {
      updateData.avatar_animal = null;
      updateData.avatar_image_url = null;
    }

    const [member] = await db('team_members')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (!member) {
      throw new Error('Team member not found');
    }

    return this.formatTeamMember(member);
  }

  async linkToUser(teamMemberId: string, userId: string) {
    // Check if user is already linked to another team member
    const existingLink = await db('team_members')
      .where({ user_id: userId })
      .whereNot({ id: teamMemberId })
      .first();

    if (existingLink) {
      throw new Error('User is already linked to another team member');
    }

    const [member] = await db('team_members')
      .where({ id: teamMemberId })
      .update({ user_id: userId })
      .returning('*');

    if (!member) {
      throw new Error('Team member not found');
    }

    return this.formatTeamMember(member);
  }

  private formatTeamMember(member: any) {
    return {
      id: member.id,
      userId: member.user_id,
      name: member.name,
      email: member.email,
      role: member.role,
      avatarInitials: member.avatar_initials,
      avatarType: member.avatar_type || 'initials',
      avatarAnimal: member.avatar_animal,
      avatarImageUrl: member.avatar_image_url,
      weeklyHours: member.weekly_hours,
      isActive: member.is_active,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
    };
  }
}

export const teamMembersService = new TeamMembersService();
