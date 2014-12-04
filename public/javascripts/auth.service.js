'use strict';

angular.module('oauth')
    .factory('User', function($resource) {
        return $resource('/api/user/me', {
            get: {
                method: 'GET'
            }
        });
    })
    .factory('Auth', function Auth(User, $cookieStore, $q) {
        var currentUser = {};
        if ($cookieStore.get('token')) {
            currentUser = User.get();
        }
        return {
            logout: function() {
                $cookieStore.remove('token');
                currentUser = {};
            },
            getCurrentUser: function() {
                return currentUser;
            },
            isLoggedIn: function() {
                return $cookieStore.get('token');
            },

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            isLoggedInAsync: function(cb) {
                if (currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } else if ($cookieStore.get('token')) {
                    cb(true);
                } else {
                    cb(false);
                }
            },
        };
    });
