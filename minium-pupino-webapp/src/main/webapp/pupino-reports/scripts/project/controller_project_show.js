'use strict';

pupinoReports.controller('ProjectDetailController', function($scope, $state, resolvedProject, Project, JenkinsProvider, BuildsFacade) {
    
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
            //check if has builds
            if( isEmptyObject(data)){
                return;
            }

            var buildsFacade = new BuildsFacade(data);
            $scope.builds = buildsFacade.builds;

            $scope.lastFinishedBuild = buildsFacade.lastBuild;

            $scope.features = buildsFacade.features;

            //get some stats
            buildsFacade.processReport($scope.summary, $scope.faillingFeatures, $scope.passingFeatures);
            // var summary = buildsFacade.getSummary();
            // buildSuccess = summary.passingScenarios;
            //buildFailling = summary.faillingScenarios;
            console.log(buildsFacade);
            

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
            toastr.success("Created");
            getBuilds();
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

    var processData = function() {
        $scope.exampleData = [{
                "key": "Sucess",
                "values": buildSuccess,
            }, {
                "key": "Failling",
                "values": buildFailling
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
            return d.y;
        };
    }

    $scope.yAxisTickFormat = function() {
        return function(d) {
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


    var  isEmptyObject = function(obj) {

       if (obj.length && obj.length > 0)
           return false;          

       if (obj.length === 0)
          return true;           
    }  

});
