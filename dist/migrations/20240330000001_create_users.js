"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary();
        table.string('email').unique().notNullable();
        table.string('phone_number').unique().notNullable();
        table.string('password_hash').notNullable();
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('users');
}
