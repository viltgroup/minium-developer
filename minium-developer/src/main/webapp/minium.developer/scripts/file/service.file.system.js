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
        listAll: {
            method: 'GET',
            params: {
                action: "listAll"
            },
            isArray: true
        },
        search: {
            method: 'GET',
            params: {
                action: "search"
            },
            isArray: true
        },
        searchContent: {
            method: 'GET',
            params: {
                action: "searchContent"
            },
            isArray: true
        }
    });
})

