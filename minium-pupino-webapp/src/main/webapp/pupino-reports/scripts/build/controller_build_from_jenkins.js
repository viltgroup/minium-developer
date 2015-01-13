'use strict';

pupinoReports.controller('BuildJenkinsController', function($scope, $stateParams, $state, resolvedProject, resolvedBuild, JenkinsProvider1) {
    $scope.project = resolvedProject;

    $scope.buildId = $stateParams.buildId;
    $scope.builds = resolvedBuild;

    $scope.features = [];

    $scope.faillingFeatures = [];
    $scope.passingFeatures = [];
    $state.go('.features');

    var getBuild = function() {
        var build = $scope.builds;
        console.debug(build)
        $scope.features = build.features;
        // console.log(JSON.stringify(data));
        extractSummary();
        //console.log($scope.faillingFeatures);
        toastr.success("Created");
        processData();
    }

    var extractSummary = function() {
        $scope.scenarios = {
            total: 0,
            passed: 0,
            failed: 0,
        }

        $scope.steps = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            undefined: 0
        }

        angular.forEach($scope.features, function(elem) {
            this.passed += elem.numberOfScenariosPassed;
            this.failed += elem.numberOfScenariosFailed;
            this.total += elem.numberOfScenarios;

            $scope.steps.total += elem.numberOfSteps;
            $scope.steps.passed += elem.numberOfPasses;
            $scope.steps.failed += elem.numberOfFailures;
            $scope.steps.skipped += elem.numberOfSkipped;
            $scope.steps.undefined += elem.numberOfUndefined;

            if (elem.status === "FAILED")
                $scope.faillingFeatures.push(elem);
            else
                $scope.passingFeatures.push(elem);

        }, $scope.scenarios);
    }


    $scope.calcPerCent = function(value, total) {
        return (100 * value / total).toFixed(2);
    }

    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }


    var colorArray = ['green', 'red', '#f39c12','#3c8dbc'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    var processData = function() {
        var p = $scope.passingFeatures.length;
        var f = $scope.faillingFeatures.length;
        $scope.pieChart = [{
            key: "Passing",
            y: p
        }, {
            key: "Failling",
            y: f
        }, {
            key: "Skipped",
            y: 0
        }];

        $scope.stepsChart = [{
            key: "Passing",
            y: $scope.steps.passed,
        }, {
            key: "Failling",
            y: $scope.steps.failed,
        }, {
            key: "Skipped",
            y: $scope.steps.skipped
        },{
            key: "Undefined",
            y: $scope.steps.undefined
        }];

        console.debug($scope.steps)
        console.debug($scope.scenarios)

        $scope.scenariosChart = [{
            key: "Passing",
            y: $scope.scenarios.passed,
        }, {
            key: "Failling",
            y: $scope.scenarios.failed,
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

    getBuild();
});
