var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');

/* GET Settings page. */
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('settings', { title: 'Settings' });
});

module.exports = router;