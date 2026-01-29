import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('team_members', (table) => {
    // Avatar type: 'initials', 'animal', or 'custom'
    table.string('avatar_type', 20).defaultTo('initials');
    // For animal avatars, stores the animal id (e.g., 'fox', 'owl')
    table.string('avatar_animal', 20);
    // For custom uploads, stores the base64 image data
    table.text('avatar_image_url');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('team_members', (table) => {
    table.dropColumn('avatar_type');
    table.dropColumn('avatar_animal');
    table.dropColumn('avatar_image_url');
  });
}
