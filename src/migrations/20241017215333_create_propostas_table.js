exports.up = function(knex) {
    return knex.schema.createTable('proposta',function(table) {
        table.increments('id').primary();
        table.integer('idJobs').unsigned().notNullable();
        table.integer('idCliente').unsigned().notNullable();
        table.integer('idFotografo').unsigned().notNullable();
        table.string('status');

        table.foreign('idCliente').references('id').inTable('cliente');
        table.foreign('idFotografo').references('id').inTable('fotografo');
    })
};
exports.down = function(knex) {
  return knex.schema.dropTable('proposta');
};
