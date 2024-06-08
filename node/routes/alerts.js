var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');

/* GET Alerts page. */
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('alerts', { title: 'Alerts' });
});

module.exports = router;