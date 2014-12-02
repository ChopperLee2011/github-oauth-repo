'use strict';
var Github = require('github-api');

function getAccessToken(req, res) {
        return new Github({
            token: req.session.gitHubAccessToken,
            auth: "oauth"
        });
    }
    // var github = new Github({
    //     // token: "ea64feb91963354135d33e48fadce0927261baa8",
    //     token:"",
    //     auth: "oauth"
    // });

// var repo = github.getRepo('ChopperLee2011', "chat-websocket");
// repo.show(function(err, repo) {
//   console.log(repo);
// });

exports.list = function(req, res) {
    var user = getAccessToken(req).getUser();
    user.repos(function(err, repos) {
        return res.json(200, repos);
    });
};
exports.showIssue = function(req, res) {

    var issues = getAccessToken(req).getIssues('ChopperLee2011', req.params.repoName);
    issues.list(null, function(err, issues) {
        return res.json(200, issues);
    });
};

exports.showIssueDetail = function(req, res) {
    console.log('hello');
    console.log('req.params.repoName, req.params.issueNum: ' + req.params.repoName + ',' + req.params.issueNum);
    var issue = getAccessToken(req).getIssue('ChopperLee2011', req.params.repoName, req.params.issueNum);
    issue.list(null, function(err, issue) {
        return res.json(200, issue);
    });
};
