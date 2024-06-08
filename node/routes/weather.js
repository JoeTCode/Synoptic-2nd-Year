var express = require('express');
var router = express.Router();
const { checkAuthenticated } = require('../passport-config');

/* GET Weather page. */
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('weather', { title: 'Weather' });
});
module.exports = router;