'use strict';
/*
Factory to register backends
 */
miniumDeveloper.factory('backendFactory', function($http) {
    return {
        register: function(params) {
            return $http.post("/app/rest/backends/register", params);
        }
    };
})



miniumDeveloper.service('SessionID', function($http, $q) {
    return {
        sessionId: function() {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.get('app/rest/sessionId')
                .then(function(response) {
                    return response.data;
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    };
});