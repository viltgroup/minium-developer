'use strict';
angular.module('minium.developer')
    .controller('FileController', function($scope, $rootScope, $state, $stateParams, $log, $location, FS, launcherService) {

    $scope.fs = {
        current: {}
    };
    $scope.form = {};

    $scope.type = $stateParams.type | ''

    //focus on search input

    $scope.asyncLoad = function(node) {
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
        $scope.fs.current.children =  node.children;
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





});
