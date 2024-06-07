// Requires
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const { Pool } = require('pg');
const db1 = require('./database.js');

// Initialize the Express application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define your routes here
// For example:
// var indexRouter = require('./routes/index');
// var testRouter = require('./routes/test');
// app.use('/', indexRouter);
// app.use('/test', testRouter);

// Routers
var indexRouter = require('./routes/index');
var testRouter = require('./routes/test');
var alertsRouter = require('./routes/alerts');
var manageUsersRouter = require('./routes/manageUsers');
var sendMessageRouter = require('./routes/sendMessage');
var settingsRouter = require('./routes/settings');
var weatherRouter = require('./routes/weather');

// Use the routes
app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/alerts', alertsRouter);
app.use('/manage-users', manageUsersRouter);
app.use('/send-message', sendMessageRouter);
app.use('/settings', settingsRouter);
app.use('/weather', weatherRouter);



// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
