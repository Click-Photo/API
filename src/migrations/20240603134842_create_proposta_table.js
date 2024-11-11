exports.up = function(knex) {
    return knex.schema.createTable('proposta', function (table){
        table.increments('id').primary();
        table.integer('idJobs').unsigned().notNullable();
        table.integer('idFotografo').unsigned().notNullable();
        table.string('valorProposta').notNullable();
        table.string('descricao');
        table.string('status');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('proposta');
};
