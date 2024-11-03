import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.uuid('wallet_id').references('id').inTable('wallets').onDelete('CASCADE');
    table.enum('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('reference').unique().notNullable();
    table.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
    table.jsonb('metadata');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
