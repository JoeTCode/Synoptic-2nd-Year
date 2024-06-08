var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');

/* GET Send Message page. */
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('sendMessage', { title: 'Send Message' });
});

module.exports = router;