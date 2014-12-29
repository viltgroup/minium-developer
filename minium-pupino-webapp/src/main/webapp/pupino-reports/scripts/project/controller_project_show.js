'use strict';

pupinoReports.controller('ProjectDetailController', function($scope, $state, resolvedProject, Project, JenkinsProvider, BuildsFacade, BuildProject, buildsTest) {
    //init variables
    $scope.project = resolvedProject;
    $scope.features = [];
    $scope.buildId;

    $scope.faillingFeatures = [];
    $scope.passingFeatures = [];

    $scope.summary = {
        totalScenarios: 0,
        passed: 0,
        failed: 0
    }

    $state.go('.overview');

    var buildSuccess, buildFailling;

    $scope.buildsFacade;

    $scope.$on('trackLoaded', function(event, track) {
        $scope.buildsFacade = track;
        console.log($scope.buildsFacade);
    });

    var getBuilds = function() {
        BuildProject.findByProject($scope.project).success(function(data) {
            //check if has builds
            if (isEmptyObject(data)) {
                return;
            }
            $scope.buildsFacade = new BuildsFacade(data);

            console.log( $scope.buildsFacade);

            //get some stats
             $scope.buildsFacade.processReport($scope.summary, $scope.faillingFeatures, $scope.passingFeatures);
            // var summary = buildsFacade.getSummary();
            // buildSuccess = summary.passingScenarios;
            //buildFailling = summary.faillingScenarios;
            

            buildSuccess = [
                [1, 100],
                [2, 200],
                [3, 59],
                [4, 569]

            ];

            buildFailling = [
                [1, 169],
                [2, 269],
                [3, 609],
                [4, 0]
            ];
            processData();

        }).error(function(serverResponse) {
            console.log(serverResponse);
        });

    }



    var colorArray = ['green', 'red', 'blue'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    var processData = function() {
        $scope.exampleData = [{
            "key": "Sucess",
            "values": buildSuccess,
        }, {
            "key": "Failling",
            "values": buildFailling
        }];

        $scope.exampleData1 = [{
            key: "Passing",
            y: ($scope.summary.passed / 100)
        }, {
            key: "Failling",
            y: ($scope.summary.failed / 100)
        }, {
            key: "Skipped",
            y: 0
        }];
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

    /*
        Initializations
     */

    //get all the builds
    getBuilds();


    /**
     * AUX functions
     */
    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }


    var isEmptyObject = function(obj) {

        if (obj.length && obj.length > 0)
            return false;

        if (obj.length === 0)
            return true;
    }

    $scope.calcPerCent = function(value, total) {
        return (100 * value / total).toFixed(2);
    }

});
