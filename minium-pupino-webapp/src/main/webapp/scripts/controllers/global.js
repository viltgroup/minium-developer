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
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            isFeature:"a2",
            label: "a6",
            labelSelected: "a8"
        },
        isLeaf: function(node) {
            if (node.type === "DIR")
                return false;
            else
                return true;
        },
        isFeature: function(node) {
            if (node.type === "DIR")
                return false;
            else
                return true;
        },
        dirSelectable: false
    };

    $scope.getColor = function(node) {
        // if (node.name === "features") {
        //     return "red";
        // } else if (node.name === "steps") {
        //     return "blue"
        // }

    };

    $scope.collapseAll = function() {
        $scope.expandedNodes = [];
    };


    //functions used in the 2 modules
    $scope.isEmptyObject = function(obj) {

        if (obj.length && obj.length > 0)
            return false;

        if (obj.length === 0)
            return true;
    }

    $scope.readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};
