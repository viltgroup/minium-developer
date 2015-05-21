'use strict';

angular.module('minium.developer')
    .controller('TreeNavController', function($scope, $state, $modal, $q, $window, FS, TreeNav, ProjectFactory, ProjectService, FileManager, GENERAL_CONFIG) {

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
                path: decodeURIComponent(node.relativeUri || "")
            };

            node.children = FS.list(params, function() {
                //sort the child by name
                node.children.sort(predicatBy("name"))
                _.each(node.children, function(item) {
                    // tree navigation needs a label property
                    item.label = item.name;
                    if (firstLoad && $scope.hasProject) {
                        $scope.dataForTheTree[0].children.push(item);
                        $scope.expandedNodes.push($scope.dataForTheTree[0]);
                        // console.log($scope.expandedNodes)
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
                $scope.loadFile(decodeURIComponent($scope.active.selectedNode.relativeUri));

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
                iFeature: "feature-node",
                label: "a6",
                labelSelected: "a8"
            },
            isLeaf: function(node) {
                if (node.type === "DIR")
                    return false;
                else
                    return true;
            },
            isJS: function(node) {
                if (/\.js$/.test(node.name))
                    return true;
                else
                    return false;

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
            firstLoad = true;
            $scope.dataForTheTree = [];
            $scope.expandedNodes = [];
            addProjectToTree(projectName);
            asyncLoad($scope.fs.current);
        }

        var addProjectToTree = function(projectName) {
            if ($scope.hasProject) {
                $scope.dataForTheTree.push({
                    "name": projectName,
                    "type": "DIR",
                    "label": "project",
                    "project": true,
                    "children": []
                });
            }
        }

        //put this in a service in order to re use
        $scope.importProject = function(path) {
            ProjectService.open(path);
        }

        $scope.openProject = function() {
            $state.go('global.editorarea.sub.importProject');
        }

        //refactor put in a service
        $scope.hasProject = false;
        var projectName;
        var loadProject = function() {
            ProjectFactory.hasProject().success(function(data) {
                if (data !== '') {
                    $scope.hasProject = true;
                    projectName = data;
                } else if ($.cookie('project') != undefined) {
                    $scope.importProject($.cookie('project'));
                } else {
                    $.removeCookie('openTabs');
                    toastr.info(GENERAL_CONFIG.ERROR_MSG.NO_PROJECT_DEFINED)
                        //remove all the open tab int the cookie 
                        //because there's no project defined
                }
                addProjectToTree(projectName);
                asyncLoad($scope.fs.current);
            }).error(function(data, status) {
                toastr.error(data)
            });
        }

        //////////////////////////////////////////////////////////////////
        //
        // Initialize functions
        //
        //////////////////////////////////////////////////////////////////
        loadProject();

        //////////////////////////////////////////////////////////////////
        //
        // CONTEXT MENU
        //
        //////////////////////////////////////////////////////////////////
        var actualElem;
        //to know the type of the element where we click
        $scope.clickedType = "FILE";
        var relativeUriContextClick;
        var nodeName;
        $('.tree-bar').contextmenu({
            target: '#context-menu2',
            before: function(e) {
                relativeUriContextClick = undefined;
                var clickedElem = $(e.target);
                e.preventDefault();
                // This function is optional.
                // Here we use it to stop the event if the user clicks a span
                if (clickedElem.data("type") == 'DIR') {
                    if (clickedElem.data("project") === true) {
                        $scope.clickedType = "PROJECT"
                    } else {
                        $scope.clickedType = "DIR"
                    }
                } else if (clickedElem.data("type") == "FILE") {
                    $scope.clickedType = "FILE"
                }

                $scope.$apply();

                if (clickedElem.data('relative-uri') !== undefined) {
                    relativeUriContextClick = clickedElem.data('relative-uri');
                    nodeName = clickedElem.data('name');
                    e.preventDefault();
                    return true;
                }
            }
        });


        $scope.open = function(operation) {
            var modalInstance = $modal.open({
                templateUrl: 'minium.developer/views/tree.nav/modal.tree.nav.html',
                controller: 'EditTreeNavController',
                size: 'sm',
                resolve: {
                    relativeUriContextClick: function() {
                        return relativeUriContextClick;
                    },
                    dataForTheTree: function() {
                        return $scope.dataForTheTree[0].children;
                    },
                    operation: function() {
                        return operation;
                    },
                    nodeName: function() {
                        return nodeName;
                    },
                    scope: function() {
                        return $scope;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {});
        };

        //////////////////////////////////////////////////////////////////
        //
        // Delete operation don't need a modal
        //
        //////////////////////////////////////////////////////////////////
        $scope.delete = function() {
            //TODO

            var result = confirm(GENERAL_CONFIG.FILE_SYSTEM.DELETE + "\n" + decodeURIComponent(relativeUriContextClick));
            if (result == true) {
                var dataForTheTree = $scope.dataForTheTree[0].children;
                //Logic to delete the item
                //get element
                //remove element
                var relativeUri = decodeURIComponent(relativeUriContextClick);
                FileManager.delete(relativeUri).success(function(data) {

                    var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                    var elem = obj.element;
                    var pos = obj.pos;

                    elem.splice(pos, 1);

                    toastr.success("File " + relativeUri + " deleted");
                    // $modalInstance.close();
                }).error(function(data) {
                    toastr.error("Error " + data);
                    // $modalInstance.close();
                });
            }
        }

        $scope.deleteDirectory = function() {
            //TODO
            var result = confirm(GENERAL_CONFIG.FILE_SYSTEM.DELETE + "\n" + decodeURIComponent(relativeUriContextClick));
            if (result == true) {
                var dataForTheTree = $scope.dataForTheTree[0].children;

                //Logic to delete the item
                //get element
                //remove element
                var relativeUri = decodeURIComponent(relativeUriContextClick);
                FileManager.deleteDirectory(relativeUri).success(function(data) {

                    var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                    var elem = obj.element;
                    var pos = obj.pos;

                    elem.splice(pos, 1);

                    toastr.success("File " + relativeUri + " deleted");
                    // $modalInstance.close();
                }).error(function(data) {
                    toastr.error("Error " + data);
                    // $modalInstance.close();
                });

            } else {
                // $modalInstance.close();
            }

        }

    });
