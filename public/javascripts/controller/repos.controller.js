'use strict';
angular.module('oauth')
    .controller('reposCtrl', function($scope,reposFactory) {
        $scope.reposList = function() {
            reposFactory.query({}, function(data) {
                $scope.repos = data;
                $scope.count = $scope.repos.length;
            });
        };
    });
