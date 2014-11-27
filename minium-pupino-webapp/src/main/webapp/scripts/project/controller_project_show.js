'use strict';

pupinoApp.controller('ProjectDetailController', function($scope, resolvedProject, Project, JenkinsProvider) {
    $scope.project = resolvedProject;

    $scope.report;
    $scope.features = [];
    $scope.buildId;

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
            console.log($scope.buildId);

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
