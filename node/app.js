var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { Client } = require('pg');
const db1 = require('./database.js');

var app = express(); // Initialize the Express application

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const passport = require('passport');
// Define your routes here
// For example:
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.authenticate('session'));
app.use(passport.initialize());



var indexRouter = require('./routes/index');
var testRouter = require('./routes/test');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
