var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('../database');

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next();
}


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res, next) { 
    res.render('signup', { title: 'Express' });
    }
);

router.post('/', checkNotAuthenticated, async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!username || !hashedPassword) {
        return  res.render('signup', { nullError: 'Please fill in all fields' });
    }
    try {
        await pool.query('INSERT INTO admins (name, password) VALUES ($1, $2)', [username, hashedPassword]);
        console.log("User successfully registered");
        console.log(username, hashedPassword, password);
        res.redirect('login');
    } catch (err) {
        console.error(err);
        next(err);
    }
})
module.exports = router;