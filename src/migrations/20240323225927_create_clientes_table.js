exports.up = function(knex) {
    return knex.schema.createTable('cliente', function (table){
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.integer('CPF').notNullable();
        table.integer('CEP').notNullable();
        table.string('senha').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('cliente');
};
