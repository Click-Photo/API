// knexfile.js
module.exports = {
    development: {
    client: 'mysql2', 
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "click",
    },
      migrations: {
        directory: './src/migrations'
      },
    }
  };
  