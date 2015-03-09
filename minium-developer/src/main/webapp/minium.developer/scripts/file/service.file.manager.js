'use strict';
/**
 * Operations over the file system
 *
 */
miniumDeveloper.factory('FileManager', function($resource, $http) {
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