'use strict';

angular.module('minium.developer')
    .controller('AboutController', function($scope, $modalInstance, ProjectFactory, ProjectService, GENERAL_CONFIG) {

        $scope.version = "1.0.0";

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };
    });
