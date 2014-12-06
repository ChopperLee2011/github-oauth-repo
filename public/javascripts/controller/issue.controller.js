'use strict';
angular.module('oauth')
    .controller('issueCtrl', function($scope, $routeParams, $sce, reposFactory) {
        $scope.issueDetail = function() {
            reposFactory.get({
                repo: 'repo',
                repoName: $routeParams.repoName,
                issueNum: $routeParams.issueNum
            }, function(data) {
                $scope.repoIssue = data;
            });
        };
    });
