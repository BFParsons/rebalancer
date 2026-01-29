import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE user_role AS ENUM ('admin', 'manager', 'member')`);

  await knex.schema.createTable('team_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.specificType('role', 'user_role').notNullable().defaultTo('member');
    table.string('avatar_initials', 4);
    table.integer('weekly_hours').notNullable().defaultTo(40);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);

    table.index('user_id');
    table.index('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('team_members');
  await knex.raw('DROP TYPE user_role');
}
