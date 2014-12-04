'use strict';

var express = require('express');
var repos = require('./repos.controller');

var router = express.Router();

router.get('/', repos.list);
router.get('/repo/:repoName/:issueNum',repos.showIssueDetail);
router.get('/repo/:repoName', repos.showIssues);

module.exports = router;
