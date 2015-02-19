'use strict';

angular.module('minium.developer')
    .controller('ExecutionController', function($scope, $modalInstance) {

        //image to take screenshots
        $scope.image = {};
        
        $scope.takeScreenShot = function(argument) {
            $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    });
