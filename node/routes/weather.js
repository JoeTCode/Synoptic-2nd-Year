var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) { 
    res.render('weather', { title: 'Weather Forecast' });
    }
);

module.exports = router;