'use strict';

pupinoReports.controller('DashboardController', function($scope, resolvedProject, resolvedBuild, Project, JenkinsProvider) {

    $scope.projects = resolvedProject;
    $scope.builds = resolvedBuild;

    console.log($scope.builds)


    /**
     * AUX functions
     */
    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }

    $scope.calcPerCent = function(value, total){
        return (100*value/total).toFixed(2) ;
    }
});
