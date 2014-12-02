'use strict';

var User = require('../user/user.model');
var compose = require('composable-middleware');
var expressJwt = require('express-jwt');
var validateJwt = expressJwt({
    secret: 'github-oauth'
});


/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            // allow access_token to be passed through query parameter as well
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
            // console.log('req.user._id: '+ req.user._id);
            User.findById(req.user._id, function(err, user) {
                if (err) return next(err);
                if (!user) return res.send(401);

                req.user = user;
                next();
            });
        });
}
exports.isAuthenticated = isAuthenticated;
