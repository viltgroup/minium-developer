'use strict';

angular.module('miniumdevApp')
    .controller('NavbarController', function($scope, $location, $controller,sharedModel) {

        // extends the EditorAreaController
        $controller('EditorAreaController', {
            $scope: $scope
        });

    //  $scope.active = sharedModel.active
    // $scope.updateValue = sharedModel.updateValue;

    });
