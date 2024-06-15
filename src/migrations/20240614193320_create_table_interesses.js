exports.up = function(knex) {
    return knex.schema.createTable('interesses', function (table){
        table.increments('id').primary();
        table.integer('idJobs').unsigned().notNullable();
        table.integer('idFotografo').unsigned().notNullable();

        table.foreign('idJobs').references('id').inTable('jobs');
        table.foreign('idFotografo').references('id').inTable('fotografo');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('interesses');
};
