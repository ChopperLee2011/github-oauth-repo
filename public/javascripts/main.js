'use strict';

angular.module('oauth', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize'])
    .config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/repos'
            })
            .when('/repos', {
                templateUrl: 'views/repos.html'
            })
            .when('/repos/repo/:repoName', {
                templateUrl: 'views/repodetail.html'
            })
            .when('/repos/repo/:repoName/:issueNum', {
                templateUrl: 'views/issue.html'
            })
            .otherwise({
                redirectTo: '/login'
            });
        // $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                $rootScope.$broadcast('loading');
                return config || $q.when(config);
            },
            'response': function(config) {
                $rootScope.$broadcast('complete');
                return config || $q.when(config);
            },
            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    })
    .directive('loadingIndicator', [function() {
        return {
            restrict: 'A',
            templateUrl: "views/loading.html",
            link: function(scope, iElement, iAttrs) {
                scope.$on("loading", function(e) {
                    iElement.css({
                        "display": "block"
                    });
                });

                scope.$on("complete", function(e) {
                    iElement.css({
                        "display": "none"
                    });
                });
            }
        };
    }])
    .run(function($rootScope, $window, Auth) {
        // Redirect to login you're not logged in
        $rootScope.$on('$routeChangeStart', function(event) {
            Auth.isLoggedInAsync(function(loggedIn) {
                if (!loggedIn) {
                    $window.location.href = '/login';
                }
            });
        });
    });
