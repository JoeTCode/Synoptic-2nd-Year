const { Pool } = require('pg');


  const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'synoptic',
  user: 'postgres',
  password: 'password'
});



module.exports = pool;