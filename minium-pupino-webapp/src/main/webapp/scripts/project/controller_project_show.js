'use strict';

pupinoApp.controller('ProjectDetailController', function($scope, resolvedProject, Project, JenkinsProvider) {
    $scope.project = resolvedProject;

    var getBuilds = function(argument) {
        var resource = JenkinsProvider.builds.query({
            "jobName": $scope.project.name
        }).$promise.then(function(data) {
            console.log(data);
            $scope.builds = data;
        });
    }

    //get all the builds
    getBuilds();

    $scope.isSuccess = function(value) {
        return value === "SUCCESS";
    }

    $scope.createBuild = function() {
        JenkinsProvider.createBuild($scope.project).success(function() {
        	getBuilds();
            toastr.success("Created");
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }


});
