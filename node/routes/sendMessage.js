var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { 
    res.render('sendMessage', { title: 'Send Message' });
    }
);

module.exports = router;