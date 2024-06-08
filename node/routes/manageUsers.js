var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');

/* GET manageUsers page. */
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('manageUsers', { title: 'Manage Users' });
});

module.exports = router;