'use strict';

var OpenFileController = function($scope, $rootScope, $controller, $modalInstance, $state, $stateParams, $log, $location, FS, FormatService) {

    console.debug("loaded FileController")
        //extends the fileController
    $controller('FileController', {
        $scope: $scope
    });
    
    $scope.form = {};

    $scope.type = $stateParams.type | '';


    $scope.search = function() {
        var searchQuery = $scope.form.searchQuery;
        $scope.results = FS.search({
            q: searchQuery
        });
    };

    $scope.select = function(item) {

        $state.go("global.editorarea", {
            path: item.relativeUri
        });
        //$scope.$close(true);
    };

    $scope.ok = function() {
        $scope.$close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };






};
