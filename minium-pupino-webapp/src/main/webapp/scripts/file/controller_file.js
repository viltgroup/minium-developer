'use strict';

var FileController = function($scope, $rootScope, $modalInstance, $state, $stateParams, $log, $location, FS, FormatService, launcherService) {
    
   
    $scope.fs = {
        current: {}
    };
    $scope.form = {};

    $scope.type = $stateParams.type | ''

    //focus on search input
    $("search-query").focus();

    var asyncLoad = function(node) {
        console.debug(node);
        var params = {
            path: node.relativeUri || ""
        };
        node.children = FS.list(params, function() {
            _.each(node.children, function(item) {
                // tree navigation needs a label property
                item.label = item.name;
                item.parent = node;
            });
        });
    };

    $scope.loadParent = function() {
        var parent = $scope.fs.current.parent;
        if (!parent) return;
        $scope.fs.current = parent;
        $scope.loadChildren(parent);
    }

    $scope.loadChildren = function(item) {
        if (item.childrenLoaded) return;
        asyncLoad(item);
        item.childrenLoaded = true;
    };

    asyncLoad($scope.fs.current);

    $scope.search = function() {
        var searchQuery = $scope.form.searchQuery;
        $scope.results = FS.search({
            q: searchQuery
        });
    };

    $scope.enter = function(item) {
        $scope.fs.current = item;
        asyncLoad(item);
    };

    $scope.select = function(item) {
       
        $state.go("global.editorarea", {
            path: item.relativeUri
        });
        $scope.$close(true);
    };

    $scope.ok = function() {
        $scope.$close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };


    $scope.formatFile = function(props) {
        var path = props.relativeUri || props;

        FormatService.file(path).success(function(data) {
          console.debug(data);
        }).error(function(data) {
          console.debug("error", data);
        });
    }

     $scope.formatDirectory = function(props) {

        var path = props.relativeUri || props;

        FormatService.directory(path).success(function(data) {
          console.debug(data);
        }).error(function(data) {
          console.debug("error", data);
        });
    }


};
