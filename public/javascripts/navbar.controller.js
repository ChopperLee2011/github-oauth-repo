'use strict';

angular.module('oauth')
    .controller('navCtrl', ['$scope', '$window', 'Auth', function($scope, $window, Auth) {
        $scope.getCurrentUser= Auth.getCurrentUser;
        // $scope.avatarurl = $scope.getCurrentUser
        $scope.logOut = function() {
            Auth.logout();
            $window.location.href = '/logout';
        };
    }]);
