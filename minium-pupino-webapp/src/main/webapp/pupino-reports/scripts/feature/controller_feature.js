'use strict';

pupinoReports.controller('FeatureController', function($scope, $stateParams, $sce, $state,$modal, resolvedProject, Project, JenkinsProvider, BuildProject, BuildFacade) {

    $state.go('global.feature.scenarios');
    $scope.project = resolvedProject;
    $scope.buildId = $stateParams.buildId;
    var featureURI = $stateParams.featureURI;

    //init variables
    $scope.background = {};
    $scope.scenarios = [];
    $scope.faillingScenarios = [];

    var getFeatureDetails = function() {
        BuildProject.findByFeature(
            $scope.buildId,
            featureURI
        ).success(function(data) {
            // console.log(data);
            //refactor
            //better get only one object in buildFacade
            //and in the view get the field that we want
            var buildFacade = new BuildFacade(data);

            $scope.build = buildFacade.build;
            $scope.feature = buildFacade.feature;
        
            $scope.scenarios = buildFacade.scenarios;

            $scope.faillingScenarios = buildFacade.faillingScenarios

            //console.log($scope.faillingScenarios);
            processData();

            console.log(buildFacade)

        }).error(function(data) {
            toastr.error("Error " + data);
        });
    }

    getFeatureDetails();

    var colorArray = ['green', 'red', 'yellow', 'blue'];
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
        return (value === "PASSED");
    }

    $scope.isFailOrSkipped = function(value) {
        return (value === "FAILED" || value === "SKIPPED");
    }

    /*
    Used to render html comming from a json var
     */
    $scope.renderHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };


    $scope.checkStatus = function(status, prefix) {
        var result = prefix;
        result.concat("sdsd")
        switch (status) {
            case "PASSED":
                result += 'success';
                break;
            case "FAILED":
                result += 'danger';
                break;
            case "SKIPPED":
                result += 'warning';
                break;
            default: //do nothing
                result += 'info';
        }

        return result;
    }

    $scope.openModalImage = function(imageSrc, imageDescription) {
        $modal.open({
            templateUrl: "/pupino-reports/views/feature/modals/modalImage.html",
            resolve: {
                imageSrcToUse: function() {
                    return imageSrc;
                },
                imageDescriptionToUse: function() {
                    return imageDescription;
                }
            },
            size: 'lg',                         //size of the modal
            windowClass: 'modal-with-bg-color', //used to set the CSS class of the modal
            controller: [
                "$scope", "imageSrcToUse", "imageDescriptionToUse",
                function($scope, imageSrcToUse, imageDescriptionToUse) {
                    $scope.ImageSrc = imageSrcToUse;
                    $scope.width = 1000;
                    $scope.height = 1000;
                    return $scope.ImageDescription = imageDescriptionToUse;
                }
            ]
        });
    };

    $scope.getImgScr = function  (mime_type,data) {
        return "data:"+ mime_type+ ";base64,"+ data;
    }

});
