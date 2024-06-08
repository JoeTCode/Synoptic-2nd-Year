var express = require('express');
var router = express.Router();
require('../passport-config');
const passport = require('passport');
const bcrypt = require('bcrypt');
const pool = require('../database');

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    return next();
}

router.get('/', checkNotAuthenticated, async function(req, res, next) {
    const hashedPassword = await bcrypt.hash('pass', 10);
    try {
        await pool.query('INSERT INTO admins (name, password, phone_number) VALUES ($1, $2, $3)', ['admin1', hashedPassword,'+855 22 324 3949'])
    } catch (err) {
        if (err.code === '23505') {
            console.log('');
        }
    }
    try {
        const res = await pool.query('SELECT * FROM admins');
        console.log(res.rows);
    } catch (err) {
        if (err.code === '23505') {
            console.log('');
        }
    }
    
    res.render('login', { title: 'Express' });
    }
);

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;