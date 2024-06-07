var express = require('express');
var router = express.Router();

/* GET send message page. */
router.get('/', function(req, res, next) { 
    res.render('sendMessage', { title: 'Send Message' });
    }
);

module.exports = router;