'use strict';

var ReportController = function($scope, ReportService) {

    ReportService.get(function(data) {
        var steps = jsonPath.eval(data, "$..elements");
        // steps.remove(0);
        $scope.steps = steps;
        console.log($scope.steps);
    });


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
