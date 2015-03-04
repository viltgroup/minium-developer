'use strict';

miniumDeveloper.factory('FS', function($resource) {
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

miniumDeveloper.factory('FileFactory', function($resource, $http) {
    return {
        create: function(path) {
            return $http.post('/app/rest/fs/new', path);
        },
        createFolder: function(path) {
            return $http.post('/app/rest/fs/new/folder', path);
        },
        rename: function(object) {
            return $http.post('/app/rest/fs/rename', JSON.stringify(object));
        },
        delete: function(path) {
            return $http.put('/app/rest/fs/delete', path);
        },
        deleteDirectory: function(path) {
            return $http.put('/app/rest/fs/delete/directory', path);
        }
    };
});
