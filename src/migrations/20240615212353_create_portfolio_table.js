exports.up = function(knex) {
    return knex.schema.createTable('portfolio', table => {
      table.increments('id').primary();
      table.integer('fotografoId').unsigned().references('id').inTable('fotografo').onDelete('CASCADE');
      table.string('fotoUrl').notNullable();
      table.text('descricao');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('portfolio');
  };
  