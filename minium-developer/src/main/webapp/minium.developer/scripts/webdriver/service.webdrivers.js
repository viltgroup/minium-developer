'use strict';

miniumDeveloper.factory('WebDriverFactory', function($http) {
    return {
        create: function(config) {
            return $http.post("/app/rest/webdrivers/create", { config: config });
        },
        quit: function() {
            return $http.post("/app/rest/webdrivers/quit");
        },
        isCreated: function(){
            return $http.get("/app/rest/webdrivers/isLaunched");
        }
    };
});

