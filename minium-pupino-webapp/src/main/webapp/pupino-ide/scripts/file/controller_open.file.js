'use strict';

var OpenFileController = function($scope, $rootScope,$controller, $modalInstance, $state, $stateParams, $log, $location, FS, FormatService) {
    
     console.debug("loaded FileController")
      //extends the fileController
    $controller('FileController', {$scope: $scope}); 

     $scope.fs = {
        current: {}
    };
    $scope.form = {};

    $scope.type = $stateParams.type | ''

    //focus on search input
    $("search-query").focus();

    $scope.loadParent = function() {
        var parent = $scope.fs.current.parent;
        if (!parent) return;
        $scope.fs.current = parent;
        $scope.loadChildren(parent);
    }

    $scope.loadChildren = function(item) {
        if (item.childrenLoaded) return;
        $scope.asyncLoad(item);
        item.childrenLoaded = true;
    };

    $scope.asyncLoad($scope.fs.current);

    $scope.search = function() {
        var searchQuery = $scope.form.searchQuery;
        $scope.results = FS.search({
            q: searchQuery
        });
    };

    $scope.enter = function(item) {
        $scope.fs.current = item;
        $scope.asyncLoad(item);
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
