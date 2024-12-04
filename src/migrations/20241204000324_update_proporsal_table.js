/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('proposta', function (table) {
    table.decimal("valorProposta").alter()
    table.timestamp("dataCriacao").defaultTo(knex.fn.now())
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('proposta', function (table) {
    table.string("valorProposta").alter()
  })
};
