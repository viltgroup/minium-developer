'use strict';

pupinoReports.factory('Build', function($resource) {
    return $resource('app/rest/builds/:id', {}, {
        'query': {
            method: 'GET',
            isArray: true
        },
        'get': {
            method: 'GET'
        }
    });
});


pupinoReports.factory('BuildProject', function($http) {
    return {
        findByProject: function(project) {
            return $http.post('/app/rest/builds/project', project);
        },
        findByFeature: function(buildId, featureURI) {
            return $http.get('/app/rest/builds/project/' + buildId + '/' + featureURI , {});
        },
        findLastBuild: function(project) {
           return $http.post('/app/rest/builds/lastBuild', project);
        }
    }
});


