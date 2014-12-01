'use strict';

var express = require('express');
var repos = require('./repos.controller');

var router = express.Router();

router.get('/', repos.list);
router.get('/:repoName/:issueNum',repos.showIssueDetail)
router.get('/:repoName', repos.showIssue);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
