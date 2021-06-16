var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');

require('dotenv').config();
require('./modules/passport');
var passport = require('passport');

var indexRouter = require('./routes/index');
var articleRouter = require('./routes/articles');
var commentRouter = require('./routes/comments');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var auth = require('./middlewares/auth');

mongoose.connect(
  'mongodb://localhost/blogs-new',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log(err ? err : 'Connected to database');
  }
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store:  MongoStore.create({ mongoUrl: "mongodb://localhost/blogs-new" }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(auth.userInfo);
app.use('/', indexRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Page not found');
});

module.exports = app;