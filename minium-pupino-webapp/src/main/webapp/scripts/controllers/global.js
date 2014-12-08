'use strict';

var GlobalController = function($scope, $modal, $http, $log, $location, $timeout, FS, FormatService) {

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
};
