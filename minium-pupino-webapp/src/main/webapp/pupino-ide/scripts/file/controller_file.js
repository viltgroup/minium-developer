'use strict';

var FileController = function($scope, $rootScope, $state, $stateParams, $log, $location, FS, FormatService, launcherService) {

    $scope.fs = {
        current: {}
    };
    $scope.form = {};

    $scope.type = $stateParams.type | ''

    //focus on search input
    $("search-query").focus();

    $scope.asyncLoad = function(node) {
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
        $scope.asyncLoad(item);
        item.childrenLoaded = true;
    };


    $scope.enter = function(item) {
        $scope.fs.current = item;
        $scope.asyncLoad(item);
    };

    $scope.asyncLoad($scope.fs.current);


};
