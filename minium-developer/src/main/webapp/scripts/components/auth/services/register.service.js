'use strict';

angular.module('miniumdevApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


