'use strict';

angular.module('minium.developer')
    .controller('ReportController', function($scope, $modalInstance, featureReport) {

        $scope.faillingSteps = featureReport.notPassingsteps;

        $scope.resultsSummary = featureReport.resultsSummary;

        $scope.snippetsForUndefinedSteps = [];

        
        featureReport.snippetsForUndefinedSteps.forEach(function(snippet) {
           $scope.snippetsForUndefinedSteps.push(snippet);
        });

        console.log(featureReport);
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.isPassed = function(status) {

        }



    });
