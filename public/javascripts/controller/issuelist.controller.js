'use strict';
angular.module('oauth')
    .controller('issueListCtrl', function($scope, $routeParams, $sce, reposFactory) {
        var localIssues = [];
        $scope.issueList = function() {
            $scope.noIssue = false;
            $scope.repoName = $routeParams.repoName;
            reposFactory.query({
                repo: 'repo',
                repoName: $routeParams.repoName
            }, function(data) {
                localIssues = data;
                $scope.issueFilter('open');
                if (data.length === 0) $scope.noIssue = true;
            });
        };
        $scope.issueFilter = function(state) {
            $scope.issues = localIssues.filter(function(issue) {
                return issue.state === state;
            });
        };
    });
