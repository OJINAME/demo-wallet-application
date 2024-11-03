"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('wallets', (table) => {
        table.uuid('id').primary();
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.decimal('balance', 15, 2).defaultTo(0);
        table.enum('status', ['active', 'frozen']).defaultTo('active');
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('wallets');
}
