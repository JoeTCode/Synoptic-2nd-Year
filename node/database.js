const { Pool } = require('pg');


  const pool = new Pool({
  host: '',
  port: 5432,
  database: '',
  user: '',
  password: ''
});



module.exports = pool;