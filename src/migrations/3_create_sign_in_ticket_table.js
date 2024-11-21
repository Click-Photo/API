exports.up = function(knex) {
    return knex.schema.createTable('sign_in_ticket', function(table){
      table.integer('idUser').unsigned();
      table.string('ticket').notNullable();
  
  
      table.foreign('idUser').references('id').inTable('confirmaUser');
      
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('sign_in_ticket');
  }