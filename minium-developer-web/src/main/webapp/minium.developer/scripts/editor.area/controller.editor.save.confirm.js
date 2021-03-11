'use strict';
angular.module('minium.developer').controller('EditorSaveConfirmCtrl', function($rootScope, $scope, $modalInstance, $cookieStore) {
    $scope.rememberCheck = false;

    $scope.save = function() {
        if ($scope.rememberCheck) {
            var saveProjectConfirmChecked = $cookieStore.get('saveProjectConfirmChecked');
            var saveProjectConfirmCheckedArray = saveProjectConfirmChecked ?
                saveProjectConfirmChecked.split(',') : [];

            if (saveProjectConfirmCheckedArray.indexOf($rootScope.projectName) === -1){
                saveProjectConfirmCheckedArray.push($rootScope.projectName);
            }

            $cookieStore.put('saveProjectConfirmChecked', saveProjectConfirmCheckedArray.join(','));
        }

        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
