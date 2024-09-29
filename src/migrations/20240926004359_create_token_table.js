exports.up = function(knex) {
    return knex.schema.createTable('token', function(table){
      table.integer('idCliente').unsigned().notNullable();
      table.integer('idFotografo').unsigned().notNullable();
      table.string('token').notNullable();
  
  
      table.foreign('idCliente').references('id').inTable('confirmaCliente');
      table.foreign('idFotografo').references('id').inTable('confirmaFotografo');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('token');
  }