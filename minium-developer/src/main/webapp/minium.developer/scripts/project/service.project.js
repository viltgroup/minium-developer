'use strict';

miniumDeveloper.factory('ProjectFactory', function($http) {
    return {
        create: function(project) {
            return $http.post("/app/rest/project/new", project);
        },
        open: function(path) {
            return $http.post("/app/rest/project/import", path);
        },
        isValid: function(path) {
            return $http.post("/app/rest/project/valid", path);
        },
        hasProject: function() {
            return $http.get("/app/rest/project/hasProject");
        },
        getProjects: function() {
            return $http.get("/app/rest/project/");
        }
    };
});


// this service load and store open tabs from cookies
miniumDeveloper.service('ProjectService', function(ProjectFactory) {

    this.open = function(path) {
        ProjectFactory.open(path).success(function(data) {
            $.removeCookie('openTabs'); // remove the tab with the open tabs
            $window.location.reload();
        }).error(function(data, status) {
            console.error('Repos error', status, data);
        });
    };


});
