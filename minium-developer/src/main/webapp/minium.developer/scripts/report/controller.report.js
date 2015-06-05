'use strict';

angular.module('minium.developer')
    .controller('ReportController', function($scope, $modalInstance, featureReport) {

        $scope.failingSteps = featureReport.notPassingsteps;

        $scope.resultsSummary = featureReport.resultsSummary;

        $scope.snippetsForUndefinedSteps = featureReport.snippetsForUndefinedSteps;

        console.log($scope.failingSteps);

        $scope.isPassing = function(){
            return $scope.resultsSummary.runCount === $scope.resultsSummary.passed;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
