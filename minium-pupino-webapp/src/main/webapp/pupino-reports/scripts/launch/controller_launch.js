'use strict';

var LaunchController = function($scope, $modalInstance, $stateParams, $injector, JenkinsProvider1, resolvedProject) {

    $scope.browsers = {
        "firefox": false,
        "chrome": true,
        "IE": false,
        "opera": false

    };

    $scope.launchBuild = function() {
        JenkinsProvider1.createBuild(resolvedProject, $scope.browsers).success(function() {
            toastr.success("Test Execution has been launched");
            // getBuilds();
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    $scope.ok = function() {
        $scope.$close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };

};
