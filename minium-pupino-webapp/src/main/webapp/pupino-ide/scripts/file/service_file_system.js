'use strict';

pupinoIDE.factory('FS', function($resource) {
    return $resource("/app/rest/fs", {
        path: "/"
    }, {
        list: {
            method: 'GET',
            params: {
                action: "list"
            },
            isArray: true
        },
        search: {   
            method: 'GET',
            params: {
                action: "search"
            },
            isArray: true
        }
    });
})

pupinoIDE.factory('FileFactory', function($resource, $http) {
    return {
        create: function(path) {
            return $http.post('/app/rest/fs/new',path );
        },
    };
});