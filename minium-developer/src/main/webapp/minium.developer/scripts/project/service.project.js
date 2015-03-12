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
        isValidName: function(path) {
            return $http.post("/app/rest/project/valid/name", path);
        },
        hasProject: function() {
            return $http.get("/app/rest/project/hasProject");
        },
        getProjects: function() {
            return $http.get("/app/rest/project/");
        },
        getProjectName: function() {
            return $http.get("/app/rest/project/name");
        }
    };
});


// this service load and store open tabs from cookies
miniumDeveloper.service('ProjectService', function(ProjectFactory, $window, $location, $cookieStore) {

    var reload = function(path) {
        $.removeCookie('openTabs'); // remove the tab with the open tabs
        $cookieStore.put('project', path)
        $window.location.reload();
    };

    this.open = function(path) {
        ProjectFactory.open(path).success(function(data) {
            reload(path);
        }).error(function(data, status) {
            $cookieStore.remove('project')
            toastr.error(data)
        });
    };

    this.reload = function(path) {
        reload(path);
    };


});
