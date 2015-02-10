'use strict';

angular.module('minium.developer')
    .controller('ReportController', function($scope, $modalInstance, featureReport) {

        $scope.faillingSteps = featureReport.notPassingsteps;

        $scope.resultsSummary = featureReport.resultsSummary;
        
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    });
