var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var User = require('../api/user/user.model.js');
var configAuth = require('./auth');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if (err) done(err, null);
            done(null, user);
        });
    });
    passport.use(new GithubStrategy({
        clientID: configAuth.githubAuth.GITHUB_CLIENT_ID,
        clientSecret: configAuth.githubAuth.GITHUB_CLIENT_SECRET,
        callbackURL: configAuth.githubAuth.CALLBACK_URL,
        //config the passport pass value to req
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({
                oauthID: profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                //set value to session
                req.session.gitHubAccessToken = accessToken;
                req.session.userName = profile.username;
                req.session.oauthID = profile.id;
                if (!err && user !== null) {
                    return done(null, user);
                } else {
                    var newUser = new User({
                        oauthID: profile.id,
                        avatarurl: profile.avatar_url,
                        name: profile.displayName,
                        username: profile.username,
                        role: 'user',
                        created: Date.now()
                    });
                    //save user
                    newUser.save(function(err) {
                        if (err) {
                            throw (err);
                        } else {
                            return done(null, newUser);
                        }
                    });
                }
            });
        });
    }));
};
