var express = require('express');
var router = express.Router();

/* GET manageUsers page. */
router.get('/', function(req, res, next) { 
    res.render('manageUsers', { title: 'Manage Users' });
    }
);

module.exports = router;