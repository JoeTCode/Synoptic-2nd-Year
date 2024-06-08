var express = require('express');
var router = express.Router();
const pool = require('../database');


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  return res.redirect('/login');
}

router.get('/', checkAuthenticated, async function(req, res, next) {

  try {
    const result = await pool.query('SELECT * FROM test');
    res.json(result.rows);
    
  } catch (err) {
    next(err);
  }
});

module.exports = router;
