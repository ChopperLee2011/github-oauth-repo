'use strict';
var Github = require('github-api');
var markdown = require('markdown').markdown;

function getAccessToken(req, res) {
        return new Github({
            token: req.session.gitHubAccessToken,
            auth: "oauth"
        });
    }

exports.list = function(req, res) {
    var user = getAccessToken(req).getUser();
    user.repos(function(err, repos) {
        return res.json(200, repos);
    });
};
exports.showIssue = function(req, res) {
    var issues = getAccessToken(req).getIssues(req.session.userName, req.params.repoName);
    issues.list(null, function(err, issues) {
        return res.json(200, issues);
    });
};

exports.showIssueDetail = function(req, res) {
    // console.log('req.params.repoName, req.params.issueNum: ' + req.params.repoName + ',' + req.params.issueNum);
    var issue = getAccessToken(req).getIssue(req.session.userName, req.params.repoName, req.params.issueNum);
    issue.list(null, function(err, issue) {
        issue.body = markdown.toHTML(issue.body);
        return res.json(200, issue);
    });
};
