'use strict';
angular.module('oauth')
    .factory('reposFactory', function($resource) {

        return $resource('/api/repos/:repo/:repoName/:issueNum', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .controller('reposCtrl', function($scope, $routeParams, $sce, reposFactory) {
        $scope.repos = function() {
            $scope.repos = reposFactory.query();
        };
        $scope.repoDetail = function() {
            $scope.noIssue=false;
            $scope.repoName = $routeParams.repoName;
            $scope.issues = reposFactory.query({
                repo: 'repo',
                repoName: $routeParams.repoName
            },function(data){
                if(data.length === 0) $scope.noIssue=true;
            });

        };
        $scope.issueDetail = function() {
            $scope.repoIssue = reposFactory.get({
                repo: 'repo',
                repoName: $routeParams.repoName,
                issueNum: $routeParams.issueNum
            });
        };
    });
