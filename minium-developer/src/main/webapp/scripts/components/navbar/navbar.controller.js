'use strict';

angular.module('miniumdevApp')
    .controller('NavbarController', function($rootScope, $scope, $location, $controller, GENERAL_CONFIG) {

        // extends the EditorAreaController
        $controller('EditorAreaController', {
            $scope: $scope
        });

        /**
         * Clear marker in lines of editor
         *
         */
        $scope.clearMarkers = function() {
            $scope.active.session.getSession().clearBreakpoints();
            $scope.active.session.getSession().setAnnotations([]);
        }
    });
