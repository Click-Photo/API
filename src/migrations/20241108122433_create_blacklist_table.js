exports.up = function(knex) {
    return knex.schema.createTable('blacklist',function(table) {
        table.increments('id').primary();
        table.integer('idUser').unsigned().notNullable();
        table.string('Motivo').notNullable();


        table.foreign('idUser').references('id').inTable('user');

    })
};
exports.down = function(knex) {
  return knex.schema.dropTable('blacklist');
};
