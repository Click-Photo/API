exports.up = function(knex) {
    return knex.schema.createTable('avaliacoes', function (table) {
      table.increments('id').primary();
      table.integer('jobId').unsigned().notNullable();
      table.integer('clienteId').unsigned().notNullable();
      table.integer('fotografoId').unsigned().notNullable();
      table.decimal('notaCliente').nullable();  
      table.decimal('notaFotografo').nullable();  
      table.boolean('clienteAvaliado').defaultTo(false); //Campo que determina se o cliente já fez avaliação do fotografo
      table.boolean('fotografoAvaliado').defaultTo(false); //Campo que determina se o fotografo já fez avaliação do cliente

      table.foreign('jobId').references('id').inTable('jobs');
      table.foreign('clienteId').references('id').inTable('user');
      table.foreign('fotografoId').references('id').inTable('user');
      
      table.unique(['jobId', 'clienteId', 'fotografoId']);  
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('avaliacoes');
  };
  