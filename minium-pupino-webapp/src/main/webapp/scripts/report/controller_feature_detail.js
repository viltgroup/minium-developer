'use strict';

var FeatureController = function($scope, $stateParams, resolvedProject, Project, JenkinsProvider) {

    $scope.project = resolvedProject;
    var buildId = $stateParams.buildId;
    var featureURI = $stateParams.featureURI;

    var getFeatureDetails = function() {
        var resource = JenkinsProvider.getFeatureBuild(
            $scope.project,
            buildId,
            featureURI
        ).success(function(data) {
            console.log(data);
            $scope.build = data;
            $scope.feature = data.features[0];
            console.log($scope.feature);
            toastr.success("Created");
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    getFeatureDetails();

    $scope.isPassed = function(value) {
        return value === "PASSED";
    }
};
