var express = require('express');
var router = express.Router();
require('../passport-config');
const passport = require('passport');

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next();
}

router.get('/', checkNotAuthenticated, function(req, res, next) { 
    res.render('login', { title: 'Express' });
    }
);

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;