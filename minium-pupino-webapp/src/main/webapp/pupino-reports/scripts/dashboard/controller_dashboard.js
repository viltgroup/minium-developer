'use strict';

pupinoReports.controller('DashboardController', function($scope, resolvedProject, resolvedBuild, Project, JenkinsProvider) {

    $scope.projects = resolvedProject;
    $scope.builds = resolvedBuild;


    console.log($scope.builds)


    var colorArray = ['green', 'red', 'blue'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    var processData = function() {
         $scope.summary = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0
        }

        angular.forEach($scope.builds, function(elem) {
            var summary = elem.summary;

            this.passed += summary.passingScenarios;
            this.failed += summary.faillingScenarios;
            this.total += summary.totalScenarios;
            this.skipped += summary.skippedScenarios;

        }, $scope.summary);

        $scope.pieChart = [{
            key: "Passing",
            y: ($scope.summary.passed / 100)
        }, {
            key: "Failling",
            y: ($scope.summary.failed / 100)
        }];

        console.log($scope.summary)
    }
     processData();

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

    $scope.yAxisTickFormat = function() {
        return function(d) {
            return d3.format(',f');
        }
    };


    /**
     * AUX functions
     */
    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }

    $scope.calcPerCent = function(value, total) {
        return (100 * value / total).toFixed(2);
    }
});
