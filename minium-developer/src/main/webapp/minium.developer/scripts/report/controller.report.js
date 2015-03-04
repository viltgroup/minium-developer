'use strict';

angular.module('minium.developer')
    .controller('ReportController', function($scope, $modalInstance, featureReport) {

        $scope.faillingSteps = featureReport.notPassingsteps;

        $scope.resultsSummary = featureReport.resultsSummary;

        $scope.snippetsForUndefinedSteps = featureReport.snippetsForUndefinedSteps;


        console.log($scope.resultsSummary);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.exampleData = [{
            key: "Passing",
            y: $scope.resultsSummary.passed
        }, {
            key: "Failling",
            y: $scope.resultsSummary.failures,
        }, {
            key: "Skipped",
            y: $scope.resultsSummary.skipped
        }, {
            key: "Undefined",
            y: 0
        }];


        //REFACTOR
        var colorArray = ['green', 'red', '#f39c12'];
        $scope.colorFunction = function() {
            return function(d, i) {
                return colorArray[i];
            };
        }


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

        $scope.yAxisFormatFunction = function() {
            return function(d) {
                return d3.format('%')(d);
            }
        }
    });
