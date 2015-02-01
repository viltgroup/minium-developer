'use strict';

var PreferencesController = function($scope, $cookieStore, $modalInstance,GENERAL_CONFIG,THEMES,MiniumEditor) {

    $scope.themes = THEMES;
    //MODAL PREFERENCES

    $scope.model = angular.copy(MiniumEditor.getSettings());
    $scope.submit = function() {
        // copy updated values to editorPreferences
        MiniumEditor.setSettings($scope.model);

        $cookieStore.put("editorPreferences", JSON.stringify(MiniumEditor.getSettings()), {
            expires: 365 * 5
        });
        
        // close modal
        $scope.$close(true);
        
        //change for every 
        toastr.success(GENERAL_CONFIG.SUCCESS_MSG.PREFERENCES)
        
    };

    $scope.reset = function(){
        MiniumEditor.resetSetting();
        $scope.$close(true);
        toastr.success(GENERAL_CONFIG.SUCCESS_MSG.PREFERENCES)
    }

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };


};
