const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log('logintest');
    try {
        const data = await pool.query('SELECT * FROM admins WHERE name = $1;', [username]);
        const user = data.rows[0];
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return cb(null, user)
            } else {
                return cb(null, false, { message: 'Incorrect password'});
            }
        } catch (error) {
            return cb(error);
        }
    } catch (error) {
        return cb(error);
    }
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { uid: user.admin_id, username: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

module.exports = {
    passport,
    checkNotAuthenticated,
    checkAuthenticated
};
