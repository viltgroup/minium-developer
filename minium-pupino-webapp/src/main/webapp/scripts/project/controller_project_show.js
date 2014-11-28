'use strict';

pupinoApp.controller('ProjectDetailController', function($scope, resolvedProject, Project, JenkinsProvider) {
    $scope.project = resolvedProject;

    $scope.report;
    $scope.features = [];
    $scope.buildId;

    $scope.faillingFeatures = [];
    
    var getBuilds = function(argument) {
        var resource = JenkinsProvider.builds.query({
            "jobName": $scope.project.name
        }).$promise.then(function(data) {
            console.log(data);
            $scope.builds = data;
            //get the report of the last build finished
            var i = 0;
            while ($scope.builds[i].result === "BUILDING")
                i++;

            $scope.report = eval($scope.builds[i].resultJSON);
            $scope.features = eval($scope.builds[i].features);
            $scope.buildId = $scope.builds[i].id;
            console.log(data);

            
            extractSummary();
            processData();
        });
    }

    var extractSummary = function() {
        $scope.summary = {
            totalScenarios : 0,
            passed : 0,
            failed : 0
        }

        angular.forEach($scope.features, function(elem) {
            this.passed += elem.numberOfScenariosPassed;
            this.failed += elem.numberOfScenariosFailed;
            this.totalScenarios += elem.numberOfScenarios;
            if( elem.status === "FAILED")
                $scope.faillingFeatures.push(elem)
        }, $scope.summary);
    }

    $scope.createBuild = function() {
        JenkinsProvider.createBuild($scope.project).success(function() {
            getBuilds();
            toastr.success("Created");
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    var processData = function() {
        $scope.exampleData = [{
            key: "X",
            y: 0
        }, {
            key: "Y",
            y: 0
        }, {
            key: "Skipped",
            y: 0
        }, {
            key: "X",
            y: 0
        }, {
            key: "Passing",
            y: $scope.summary.passed
        }, {
            key: "X",
            y: 0
        }, {
            key: "Failling",
            y: $scope.summary.failed
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
