var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('../database');
const { checkNotAuthenticated } = require('../passport-config');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', checkNotAuthenticated, function(req, res, next) {
    res.render('signup', { title: 'Express' });
});

router.post('/', checkNotAuthenticated, async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const phone_number = req.body.phone;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!username || !hashedPassword || !phone_number) {
        return res.render('signup', { nullError: 'Please fill in all fields' });
    }
    try {
        await pool.query('INSERT INTO admins (name, password, phone_number) VALUES ($1, $2, $3)', [username, hashedPassword, phone_number]);
        console.log("User successfully registered");
        console.log(username, hashedPassword, password);
        res.redirect('login');
    } catch (err) {
        if (err.code === '23505') { // PostgreSQL error code for unique violation
            console.error('Non-unique value error:', err.message);
            res.render('signup', { duplicateError: 'Please enter unique username and email' });
        } else {
            console.error(err);
            next(err);
        }
    }
});

module.exports = router;
