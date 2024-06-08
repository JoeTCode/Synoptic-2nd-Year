const { passport, checkNotAuthenticated, checkAuthenticated } = require('./controllers/loginController');

module.exports = {
    passport,
    checkNotAuthenticated,
    checkAuthenticated
};
