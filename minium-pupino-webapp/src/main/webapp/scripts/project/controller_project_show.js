'use strict';

pupinoApp.controller('ProjectDetailController', function($scope, $state, resolvedProject, Project, JenkinsProvider, BuildsFacade) {


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


    var getBuilds = function(argument) {
        var resource = JenkinsProvider.builds.query({
            "jobName": $scope.project.name
        }).$promise.then(function(data) {
            console.log(data);
            var buildsFacade = new BuildsFacade(data);
            $scope.builds = buildsFacade.builds;
            //get the report of the last build finished
            var i = 0;
            while ($scope.builds[i].result === "BUILDING")
                i++;

            $scope.lastFinishedBuild = buildsFacade.lastBuild;

            $scope.features = buildsFacade.features;
            $scope.buildId = $scope.lastFinishedBuild.id;

            //get some stats
            buildsFacade.processReport($scope.summary, $scope.faillingFeatures, $scope.passingFeatures);
            var summary = buildsFacade.getSummary();
            buildSuccess = summary.passingScenarios;
            buildFailling = summary.faillingScenarios;


            console.log(JSON.stringify(buildSuccess));

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
        });
    }

    $scope.createBuild = function() {
        JenkinsProvider.createBuild($scope.project).success(function() {
            getBuilds();
            toastr.success("Created");
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    var colorArray = ['green', 'red', 'blue'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    $scope.toolTipContentFunction = function() {
        return function(key, x, y, e, graph) {
            return 'Super New Tooltip';
        }
    }

    $scope.isArea = function() {
        return function(d, i) {
            return false;
        };
    }

    var processData = function() {


        $scope.exampleData = [{
                "key": "Failling",
                "values": buildFailling
            }, {
                "key": "Sucess",
                "values": buildSuccess,
            }

        ];

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
            console.log(d.y)
            return d3.format(',f')(d.y);
        };
    }

    $scope.yAxisTickFormat = function() {
        return function(d){
            return d3.format(',f');
        }
    };

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
});
