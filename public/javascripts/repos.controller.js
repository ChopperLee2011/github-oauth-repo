'use strick'
angular.module('oauth')
    .factory('reposFactory', function($resource) {

        return $resource('/api/repos/:repoName', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .factory('issueFactory', function($resource) {

        return $resource('/api/repo/:repoName/:issueNum', {}, {
            get: {
                method: 'GET'
            }
        });
    })
    .controller('reposCtrl', function($scope, $http, $routeParams, $location, reposFactory, issueFactory) {
        $scope.find = function() {
            $scope.repos = reposFactory.query();
        };
        $scope.findOne = function() {
            $scope.repoName = $routeParams.repoName;
            $scope.issues = reposFactory.query({
                repoName: $routeParams.repoName
            });
        };
    })
    .controller('issueCtrl', function($scope, $http, $routeParams, $location, reposFactory, issueFactory) {
        $scope.issueDetail = function() {
            $scope.repoIssue = issueFactory.get({
                // repoName: $scope.repoName,
                repoName: $routeParams.repoName,
                issueNum: $routeParams.issueNum
            });
            console.log($scope.repoIssue);
        };
    })
    // .controller('authCtrl', ['$scope','$window', function($scope,$window) {
    //     $scope.loginOauth = function(provider) {
    //         $scope.test = "he"
    //         console.log('hello world');
    //         $window.location.href = '/auth/github';
    //     };
    // }]);
