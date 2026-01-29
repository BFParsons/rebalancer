import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE workload_level AS ENUM ('low', 'medium', 'high')`);
  await knex.raw(`CREATE TYPE high_workload_reason AS ENUM (
    'project_deadline',
    'understaffed',
    'unplanned_work',
    'meetings',
    'dependencies',
    'other'
  )`);

  await knex.schema.createTable('survey_responses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('team_member_id')
      .notNullable()
      .references('id')
      .inTable('team_members')
      .onDelete('CASCADE');
    table.date('week_start').notNullable();
    table.integer('capacity').notNullable();
    table.integer('stress_level').notNullable();
    table.specificType('anticipated_workload', 'workload_level').notNullable();
    table.text('comments');
    table.specificType('high_workload_reason', 'high_workload_reason');
    table.text('high_workload_other');
    table.text('stress_reduction');
    table.timestamp('submitted_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());

    table.unique(['team_member_id', 'week_start']);
    table.index('team_member_id');
    table.index('week_start');
    table.index('submitted_at');
  });

  // Add check constraints
  await knex.raw(`
    ALTER TABLE survey_responses
    ADD CONSTRAINT capacity_range CHECK (capacity >= 0 AND capacity <= 150)
  `);
  await knex.raw(`
    ALTER TABLE survey_responses
    ADD CONSTRAINT stress_level_range CHECK (stress_level >= 1 AND stress_level <= 10)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('survey_responses');
  await knex.raw('DROP TYPE high_workload_reason');
  await knex.raw('DROP TYPE workload_level');
}
