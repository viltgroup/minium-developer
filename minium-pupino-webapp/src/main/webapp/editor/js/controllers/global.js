'use strict';

var GlobalController = function($scope, $modal, $http, $log, $location, $timeout, FS, FormatService) {

    $scope.openFile = function(type) {
        $modal.open({
            templateUrl: "partials/modal/open.file.html",
            controller: "OpenFileController"
        });
    };

    $scope.exampleData = [{
        key: "X",
        y: 0
    }, {
        key: "Y",
        y: 0
    }, {
        key: "Skipped",
        y: 2
    }, {
        key: "X",
        y: 0
    }, {
        key: "Passing",
        y: 9
    }, {
        key: "X",
        y: 0
    }, {
        key: "Failling",
        y: 4
    }];

    $scope.xFunction = function() {
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function() {
        return function(d) {
            return d.y;
        };
    }
};
