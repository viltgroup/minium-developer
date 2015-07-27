'use strict';

miniumDeveloper.factory('WebDriverFactory', function($http) {
    return {
        create: function(config) {
            return $http.post("/app/rest/webdrivers/create", config);
        },
        quit: function() {
            return $http.post("/app/rest/webdrivers/quit");
        },
        isCreated: function(){
            return $http.get("/app/rest/webdrivers/isLaunched");
        },
        downloadAll: function(){
            return $http.get("/app/rest/webdrivers/download/all");
        },
        updateAll: function(){
            return $http.get("/app/rest/webdrivers/update/all");
        },
        getOS: function(){
            return $http.get("/app/rest/webdrivers/getOS");
        }
    };
});

