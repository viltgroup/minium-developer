'use strict';

var LaunchController = function($scope, $modalInstance, $stateParams, $injector, JenkinsProvider1, resolvedProject, buildsTest,BuildProject,BuildsFacade) {


    $scope.browsers = {
        "firefox": false,
        "chrome": true,
        "IE": false,
        "opera": false

    };

    $scope.buildsFacade;

    $scope.$watch(function() {
        return $scope.buildsFacade;
    }, function(newValue) {
        if (newValue) $scope.buildsFacade = newValue;
    });

     var getBuilds = function() {
        BuildProject.findByProject(resolvedProject).success(function(data) {
            //check if has builds
            if (isEmptyObject(data)) {
                return;
            }
            $scope.buildsFacade = new BuildsFacade(data);
            //get some stats
            //buildsFacade.processReport($scope.summary, $scope.faillingFeatures, $scope.passingFeatures);
            // var summary = buildsFacade.getSummary();
            // buildSuccess = summary.passingScenarios;
            //buildFailling = summary.faillingScenarios;
            console.log($scope.buildsFacade);

        }).error(function(serverResponse) {
            console.log(serverResponse);
        });

    }

    $scope.launchBuild = function() {
        JenkinsProvider1.createBuild(resolvedProject, $scope.browsers).success(function() {
            toastr.success("Test Execution has been launched");
            $scope.builds;
            getBuilds();
            $scope.$close(true);
            // getBuilds();
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };

    var isEmptyObject = function(obj) {

        if (obj.length && obj.length > 0)
            return false;

        if (obj.length === 0)
            return true;
    }

};
