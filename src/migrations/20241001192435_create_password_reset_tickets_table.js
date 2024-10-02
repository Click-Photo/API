exports.up = function(knex) {
    return knex.schema.createTable('password_reset_tickets', function(table){
      table.integer('idUser').unsigned().notNullable();
      table.string('token').notNullable();
  
  
      table.foreign('idUser').references('id').inTable('user');
      
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('password_reset_tickets');
  }