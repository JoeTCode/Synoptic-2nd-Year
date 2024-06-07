var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { 
    res.render('alerts', { title: 'Alerts' });
    }
);

module.exports = router;