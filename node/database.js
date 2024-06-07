const { Pool } = require('pg');


  const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'pms',
  user: 'postgres',
  password: 'password'
});



module.exports = pool;