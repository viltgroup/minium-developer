'use strict';

var FeatureController = function($scope, $stateParams, $sce, resolvedProject, Project, JenkinsProvider) {

    $scope.project = resolvedProject;
    var buildId = $stateParams.buildId;
    var featureURI = $stateParams.featureURI;

    $scope.background = {};
    $scope.scenarios = [];

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
            console.log($scope.feature)
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


    $('#imageBox').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('src') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('#img').src(recipient)
    })
};
