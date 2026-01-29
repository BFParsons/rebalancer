import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create enum types
  await knex.raw(`CREATE TYPE oauth_provider AS ENUM ('google', 'microsoft')`);

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).notNullable().unique();
    table.specificType('oauth_provider', 'oauth_provider').notNullable();
    table.string('oauth_provider_id', 255).notNullable();
    table.string('display_name', 255);
    table.text('avatar_url');
    table.timestamp('last_login_at', { useTz: true });
    table.timestamps(true, true);

    table.unique(['oauth_provider', 'oauth_provider_id']);
    table.index('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  await knex.raw('DROP TYPE oauth_provider');
}
