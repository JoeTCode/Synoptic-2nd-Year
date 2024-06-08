var express = require('express');
var router = express.Router();
const { passport, checkNotAuthenticated } = require('../passport-config');

router.get('/', checkNotAuthenticated, function(req, res, next) { 
    res.render('login', { title: 'Login' });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;
