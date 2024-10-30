exports.up = function(knex) {
    return knex.schema.createTable('admin', function(table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.string('email').unique().notNullable();
        table.string('CPF').unique().notNullable();
        table.string('CEP').notNullable();
        table.string('senha').notNullable();
        table.timestamp('dataEntrada').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('admin');
};
