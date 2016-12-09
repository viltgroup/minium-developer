'use strict';

var BackendsController = function($scope, $translate, $filter, $modalInstance, backendFactory) {
    var $translate = $filter('translate');

    $scope.register = function() {
        var backendPath = $scope.backendPath;
        backendFactory.register(backendPath).success(function(data) {
            toastr.success($translate('messages.backend.success'))
            $scope.$close(true);
        }).error(function(data) {
            toastr.error($translate('messages.backend.error'))
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };

};
