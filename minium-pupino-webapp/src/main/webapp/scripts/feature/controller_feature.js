'use strict';

pupinoApp.controller('FeatureController', function($scope, $stateParams, $sce, $state, resolvedProject, Project, JenkinsProvider, BuildFacade) {

    $state.go('global.feature.scenarios');
    $scope.project = resolvedProject;
    var buildId = $stateParams.buildId;
    var featureURI = $stateParams.featureURI;

    //init variables
    $scope.background = {};
    $scope.scenarios = [];
    $scope.faillingScenarios = [];

    var getFeatureDetails = function() {
        var resource = JenkinsProvider.getFeatureBuild(
            $scope.project,
            buildId,
            featureURI
        ).success(function(data) {
            console.log(data);
            //refactor
            //better get only one object in buildFacade
            //and in the view get the field that we want
            var buildFacade = new BuildFacade(data);

            $scope.build = buildFacade.build;
            $scope.feature = buildFacade.feature;

            $scope.background = buildFacade.background;
            $scope.scenarios = buildFacade.scenarios;

            $scope.faillingScenarios = buildFacade.faillingScenarios

            console.log($scope.faillingScenarios);
            processData();
            toastr.success("Created");

            console.log()

        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    getFeatureDetails();

     var colorArray = [ 'green','red','yellow','blue'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }
    var processData = function() {

        $scope.exampleData1 = [{
            key: "Steps",
            values: [
                ["Success", $scope.feature.numberOfPasses],
                ["Failling", $scope.feature.numberOfFailures],
                ["Skipped", $scope.feature.numberOfSkipped],
                ["Undifined", $scope.feature.numberOfUndefined]
            ]
        }];

        $scope.exampleData = [{
            key: "X",
            y: 0
        }, {
            key: "Y",
            y: 0
        }, {
            key: "Skipped",
            y: 0
        }, {
            key: "X",
            y: 0
        }, {
            key: "Passing",
            y: $scope.feature.numberOfPasses
        }, {
            key: "X",
            y: 0
        }, {
            key: "Failling",
            y: $scope.feature.numberOfFailures
        }];
    }


    $scope.xFunction = function() {
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function() {
        return function(d) {
            return d.y;
        };
    }

    /*
    Used as helper in view
     */
    $scope.isPassed = function(value) {
        return value === "PASSED";
    }

    /*
    Used to render html comming from a json var
     */
    $scope.renderHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };

});
