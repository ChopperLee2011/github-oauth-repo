var repos = require('./api/repos');
var user = require('./api/user');
var jwt = require('jsonwebtoken');

module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.sendFile(app.get('views')+'/index.html');
    });
    app.get('/login', function(req, res) {
        res.sendFile(app.get('views')+'/login.html');
    });


    app.get('/repos', function(req, res) {
        res.sendFile(app.get('views')+'/index.html');
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/api/auth/github', passport.authenticate('github', {
        scope: ['profile', 'email']
    }));

    // the callback after github has authenticated the user
    app.get('/api/auth/github/callback',
        passport.authenticate('github', {
            // successRedirect: '/',
            failureRedirect: '/login',
            session: false
        }),
        function(req, res) {
            if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
            var token = jwt.sign({ _id: req.user._id },'github-oauth', { expiresInMinutes: 60*5 });
            res.cookie('token', JSON.stringify(token));
            res.redirect('/');
        });

    app.use('/api/repos', repos);
    app.use('/api/repo', repos);
    app.use('/api/user',user);
};

// route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }

// function isAuthenticated(req, res, next) {
//     if (req.user.authenticated) {
//         return next();
//     }
//     res.redirect('/');
// }
