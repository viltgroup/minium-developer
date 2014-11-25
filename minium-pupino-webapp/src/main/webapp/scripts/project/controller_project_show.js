'use strict';

pupinoApp.controller('ProjectDetailController', function($scope, resolvedProject, Project, JenkinsProvider) {
    $scope.project = resolvedProject;

    $scope.report;
    $scope.features = [];
    var getBuilds = function(argument) {
        var resource = JenkinsProvider.builds.query({
            "jobName": $scope.project.name
        }).$promise.then(function(data) {
            console.log(data);
            $scope.builds = data;
            //get the report of the last build
            $scope.report = JSON.parse($scope.builds[0].resultJSON);

            $scope.features = eval($scope.builds[0].features);
            console.log($scope.features);
            
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

    $scope.options = [{
        name: 'None (run once)',
        value: 'none'
    }, {
        name: 'Hourly',
        value: 'hourly'
    }, {
        name: 'Daily',
        value: 'daily'
    }, {
        name: 'Weekdays',
        value: 'weekdays'
    }, {
        name: 'Weekly',
        value: 'weekly'
    }, {
        name: 'Monthly',
        value: 'monthly'
    }];

    $scope.repeatInterval = $scope.options[0];
    $scope.setValue = function(option) {
        $scope.repeatInterval.name = option.name;
        $scope.repeatInterval.value = option.value;
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
