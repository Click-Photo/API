exports.up = function(knex) {
    return knex.schema.createTable('confirmaAdmin', function (table){
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.string('CPF').notNullable();
        table.string('CEP').notNullable();
        table.string('senha').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('confirmaAdmin');
};