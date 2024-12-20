var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let helmet = require('helmet');
let cors = require('cors');
let hpp = require('hpp');
let {xss} = require('express-xss-sanitizer');
let ratelimit = require('express-rate-limit');

var indexRouter = require('./routes/index');
var evalRouter = require('./routes/eval');
var cookieRouter = require('./routes/cookie');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Security considerations
app.use(ratelimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(xss());
// url of proxy, in this case because docker compose it is the DNS name of the container
app.set('trust proxy', 1);
// reduce fingerprinting
app.disable('x-powered-by');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/eval', evalRouter);
app.use('/cookie', cookieRouter);


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
