'use strict';

pupinoReports.controller('BuildController', function($scope, resolvedBuild, Build, resolvedProject) {

    $scope.builds = resolvedBuild;
    $scope.projects = resolvedProject;

    $scope.features = [];

    $scope.faillingFeatures = [];
    $scope.passingFeatures = [];

    console.debug($scope.builds)


    $scope.features = $scope.builds.features;

     
    var extractSummary = function() {
        $scope.summary = {
            totalScenarios: 0,
            passed: 0,
            failed: 0
        }

        angular.forEach($scope.features, function(elem) {
            this.passed += elem.numberOfScenariosPassed;
            this.failed += elem.numberOfScenariosFailed;
            this.totalScenarios += elem.numberOfScenarios;
            if (elem.status === "FAILED")
                $scope.faillingFeatures.push(elem);
            else
                $scope.passingFeatures.push(elem);

        }, $scope.summary);
    };
    var x;

    
    extractSummary();


    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }
});
