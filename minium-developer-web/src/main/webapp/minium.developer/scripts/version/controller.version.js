(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('VersionController', VersionController);

    VersionController.$inject = ['$rootScope', '$scope', '$modalInstance', 'VersionService'];

    function VersionController($rootScope, $scope, $modalInstance, VersionService) {

        /**
         * Get Minium Developer version
         **/
        VersionService.getVersionInfo().then(function(response) {
            var version = response.data;
            $scope.version = version.version;
            $scope.commitHash = version.commitHash;
            $scope.date = version.date;
        });

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

        if ($rootScope.hasRemoteProfile) {
            $scope.hasNewVersion = false;
        } else {
            /**
             * Check for a new version of minium
             */
            $scope.hasNewVersion = true;
            var checkForNewVersion = function() {
                VersionService.checkForNewVersion().then(function(response) {
                    console.log(response.data)
                    var version = response.data;
                    if (version.hasNewVersion === false) {
                        $scope.hasNewVersion = false;
                    } else {
                        $scope.hasNewVersion = true;
                        $scope.linkForNewVersion = version.linkForNewVersion;
                    }
                });
            }

            checkForNewVersion();
        }
    }

})();
