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
