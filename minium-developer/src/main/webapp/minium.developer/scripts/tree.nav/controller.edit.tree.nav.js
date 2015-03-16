'use strict';

angular.module('minium.developer')
    .controller('EditTreeNavController', function($scope, $modalInstance, TreeNav, relativeUriContextClick, dataForTheTree, operation, nodeName, FileManager, scope, GENERAL_CONFIG) {

        var relativeUriContextClick = relativeUriContextClick;
        var dataForTheTree = dataForTheTree;
        $scope.operation = operation;
        $scope.operationName = "";
        var nodeName = nodeName;
        $scope.selectedItem = "";
        $scope.elemClick = decodeURIComponent(relativeUriContextClick);
        var scope = scope;

        $scope.ok = function() {
            switch ($scope.operation) {
                case 'newFolder':
                    $scope.newFolder();
                    $scope.operationName = "New Folder";
                    break;
                case 'newFile':
                    $scope.newFile();
                    $scope.operationName = "New File";
                    break;
                case 'rename':
                    $scope.rename();
                    $scope.operationName = "Rename File";
                    break;
                case 'renameFolder':
                    $scope.renameFolder();
                    $scope.operationName = "Rename Folder";
                    break;
            }
        };

        $scope.rename = function(selectedItem) {
            var relativeUri = relativeUriContextClick;

            var newFile = $scope.selectedItem;
            var split = relativeUriContextClick.split("/");

            //if fisrt level rename
            if (split.length > 1) {
                split.splice(split.length - 1, 1);
                var newPath = split.join("/") + "/" + newFile;
            } else {
                var newPath = newFile;
            }

            //need decodeURIComponent 
            // because the relativeUriContextClick comes like this ("john%20doe")
            var obj = {
                oldName: decodeURIComponent(relativeUriContextClick),
                newName: newPath
            }

            FileManager.rename(obj).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;
                console.log(JSON.stringify(elem[pos]));
                //elem.splice(pos, 1);

                elem[pos] = newElem;
                toastr.success("File " + relativeUri + " deleted");
                $modalInstance.close();
            }).error(function(data) {
                toastr.error("Error " + data);
            });
        }

        $scope.delete = function() {
            //TODO
            var result = confirm(GENERAL_CONFIG.FILE_SYSTEM.DELETE);
            if (result == true) {
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
                    $modalInstance.close();
                }).error(function(data) {
                    toastr.error("Error " + data);
                    $modalInstance.close();
                });
            }

        }

        $scope.deleteDirectory = function() {
            //TODO
            var result = confirm(GENERAL_CONFIG.FILE_SYSTEM.DELETE);
            if (result == true) {
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
                    $modalInstance.close();
                }).error(function(data) {
                    toastr.error("Error " + data);
                    $modalInstance.close();
                });

            } else {
                $modalInstance.close();
            }

        }


        $scope.newFolder = function(relativeUri, name) {

            var relativeUri = decodeURIComponent(relativeUriContextClick);

            var newFolder = $scope.selectedItem;

            var newPath = relativeUri + newFolder;

            FileManager.createFolder(newPath).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getElement(relativeUri, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;

                //add the new element to the tree
                elem.push(newElem);
                toastr.success("Created file " + newPath);
                $modalInstance.close();

            }).error(function(data) {
                toastr.error("Error " + data);
            });


        }

        $scope.newFile = function() {
            //TODO
            //get the element
            //create a file in file system
            //add the new element from server in tree
            var relativeUri = decodeURIComponent(relativeUriContextClick);

            var newFile = $scope.selectedItem;

            var newPath = relativeUri + newFile;
            FileManager.create(newPath).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getElement(relativeUri, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;

                if (elem.children == undefined)
                    elem.children = [];
                //add the new element to the tree

                elem.push(newElem);
                toastr.success("Created file " + newPath);
                $modalInstance.close();

            }).error(function(data) {
                toastr.error("Error " + data);
            });

        }

        $scope.renameFolder = function() {

            var newFile = $scope.selectedItem;
            var split = relativeUriContextClick.split("/");

                //if fisrt level rename
            if (split.length > 1) {
                split.splice(split.length - 1, 1);
                split.splice(split.length - 1, 1);
                var newPath = split.join("/") + "/" + newFile;
            } else {
                var newPath = newFile;
            }


            var obj = {
                oldName: relativeUriContextClick,
                newName: newPath
            }
            FileManager.rename(obj).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getParentElement(relativeUriContextClick, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;
                console.log(JSON.stringify(elem[pos]));
                //elem.splice(pos, 1);
                elem[pos] = newElem;
                toastr.success("File " + relativeUriContextClick + " deleted");
                scope.loadChildren(elem[pos]);
                $modalInstance.close();
            }).error(function(data) {
                toastr.error("Error " + data);
            });

        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };


        var init = function() {

            switch ($scope.operation) {
                case 'newFolder':
                    $scope.operationName = "New Folder";
                    break;
                case 'newFile':
                    $scope.operationName = "New File";
                    break;
                case 'rename':
                    $scope.selectedItem = nodeName;
                    $scope.operationName = "Rename File";
                    break;
                case 'renameFolder':
                    $scope.selectedItem = nodeName;
                    $scope.operationName = "Rename Folder";
                    break;
                case 'delete':
                    $scope.delete();
                    break;
                case 'deleteDirectory':
                    $scope.deleteDirectory();
                    break;
            }
        }

        init();

    });
