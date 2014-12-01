'use strict';

var express = require('express');
var user = require('./user.controller');

var router = express.Router();

router.get('/:id',getUser);


module.exports = router;
