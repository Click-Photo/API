exports.up = function(knex) {
    return knex.schema.createTable('confirmaFotografo', function (table){
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.string('CPF').notNullable();
        table.string('CEP').notNullable();
        table.string('senha').notNullable();
        table.timestamp('dataEntrada').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('confirmaFotografo');
};
