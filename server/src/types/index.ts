export type OAuthProvider = 'google' | 'microsoft';
export type UserRole = 'admin' | 'manager' | 'member';
export type WorkloadLevel = 'low' | 'medium' | 'high';
export type HighWorkloadReason =
  | 'project_deadline'
  | 'understaffed'
  | 'unplanned_work'
  | 'meetings'
  | 'dependencies'
  | 'other';

export interface User {
  id: string;
  email: string;
  oauthProvider: OAuthProvider;
  oauthProviderId: string;
  displayName: string | null;
  avatarUrl: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string | null;
  weeklyHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyResponse {
  id: string;
  teamMemberId: string;
  weekStart: Date;
  capacity: number;
  stressLevel: number;
  anticipatedWorkload: WorkloadLevel;
  comments: string | null;
  highWorkloadReason: HighWorkloadReason | null;
  highWorkloadOther: string | null;
  stressReduction: string | null;
  submittedAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  teamMemberId?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
  teamMemberId?: string;
}
