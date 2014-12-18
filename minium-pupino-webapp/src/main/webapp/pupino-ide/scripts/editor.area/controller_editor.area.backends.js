'use strict';

var BackendsController = function($scope, $modalInstance, backendFactory) {

    $scope.register = function() {
        var backendPath = $scope.backendPath;
        backendFactory.register(backendPath).success(function(data) {
            toastr.success("Backend registed with success")
             $scope.$close(true);
        }).error(function(data){
            toastr.error("Error. Can't register the backend")
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };

};
