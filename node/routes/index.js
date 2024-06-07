var express = require('express');
var router = express.Router();

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}
router.get('/', checkAuthenticated, function(req, res, next) { 
    res.render('index', { title: 'Express', name: req.user.username });
    }
);

module.exports = router;