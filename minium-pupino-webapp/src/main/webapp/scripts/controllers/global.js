'use strict';

var GlobalController = function($scope, $modal, $http, $state, $log, $location, $timeout, FS, FormatService) {

    $scope.$state = $state;

    $scope.openFile = function(type) {
        $modal.open({
            templateUrl: "partials/modal/open.file.html",
            controller: "OpenFileController"
        });
    };

    $scope.search = function() {
        var searchQuery = $scope.form.searchQuery;
        $scope.results = FS.search({
            q: searchQuery
        });
    };

    $scope.location = "http://localhost:8080/#";

    /**
     * collapse folders
     * @return {[type]} [description]
     */
    $scope.collapseAll = function() {
        $scope.expandedNodes = [];
    };

    
    $scope.readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

};
