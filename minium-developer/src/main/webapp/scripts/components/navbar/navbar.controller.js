'use strict';

angular.module('miniumdevApp')
    .controller('NavbarController', function($rootScope,$scope, $location, $controller, sharedModel, myService) {

        // extends the EditorAreaController
        $controller('EditorAreaController', {
            $scope: $scope
        });
    });
