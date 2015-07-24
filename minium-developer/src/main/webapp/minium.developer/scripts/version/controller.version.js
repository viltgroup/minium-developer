(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('VersionController', VersionController);

    VersionController.$inject = ['$scope', '$modalInstance', 'VersionService'];

    function VersionController($scope, $modalInstance, VersionService) {

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
    }

})();
