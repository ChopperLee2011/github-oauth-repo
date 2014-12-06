'use strict';
angular.module('oauth')
    .factory('reposFactory', function($resource) {

        return $resource('/api/repos/:repo/:repoName/:issueNum', {}, {
            get: {
                method: 'GET'
            }
        });
    });
