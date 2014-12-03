'use strick'
angular.module('oauth')
    .factory('reposFactory', function($resource) {

        return $resource('/api/repos/:repo/:repoName/:issueNum', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .controller('reposCtrl', function($scope, $routeParams, $sce, reposFactory) {
        $scope.find = function() {
            $scope.repos = reposFactory.query();
        };
        $scope.findOne = function() {
            $scope.repoName = $routeParams.repoName;
            $scope.issues = reposFactory.query({
                repo: 'repo',
                repoName: $routeParams.repoName
            });
        };
        $scope.issueDetail = function() {
            $scope.repoIssue = reposFactory.get({
                repo: 'repo',
                repoName: $routeParams.repoName,
                issueNum: $routeParams.issueNum
            });
            console.log($scope.repoIssue.body);
            $scope.displayHtml = function() {
                return $sce.trustAsHtml($scope.repoIssue.body);
            };
        };
    });
