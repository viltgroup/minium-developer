'use strict';

pupinoApp.factory('Project', function ($resource) {
        return $resource('app/rest/projects/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': { method: 'GET'}
        });
    });
