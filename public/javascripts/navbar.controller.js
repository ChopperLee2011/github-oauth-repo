'use strict';

angular.module('oauth')
    .controller('navCtrl', ['$scope', '$window', 'Auth', function($scope, $window, Auth) {
        $scope.getCurrentUser= Auth.getCurrentUser;
        $scope.logOut = function() {
            Auth.logout();
            console.log('User logout.');
            // $location.path('/login');
            $window.location.href = '/logout';
        };
    }]);
