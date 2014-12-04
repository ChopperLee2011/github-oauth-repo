'use strict';
var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    avatarurl:String,
    name: String,
    role:String,
    username:String,
    created: Date
});

module.exports = User;
