angular.module('oauth', ['ngRoute', 'ngResource'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/login'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'authCtrl'
            })
            .when('/repos', {
                templateUrl: 'views/repos.html'
            })
            .when('/repo/:repoName', {
                templateUrl: 'views/repodetail.html'
            })
            .when('/repo/:repoName/:issueNumber', {
                templateUrl: 'views/issue.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    })
    .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                return config;
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
    .factory('User', function($resource) {
        return $resource('/api/users/:id/:controller', {
            id: '@_id'
        }, {
            get: {
                method: 'GET'
            }
        });
    })
    .controller('navCtrl', ['$scope','$window',function($scope,$window) {
        $scope.getCurrentUser = function(){
            return 'tester';
        };
        $scope.logOut = function(){
            $window.location.href = '/auth/logout';
        }
    }])
    .controller('authCtrl', ['$scope', '$window', function($scope, $window) {
        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/github';
        };
    }]);
// .run(function($rootScope, $location, Auth) {
//     // Redirect to login if route requires auth and you're not logged in
//     $rootScope.$on('$routeChangeStart', function(event, next) {
//         Auth.isLoggedInAsync(function(loggedIn) {
//             if (next.authenticate && !loggedIn) {
//                 $location.path('/login');
//             }
//         });
//     });
// });
