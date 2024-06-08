var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database');




const { passport, checkNotAuthenticated } = require('../passport-config');

router.get('/', checkNotAuthenticated, async function(req, res, next) { 
    // inserting ADMIN object with NAME: admin1
    // PASSWORD: pass
    // PHONE NUMBER: +855 22 324 3949
    // upon routing to login
    
    try {
        const hashedPassword = await bcrypt.hash('pass', 10);
        await pool.query('INSERT INTO admins (name, password, phone_number) VALUES ($1, $2, $3)', ['admin1', hashedPassword,'+855 22 324 3949'])
    } catch (err) {
        if (err.code === '23505') {
            console.log('');
        }
    }
    // insert ends here
    res.render('login', { title: 'Login' });
    }
);

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;
