var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database');




const { passport, checkNotAuthenticated } = require('../passport-config');

router.get('/', checkNotAuthenticated, async function(req, res, next) { 
    const hashedPassword = await bcrypt.hash('pass', 10);
    try {
        await pool.query('INSERT INTO admins (name, password, phone_number) VALUES ($1, $2, $3)', ['admin1', hashedPassword,'+855 22 324 3949'])
    } catch (err) {
        if (err.code === '23505') {
            console.log('');
        }
    }
    res.render('login', { title: 'Login' });
    }
);

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;
