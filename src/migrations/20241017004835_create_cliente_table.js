exports.up = function(knex) {
    return knex.schema.createTable('cliente', function(table){
      table.integer('idUser').unsigned();
      table.string('stripeAccountId');
  
      
      table.foreign('idUser').references('id').inTable('user');
    
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('cliente');
  }