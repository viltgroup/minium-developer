'use strict';

var LaunchController = function($scope, $modalInstance, $state, $stateParams, launcherService) {

    alert($stateParams.results);
    
    launcherService.launch($scope.launchParams)
        .success(function(data) {
            var steps = jsonPath.eval(data, "$..steps[@.result.status=='passed']");
            editor.getSession().setAnnotations(_(steps).map(function(step) {
                return {
                    row: step.line,
                    text: "You have a problem here.",
                    type: "error"
                };
            }));
        });
};
