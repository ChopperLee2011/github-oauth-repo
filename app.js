var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('flash');
var app = express();

var mongoDB = require('./config/database.js');
require('./config/passport')(passport);
//db connection
mongoose.connect(mongoDB.url, {
    db: {
        safe: true
    }
});

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/public/views'));



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'github-oauth',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongoose_connection: mongoose.connection
    }),
    unset: 'destroy'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app, passport);

module.exports = app;
