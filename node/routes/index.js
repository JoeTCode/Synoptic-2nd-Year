var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');


router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('index', { title: 'Home', name: req.user.username });
});

module.exports = router;