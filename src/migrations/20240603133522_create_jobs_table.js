exports.up = function(knex) {
    return knex.schema.createTable('jobs', function (table){
        table.increments('id').primary();
        table.integer('idCliente').unsigned().notNullable();
        table.integer('idFotografo').unsigned();
        table.date('dataJob').notNullable();
        table.timestamp('dataCriacao').notNullable();
        table.string("titulo").notNullable();
        table.string("descricao").notNullable();
        table.string("local").notNullable();
        table.string('status');
        table.string("preco").notNullable();
        table.boolean('isTrending').defaultTo(false);

        table.foreign('idCliente').references('id').inTable('user');
        table.foreign('idFotografo').references('id').inTable('user');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('jobs');
};
