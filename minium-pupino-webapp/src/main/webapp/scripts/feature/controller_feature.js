'use strict';

pupinoApp.controller('FeatureController', function($scope, $stateParams, $sce, $state, resolvedProject, Project, JenkinsProvider) {

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
            $scope.build = data;
            $scope.feature = data.features[0];
            extractBackGround();

            $scope.faillingScenarios = jsonPath.eval(data, "$..elements[?(@.status=='FAILED')]");

            console.log($scope.faillingScenarios);
            processData();
            toastr.success("Created");
        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    getFeatureDetails();

    var extractBackGround = function() {
        var r = true;
        angular.forEach($scope.feature.elements, function(elem) {
            if (elem.keyword === "Background" && r === true) {
                $scope.background = elem;
                r = false;
            } else if (elem.keyword !== "Background") {
                //console.log(elem)
                $scope.scenarios.push(elem);
            }
        });
    }
    
    var processData = function() {
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
