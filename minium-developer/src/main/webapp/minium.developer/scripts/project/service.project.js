'use strict';

miniumDeveloper.factory('ProjectFactory', function($http) {
    return {
        create: function(project) {
            return $http.post("/app/rest/project/new", project);
        },
        import: function(path) {
            return $http.post("/app/rest/project/import",path);
        },
        isValid: function(path){
            return $http.post("/app/rest/project/valid",path);
        },
        hasProject : function() {
            return $http.get("/app/rest/project/hasProject");
        }
    };
});

