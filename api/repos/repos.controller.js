'use strict';
var Github = require('github-api');
var github = new Github({
    token: "ea64feb91963354135d33e48fadce0927261baa8",
    auth: "oauth"
});

// var repo = github.getRepo('ChopperLee2011', "chat-websocket");
// repo.show(function(err, repo) {
//   console.log(repo);
// });

exports.list = function(req, res) {
    var user = github.getUser();
    user.repos(function(err, repos) {
        return res.json(200, repos);
    });
};
exports.showIssue = function(req, res) {

    var issues = github.getIssues('ChopperLee2011', req.params.repoName);
    issues.list(null, function(err, issues) {
        return res.json(200, issues);
    });
};

exports.showIssueDetail = function(req, res) {
    console.log('hello');
    console.log('req.params.repoName, req.params.issueNum: ' + req.params.repoName + ',' + req.params.issueNum);
    var issue = github.getIssue('ChopperLee2011', req.params.repoName, req.params.issueNum);
    issue.list(null, function(err, issue) {
        return res.json(200, issue);
    });
};
