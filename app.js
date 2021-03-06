const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');
// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const partnerRouter = require('./routes/partnerRouter');
const promotionRouter = require('./routes/promotionRouter');

const mongoose = require('mongoose');
// mongo server url
const url = 'mongodb://localhost:27017/nucampsite';
// connect to mongo server using mongoose
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
   err => console.log(err)
);

// instantiate express class
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// morgan middleware
app.use(logger('dev'));
// parses res.body object and stores json properties
app.use(express.json());
// parses URL-encoded data with the querystring library
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));

// locally store user session
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// auth and session
app.use(passport.initialize());
app.use(passport.session());

// router routes !auth access
app.use('/', indexRouter);
app.use('/users', userRouter);

// check for user authentication
function auth(req, res, next) {
  console.log(req.user);

  if (!req,user) {
    const err = new Error ('You are not authenticated!');
    err.status = 403;
    return next(err);
  } else {
    return next();
  }
}

app.use(auth);

// serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// router routes - auth required
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/partners', partnerRouter);
app.use('/promotions', promotionRouter);

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
