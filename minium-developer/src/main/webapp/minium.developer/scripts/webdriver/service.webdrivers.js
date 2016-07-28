'use strict';

miniumDeveloper.factory('WebDriverFactory', function($http) {
    return {
        create: function(config, withRecorder) {
            return $http.post("/app/rest/webdrivers/create" + (withRecorder ? "?withRecorder=true" : ""), config);
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
        getAvailableWebdrivers: function(){
            return $http.get("/app/rest/webdrivers/getAvailableWebdrivers");
        },
        isRecorderAvailableForBrowser: function(browser) {
            return $http.get("/app/rest/webdrivers/isRecorderAvailableForBrowser?browser=" + browser);
        }
    };
});
