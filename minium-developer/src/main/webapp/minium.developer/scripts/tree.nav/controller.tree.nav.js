'use strict';

angular.module('minium.developer')
    .controller('TreeNavController', function($scope, $state, FS, TreeNav, GENERAL_CONFIG) {

        /**
         *   Tree view  controller
         */

        //data for the tree
        $scope.dataForTheTree = [];
        //current file selected
        $scope.fs = {
            current: {}
        };

        var firstLoad = true;
        //////////////////////////////////////////////////////////////////
        //
        // Load the files from the file system
        //
        //////////////////////////////////////////////////////////////////
        var asyncLoad = function(node) {

            var params = {
                path: node.relativeUri || ""
            };

            node.children = FS.list(params, function() {
                //sort the child by name
                node.children.sort(predicatBy("name"))
                _.each(node.children, function(item) {
                    // tree navigation needs a label property
                    item.label = item.name;
                    if (firstLoad) {
                        $scope.dataForTheTree.push(item);
                    }
                });
                firstLoad = false;
            });
        };

        //////////////////////////////////////////////////////////////////
        //
        // Load childrens of an item
        //
        //////////////////////////////////////////////////////////////////
        $scope.loadChildren = function(item) {
            // if (item.childrenLoaded) return;
            asyncLoad(item);
            // item.childrenLoaded = true;
        };



        $scope.expandedNodes = [];
        //console.log($scope.expandedNodes);
        $scope.showSelected = function(node) {

            $scope.active.selectedNode = node;

            if (node.type == "FILE") {
                $scope.loadFile($scope.active.selectedNode.relativeUri);

                $state.go("global.editorarea.sub", {
                    path: $scope.active.selectedNode.relativeUri
                }, {
                    location: 'replace', //  update url and replace
                    inherit: false,
                    notify: false
                });
            } else { //if the is on click on a file
                $scope.loadChildren(node);
                //expand the node
                $scope.expandedNodes.push(node)

            }

        };

        $scope.showToggle = function(node, expanded) {
            //console.log(node.children)
            $scope.loadChildren(node);
        };

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
                isFeature: "a2",
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

        $scope.collapseAll = function() {
            $scope.expandedNodes = [];
        };

        function predicatBy(prop) {
            return function(a, b) {
                if (a[prop] > b[prop]) {
                    return 1;
                } else if (a[prop] < b[prop]) {
                    return -1;
                }
                return 0;
            }
        }


        $scope.refresh = function() {
            // alert($scope.fs.current)
            firstLoad = true;
            $scope.dataForTheTree = [];
            asyncLoad($scope.fs.current);
        }

        //////////////////////////////////////////////////////////////////
        //
        // Initialize functions
        //
        //////////////////////////////////////////////////////////////////
        asyncLoad($scope.fs.current);


        //////////////////////////////////////////////////////////////////
        //
        // CONTEXT MENU
        //
        //////////////////////////////////////////////////////////////////
        var actualElem;
        //to know the type of the element where we click
        $scope.clickedType;
        var relativeUriContextClick;
        $('.tree-bar').contextmenu({
            target: '#context-menu2',
            before: function(e) {
                relativeUriContextClick = undefined;
                var clickedElem = $(e.target);
                // alert("dsd")
                e.preventDefault();
                // alert($(e.target).text().split(' ').join(''));
                console.log($(e.target).text().replace(/\s+/g, ' '));
                actualElem = $(e.target).text().replace(/\s+/g, ' ');

                // alert($(e.target).data("type"))
                // return true;
                // This function is optional.
                // Here we use it to stop the event if the user clicks a span

                if (clickedElem.data("type") == 'DIR') {
                    $scope.clickedType = "DIR"

                } else {
                    $scope.clickedType = "FILE"
                }
                if (clickedElem.data('relative-uri') !== undefined) {

                    relativeUriContextClick = clickedElem.data('relative-uri');
                    e.preventDefault();
                    return true;

                }

            }
        });





        $scope.newFolder = function(relativeUri, name) {
            var relativeUri = relativeUriContextClick;
            var name = "newFolder"
            var newElem = {
                label: name,
                lastModified: 1422905820000,
                name: name,
                relativeUri: relativeUri + name + "/",
                size: 349,
                type: "DIR",
                uri: "http://localhost:9000/fs/" + relativeUri + name,
                children: []
            };

            var obj = TreeNav.getParentElement(relativeUri, $scope.dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;

            //add the new element to the tree
            elem.push(newElem);
        }


        function find(array, relativeUri) {
            if (typeof array != 'undefined') {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].relativeUri == relativeUri) return [relativeUri];
                    var a = find(array[i].children, relativeUri);
                    if (a != null) {
                        a.unshift(array[i].relativeUri);
                        return a;
                    }
                }
            }
            return null;
        }

        //fucntion of context menu
        $scope.open = function() {
            // //TODO
            var elem = "config";
            var child = "application.yml";
            // alert(JSONPath({
            //     json: $scope.dataForTheTree,
            //     path: "$..*[name='as.js']"
            // }));

            var aux = $scope.dataForTheTree;
            var node;
            for (var i = 0; i < aux.length; i++) {
                if (aux[i].name == elem) {
                    console.log(aux[i].children)
                    node = aux[i];
                    break;
                }
            }
            var children = $scope.dataForTheTree[i].children;
            var childNode;
            for (var y = 0; y < children.length; y++) {
                if (children[y].name === child) {
                    childNode = children[y];
                    break;
                }
            }
            alert(JSON.stringify(childNode))

            $scope.dataForTheTree[i].children.splice(y, 1);
            var newElem = {
                label: "newFile.yml",
                lastModified: 1422905820000,
                name: "newFile.yml",
                relativeUri: "config/applicatio(another%20copy)sdasdsad.yml",
                size: 349,
                type: "FILE",
                uri: "http://localhost:9000/fs/config/applicatio(another%20copy)sdasdsad.yml"
            };
            $scope.dataForTheTree[i].children.push(newElem);

            //create in file system the file

        }

        $scope.delete = function() {
            //TODO
            var result = confirm(GENERAL_CONFIG.FILE_SYSTEM.DELETE);
            if (result == true) {
                //Logic to delete the item
                //get element
                //remove element
                var relativeUri = relativeUriContextClick;
                alert(relativeUri)
                var obj = TreeNav.getElement(relativeUri, $scope.dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;
                    // alert(JSON.stringify(elem))
                elem.splice(pos, 1);
            }
        }

        $scope.newFile = function() {
            //TODO
            //get the element
            //create a file in file system
            //add teh new element from server in tree

            var relativeUri = relativeUriContextClick;
            var name = "newFile"
            var newElem = {
                label: name,
                lastModified: 1422905820000,
                name: name,
                relativeUri: relativeUri + name + "/",
                size: 349,
                type: "FILE",
                uri: "http://localhost:9000/fs/" + relativeUri + name,
                children: []
            };

            var obj = TreeNav.getParentElement(relativeUri, $scope.dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;

            if (elem.children == undefined)
                elem.children = [];
            //add the new element to the tree

            elem.push(newElem);
            // elem.push(newElem);

            // alert(JSON.stringify(elem))
            //alert(find($scope.dataForTheTree, relativeUri));

        }

        $scope.rename = function() {
            //TODO
            //get the element
            //change in serve
            //remove the changed element
            //add renamed element from server
            alert(relativeUriContextClick)
            var relativeUri = relativeUriContextClick;
            var name = "renamed.yml"
            var newElem = {
                label: name,
                lastModified: 1422905820000,
                name: name,
                relativeUri: "config/" + name + "/",
                size: 349,
                type: "FILE",
                uri: "http://localhost:9000/fs/" + "config/" + name,
                children: []
            };

            var obj = TreeNav.getElement(relativeUri, $scope.dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;
            alert(pos)
                // alert(JSON.stringify(elem))
            elem.splice(pos, 1);
            alert(JSON.stringify(elem))

            elem.push(newElem);

        }


        $scope.renameFolder = function() {
            //TODO
            //get the element
            //change in serve
            //remove the changed element
            //add renamed element from server
            alert(relativeUriContextClick)
            var obj = TreeNav.getNode(relativeUriContextClick, $scope.dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;
            alert(elem)
            $scope.loadChildren(elem);
        }


        $scope.getInfo = function() {
            //TODO
            //get the info form the server
        }


    });
