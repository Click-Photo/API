exports.up = function(knex) {
    return knex.schema.createTable('sign_in_ticket', function(table){
      table.integer('idUser').unsigned().notNullable();
      table.string('token').notNullable();
  
  
      table.foreign('idUser').references('id').inTable('user');
      
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sign_in_ticket');
  }