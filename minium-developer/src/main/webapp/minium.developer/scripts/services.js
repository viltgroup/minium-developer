'use strict';

miniumDeveloper.factory('launcherService', function($http) {
    return {
        launch: function(params) {
            return $http.post("/app/rest/launch", params);
        },
        dotcucumber: function() {
            return $http.get("/app/rest/dry-run", {
                params: {
                    dotcucumber: true
                }
            });
        },
        autocomplete: function(autocompleteReq) {
            return $http.post("/app/rest/autocomplete", autocompleteReq);
        },
        stop: function() {
            return $http.post("/app/rest/stop", {});
        },
        isRunning: function() {
            return $http.get("/app/rest/isRunning");
        },
        stepDefinitions: function() {
            return $http.get("/app/rest/stepDefinitions");
        }
    };
})





miniumDeveloper.factory('ReportService', function($resource) {
    return $resource('mocks/result.json', {}, {
        getData: {
            method: 'GET',
            isArray: false
        }
    });
})
miniumDeveloper.factory('SelectorGadgetService', function($http) {
    return {
        activate: function() {
            return $http.post("/app/rest/js/selectorGadget/activate");
        },
        deactivate: function() {
            return $http.post("/app/rest/js/selectorGadget/deactivate");
        },
        cssSelector: function() {
            return $http.post("/app/rest/js/selectorGadget/cssSelector");
        }
    };
})
miniumDeveloper.factory('EvalService', function($http) {
    return {
        eval: function(params) {
            return $http({
                method: "POST",
                url: '/app/rest/js/eval',
                data: params ? $.param(params) : '',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        },
        clean: function() {
            return $http({
                method: "POST",
                url: '/app/rest/js/clean'
            });
        }
    };
})



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