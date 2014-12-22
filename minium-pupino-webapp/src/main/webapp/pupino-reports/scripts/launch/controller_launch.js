'use strict';

var LaunchController = function($scope, $modalInstance) {
    $scope.browsers = {
        "firefox": false,
        "chrome": true,
        "IE": false,
        "opera": false

    };

    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "default";

    $scope.ok = function() {
        $scope.$close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };
};
