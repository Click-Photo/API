exports.up = function(knex) {
    return knex.schema.createTable('reports', function(table) {
        table.increments('id').primary();
        table.integer('idUser').unsigned().notNullable();
        table.integer('idPostagem').unsigned().notNullable(); // id do job ou foto do portfólio
        table.string('tipo').notNullable(); // tipo da postagem: 'job' ou 'photo'
        table.text('motivo').notNullable(); // motivo da denúncia
        
        table.foreign('idUser').references('id').inTable('user');
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('reports');
};
