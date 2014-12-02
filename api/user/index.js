'use strict';

var express = require('express');
var user = require('./user.controller');
var auth = require('../auth/auth.service.js');
var router = express.Router();

router.get('/me', auth.isAuthenticated(), user.me);


module.exports = router;
