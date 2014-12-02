'use strict';

// var jwt = require('jsonwebtoken');

var User = require('./user.model');


exports.me = function(req, res, next) {
    // console.log('req: ' + req.headers);
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user);
    });
};
