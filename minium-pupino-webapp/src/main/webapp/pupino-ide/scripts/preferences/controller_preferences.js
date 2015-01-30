'use strict';

var PreferencesController = function($scope, $cookieStore, $modalInstance,editors,GENERAL_CONFIG,THEMES) {

    $scope.themes = THEMES;
    //MODAL PREFERENCES
    $scope.model = angular.copy(editors.getSettings());
    $scope.submit = function() {
        // copy updated values to editorPreferences
        editors.setSettings($scope.model);


        $cookieStore.put("editorPreferences", JSON.stringify(editors.getSettings()), {
            expires: 365 * 5
        });
        
        // close modal
        $scope.$close(true);
        
        //change for every 
        toastr.success(GENERAL_CONFIG.SUCCESS_MSG.PREFERENCES)
        
    };

    $scope.reset = function(){
        editors.resetSetting();
        $scope.$close(true);
        toastr.success(GENERAL_CONFIG.SUCCESS_MSG.PREFERENCES)
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };


};
