var repos = require('./api/repos');
var user = require('./api/user');
var jwt = require('jsonwebtoken');

module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.sendFile(app.get('views') + '/index.html');
        // res.render('views/index.html');
    });
    app.get('/login', function(req, res) {
        res.sendFile(app.get('views') + '/login.html');
    });
    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    app.get('/api/auth/github', passport.authenticate('github', {
        scope: ['profile', 'email']
    }));

    // the callback after github has authenticated the user
    app.get('/api/auth/github/callback',
        passport.authenticate('github', {
            // successRedirect: '/',
            failureRedirect: '/login',
            session: true
        }),
        function(req, res) {
            if (!req.user) return res.json(404, {
                message: 'Something went wrong, please try again.'
            });
            var token = jwt.sign({
                _id: req.user._id
            }, 'github-oauth', {
                expiresInMinutes: 60 * 5
            });
            res.cookie('token', JSON.stringify(token));
            res.redirect('/');
        });

    app.use('/api/repos', repos);
    app.use('/api/user', user);
};
