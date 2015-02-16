'use strict';

miniumDeveloper.factory('WebDriverFactory', function($http) {
    return {
        create: function(varName, type) {
            return $http.post("/app/rest/webDrivers/" + varName + "/create", {
                type: type
            });
        },
        quit: function(varName) {
            return $http.post("/app/rest/webDrivers/" + varName + "/quit")
        },
        isCreated: function(){
            return $http.get("/app/rest/webDrivers/is_launched")
        }
    };
});

miniumDeveloper.factory('RemoteWebDriverFactory', function($http) {
    return {
        create: function(type, url) {
            return $http.post("/app/rest/webDrivers/" + varName + "/create", {
                type: type,
                remoteUrl: url
            })
        }
    };
});
