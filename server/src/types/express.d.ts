import type { UserRole } from './index.js';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      teamMemberId?: string;
    }
  }
}

export {};
