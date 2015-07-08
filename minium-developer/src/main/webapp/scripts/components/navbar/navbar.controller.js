'use strict';


var NavbarController = function($rootScope, $scope, $translate, $filter, $location, $controller, VersionService) {

    var $translate = $filter('translate');
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

    /**
     * Check for a new version of minium
     */
    var checkForNewVersion = function() {
        VersionService.checkForNewVersion().then(function(response) {
            console.log(response.data)
            if (response.data === false) {
                toastr.info($translate('global.messages.version.new'), $translate('global.messages.version.new.title'));
            }
        });
    }

    checkForNewVersion();
};


NavbarController.$inject = ['$rootScope', '$scope', '$translate', '$filter', '$location', '$controller', 'VersionService'];

angular.module('miniumdevApp').controller('NavbarController', NavbarController);
