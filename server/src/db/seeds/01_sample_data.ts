import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('survey_responses').del();
  await knex('sessions').del();
  await knex('team_members').del();
  await knex('users').del();

  // Insert team members (without linked users initially - they'll link on first OAuth login)
  const teamMembers = await knex('team_members')
    .insert([
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        role: 'admin',
        avatar_initials: 'SC',
        weekly_hours: 40,
      },
      {
        name: 'Michael Torres',
        email: 'michael.torres@example.com',
        role: 'manager',
        avatar_initials: 'MT',
        weekly_hours: 40,
      },
      {
        name: 'Emily Watson',
        email: 'emily.watson@example.com',
        role: 'member',
        avatar_initials: 'EW',
        weekly_hours: 32,
      },
      {
        name: 'James Kim',
        email: 'james.kim@example.com',
        role: 'member',
        avatar_initials: 'JK',
        weekly_hours: 40,
      },
      {
        name: 'Alexandra Brown',
        email: 'alexandra.brown@example.com',
        role: 'member',
        avatar_initials: 'AB',
        weekly_hours: 40,
      },
    ])
    .returning('*');

  // Get current Monday for week_start
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  const weekStart = monday.toISOString().split('T')[0];

  // Insert sample survey responses for current week
  await knex('survey_responses').insert([
    {
      team_member_id: teamMembers[0].id,
      week_start: weekStart,
      capacity: 115,
      stress_level: 8,
      anticipated_workload: 'high',
      comments: 'The Q1 release is coming up fast and we still have a few critical bugs to squash. I might need to work some extra hours this week to make sure everything is ready for launch. Feeling the pressure but confident we can deliver.',
      high_workload_reason: 'project_deadline',
      stress_reduction: 'It would help if we could get an extra engineer to help with the bug backlog, or push non-critical features to Q2.',
    },
    {
      team_member_id: teamMembers[1].id,
      week_start: weekStart,
      capacity: 90,
      stress_level: 4,
      anticipated_workload: 'medium',
      comments: 'Sprint planning went smoothly this week. The team is aligned on priorities and I feel good about our velocity. Looking forward to the design review on Thursday.',
    },
    {
      team_member_id: teamMembers[2].id,
      week_start: weekStart,
      capacity: 105,
      stress_level: 7,
      anticipated_workload: 'high',
      comments: 'Juggling three different design reviews this week plus the new onboarding flow mockups. Excited about the work but feeling stretched thin.',
      high_workload_reason: 'meetings',
      stress_reduction: 'Would be great to consolidate some review meetings or get feedback async instead. Also could use a design intern to help with basic asset exports.',
    },
    {
      team_member_id: teamMembers[3].id,
      week_start: weekStart,
      capacity: 75,
      stress_level: 3,
      anticipated_workload: 'low',
      comments: 'Just wrapped up the payment integration feature - feels great to have that shipped! Taking some time to refactor and write better tests. Happy to pick up extra work if anyone needs help.',
    },
    {
      team_member_id: teamMembers[4].id,
      week_start: weekStart,
      capacity: 120,
      stress_level: 9,
      anticipated_workload: 'high',
      comments: 'Two team members are out sick and I am covering their testing responsibilities on top of my own work. The regression suite needs to be run before the release and I am worried about missing edge cases.',
      high_workload_reason: 'understaffed',
      stress_reduction: 'Urgent: need help with manual testing for the checkout flow. Could we bring in a contractor or delay the release by a few days?',
    },
  ]);
}
