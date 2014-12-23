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


};
