'use strict';

var GlobalController = function($scope, $modal, $http, $state, $log, $location, $timeout, FS, FormatService) {

    $scope.$state = $state;

    $scope.openFile = function(type) {
        $modal.open({
            templateUrl: "partials/modal/open.file.html",
            controller: "OpenFileController"
        });
    };

    $scope.search = function() {
        var searchQuery = $scope.form.searchQuery;
        $scope.results = FS.search({
            q: searchQuery
        });
    };

    $scope.location = "http://localhost:8080/#";


    /*
    Tree view 
     */
    
    $scope.dataForTheTree = [];

    $scope.fs = {
        current: {}
    };
    var firstLoad = true;
    var asyncLoad = function(node) {
        console.debug(node);
        var params = {
            path: node.relativeUri || ""
        };
        node.children = FS.list(params, function() {
            _.each(node.children, function(item) {
                // tree navigation needs a label property
                item.label = item.name;
                console.log(item)
                if (firstLoad) {
                    $scope.dataForTheTree.push(item);
                }
            });
            firstLoad = false;
        });
        // console.log($scope.fs.current.children)
    };

    var loadChildren = function(item) {
        // if (item.childrenLoaded) return;
        asyncLoad(item);
        // item.childrenLoaded = true;
    };

    $scope.showSelected = function(node) {
        
        $scope.selectedNode = node;

        if (node.type == "FILE") {
            $state.go("global.editorarea", {
                path: node.relativeUri
            });
        } else {
            console.log(node.children)
            loadChildren(node);
            //expand the node
            $scope.expandedNodes.push(node)
        }

    };

    $scope.showToggle = function(node, expanded) {
        console.log(node.children)
        loadChildren(node);
    };

    asyncLoad($scope.fs.current);



    /**
     * NAVIGATION FOLDERS Functions
     */
    $scope.opts = {
        isLeaf: function(node) {
            if (node.type === "DIR")
                return false;
            else
                return true;
        },
        dirSelectable: false
    };

    $scope.getColor = function(node) {
        if (node.name === "features") {
            return "red";
        } else if (node.name === "steps") {
            return "blue"
        }

    };

    $scope.collapseAll = function() {
        $scope.expandedNodes = [];
    };
};
