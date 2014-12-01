var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var app = express();


var User = require('./api/user/user.model.js');
var repos = require('./api/repos');

//oauth
var GITHUB_CLIENT_ID = "285539e1c4dbb3042bb5";
var GITHUB_CLIENT_SECRET = "dbc91e4e864406e0f9c12e3237678c113d19a521";

//db connection
mongoose.connect('mongodb://localhost/github-oauth', {
    db: {
        safe: true
    }
});

// view engine setup
app.set('views', path.join(__dirname, '/public/views'));
// app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'github oauth',
    cookie: {
        secure: true
    },
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongoose_connection: mongoose.connection
    })
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/repos', repos);
app.use('/api/repo', repos);

app.get('/', function(req, res) {
    res.sendfile('public/views/index.html');
});
app.get('/repos', function(req, res) {
    res.sendfile('public/views/index.html');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
//
//

//Passport setting
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });
// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        oauthID: profile.id
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!err && user !== null) {
            done(null, user);
        } else {
            var user = new User({
                oauthID: profile.id,
                name: profile.displayName,
                created: Date.now()
            });
            user.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("saving user ...");
                    done(null, user);
                }
            });
        }
    });
}));
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        console.log(user);
        if (!err) done(null, user);
        else done(err, null);
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/github", passport.authenticate("github", {
    scope: "email"
}));
app.get("/auth/github/callback",
    passport.authenticate("github", {
        successRedirect: '/repos',
        failureRedirect: '/'
    }));

app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = app;
