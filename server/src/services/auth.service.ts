import { db } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import type { OAuthProvider, UserRole } from '../types/index.js';

export interface OAuthUserInfo {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    teamMemberId?: string;
  };
}

export class AuthService {
  async handleOAuthLogin(userInfo: OAuthUserInfo): Promise<AuthTokens> {
    // Find or create user
    let user = await db('users')
      .where({
        oauth_provider: userInfo.provider,
        oauth_provider_id: userInfo.providerId,
      })
      .first();

    if (!user) {
      // Check if email already exists with different provider
      const existingUserByEmail = await db('users')
        .where({ email: userInfo.email })
        .first();

      if (existingUserByEmail) {
        throw new Error('Email already registered with a different provider');
      }

      // Create new user
      [user] = await db('users')
        .insert({
          email: userInfo.email,
          oauth_provider: userInfo.provider,
          oauth_provider_id: userInfo.providerId,
          display_name: userInfo.displayName,
          avatar_url: userInfo.avatarUrl,
          last_login_at: new Date(),
        })
        .returning('*');
    } else {
      // Update last login
      await db('users').where({ id: user.id }).update({
        last_login_at: new Date(),
        display_name: userInfo.displayName,
        avatar_url: userInfo.avatarUrl,
      });
    }

    // Try to link to team member by email
    let teamMember = await db('team_members')
      .where({ email: userInfo.email, is_active: true })
      .first();

    if (teamMember && !teamMember.user_id) {
      // Auto-link if team member exists and isn't linked
      await db('team_members')
        .where({ id: teamMember.id })
        .update({ user_id: user.id });
      teamMember.user_id = user.id;
    }

    // Determine role from team member or default to member
    const role: UserRole = teamMember?.role || 'member';

    // Create session
    const sessionId = uuidv4();
    const refreshToken = generateRefreshToken(user.id, sessionId);
    const refreshTokenHash = hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db('sessions').insert({
      id: sessionId,
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      expires_at: expiresAt,
    });

    // Generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
      teamMemberId: teamMember?.id,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name || userInfo.displayName,
        role,
        teamMemberId: teamMember?.id,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);

    // Find valid session
    const session = await db('sessions')
      .where({
        id: payload.sessionId,
        user_id: payload.sub,
        refresh_token_hash: tokenHash,
      })
      .where('expires_at', '>', new Date())
      .first();

    if (!session) {
      throw new Error('Invalid or expired refresh token');
    }

    // Get user
    const user = await db('users').where({ id: payload.sub }).first();
    if (!user) {
      throw new Error('User not found');
    }

    // Get team member
    const teamMember = await db('team_members')
      .where({ user_id: user.id, is_active: true })
      .first();

    const role: UserRole = teamMember?.role || 'member';

    // Rotate refresh token
    const newSessionId = uuidv4();
    const newRefreshToken = generateRefreshToken(user.id, newSessionId);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Delete old session and create new one
    await db('sessions').where({ id: session.id }).delete();
    await db('sessions').insert({
      id: newSessionId,
      user_id: user.id,
      refresh_token_hash: newRefreshTokenHash,
      expires_at: expiresAt,
    });

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
      teamMemberId: teamMember?.id,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role,
        teamMemberId: teamMember?.id,
      },
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await db('sessions')
        .where({ user_id: userId, refresh_token_hash: tokenHash })
        .delete();
    } else {
      // Logout from all sessions
      await db('sessions').where({ user_id: userId }).delete();
    }
  }

  async getCurrentUser(userId: string) {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      throw new Error('User not found');
    }

    const teamMember = await db('team_members')
      .where({ user_id: userId, is_active: true })
      .first();

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      role: teamMember?.role || 'member',
      teamMember: teamMember
        ? {
            id: teamMember.id,
            name: teamMember.name,
            role: teamMember.role,
            avatarInitials: teamMember.avatar_initials,
            avatarType: teamMember.avatar_type || 'initials',
            avatarAnimal: teamMember.avatar_animal,
            avatarImageUrl: teamMember.avatar_image_url,
            weeklyHours: teamMember.weekly_hours,
          }
        : null,
    };
  }
}

export const authService = new AuthService();
