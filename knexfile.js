// knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2', 
    connection: process.env.MYSQLURL,
    migrations: {
      directory: './src/migrations'
    },
  },
};
