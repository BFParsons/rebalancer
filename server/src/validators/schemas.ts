import { z } from 'zod';

// Enums
export const workloadLevelSchema = z.enum(['low', 'medium', 'high']);
export const highWorkloadReasonSchema = z.enum([
  'project_deadline',
  'understaffed',
  'unplanned_work',
  'meetings',
  'dependencies',
  'other',
]);
export const userRoleSchema = z.enum(['admin', 'manager', 'member']);

// Team Member schemas
export const teamMemberSchemas = {
  create: z.object({
    body: z.object({
      name: z.string().min(1).max(255),
      email: z.string().email(),
      role: userRoleSchema.optional().default('member'),
      weeklyHours: z.number().int().min(0).max(168).optional().default(40),
    }),
  }),

  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      name: z.string().min(1).max(255).optional(),
      email: z.string().email().optional(),
      role: userRoleSchema.optional(),
      weeklyHours: z.number().int().min(0).max(168).optional(),
      isActive: z.boolean().optional(),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
};

// Survey Response schemas
export const surveySchemas = {
  create: z.object({
    body: z
      .object({
        teamMemberId: z.string().uuid().optional(),
        weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        capacity: z.number().int().min(0).max(150),
        stressLevel: z.number().int().min(1).max(10),
        anticipatedWorkload: workloadLevelSchema,
        comments: z.string().max(2000).optional(),
        highWorkloadReason: highWorkloadReasonSchema.optional(),
        highWorkloadOther: z.string().max(500).optional(),
        stressReduction: z.string().max(1000).optional(),
      })
      .refine(
        (data) => {
          if (data.capacity > 100 && !data.highWorkloadReason) {
            return false;
          }
          return true;
        },
        {
          message: 'High workload reason required when capacity exceeds 100%',
        }
      ),
  }),

  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      capacity: z.number().int().min(0).max(150).optional(),
      stressLevel: z.number().int().min(1).max(10).optional(),
      anticipatedWorkload: workloadLevelSchema.optional(),
      comments: z.string().max(2000).optional(),
      highWorkloadReason: highWorkloadReasonSchema.optional(),
      highWorkloadOther: z.string().max(500).optional(),
      stressReduction: z.string().max(1000).optional(),
    }),
  }),

  query: z.object({
    query: z.object({
      week: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      teamMemberId: z.string().uuid().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    }),
  }),

  getById: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
};

// Analytics schemas
export const analyticsSchemas = {
  teamTrends: z.object({
    query: z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
  }),

  userTrends: z.object({
    params: z.object({
      userId: z.string().uuid(),
    }),
    query: z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
  }),

  weeklySummary: z.object({
    query: z.object({
      week: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
  }),
};
