'use strict';

var NavbarController = function($rootScope, $scope, $translate, $filter, $location, $controller, VersionService, WebDriverFactory) {

    var $translate = $filter('translate');
    // // extends the EditorAreaController
    // $controller('EditorAreaController', {
    //     $scope: $scope
    // });

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
            var version = response.data;
            if (version.hasNewVersion === true) {
                toastr.info('<div>&nbsp;<a class="btn btn-default btn-xs" href="' + version.linkForNewVersion + '" target="_blank">' + $translate('global.messages.version.new') + '</a></div>', $translate('global.messages.version.new.title'));
            }
        });
    }

    var getAvailableWebdrivers = function() {
        WebDriverFactory.getAvailableWebdrivers().then(function(response) {
            console.log(response.data);
            $rootScope.availableWebDrivers = response.data;
        })
    }

    /////////////////////////////////////////////////////////////////
    // Initializations
    /////////////////////////////////////////////////////////////////
    checkForNewVersion();
    getAvailableWebdrivers();
};

NavbarController.$inject = ['$rootScope', '$scope', '$translate', '$filter', '$location', '$controller', 'VersionService', 'WebDriverFactory'];

angular.module('miniumdevApp').controller('NavbarController', NavbarController);
