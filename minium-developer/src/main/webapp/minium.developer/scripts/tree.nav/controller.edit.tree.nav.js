'use strict';

angular.module('minium.developer')
    .controller('EditTreeNavController', function($scope, $modalInstance, TreeNav, relativeUriContextClick, dataForTheTree, operation, nodeName, FileManager, scope, GENERAL_CONFIG) {

        var relativeUriContextClick = relativeUriContextClick;
        var dataForTheTree = dataForTheTree;
        $scope.operation = operation;
        var nodeName = nodeName;
        $scope.selectedItem = "";
        $scope.elemClick = relativeUriContextClick;
        var scope = scope;

        $scope.ok = function() {
            // alert(operation + " " + $scope.selectedItem);
            switch ($scope.operation) {
                case 'newFolder':
                    $scope.newFolder();
                    break;
                case 'newFile':
                    $scope.newFile();
                    break;
                case 'rename':
                    $scope.rename();
                    break;
                case 'renameFolder':
                    $scope.renameFolder();
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

            alert(obj.oldName + " NP " + obj.newName);
            // JSON.stringify(obj)
            FileManager.rename(obj).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;
                alert(JSON.stringify(elem) + " POS " + pos)
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
                // alert(relativeUri)
                FileManager.delete(relativeUri).success(function(data) {

                    var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                    var elem = obj.element;
                    var pos = obj.pos;
                    // alert(JSON.stringify(elem) + " POS " + pos)

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
                // alert(relativeUri)
                FileManager.deleteDirectory(relativeUri).success(function(data) {

                    var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
                    var elem = obj.element;
                    var pos = obj.pos;
                    // alert(JSON.stringify(elem) + " POS " + pos)

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

            var relativeUri = relativeUriContextClick;

            var newFolder = $scope.selectedItem;

            var newPath = relativeUriContextClick + newFolder;

            FileManager.createFolder(newPath).success(function(data) {

                var newElem = data;
                // alert(JSON.stringify(newElem));

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
            var relativeUri = relativeUriContextClick;

            var newFile = $scope.selectedItem;

            var newPath = relativeUriContextClick + newFile;
            // alert(newPath)
            FileManager.create(newPath).success(function(data) {

                var newElem = data;
                // alert(JSON.stringify(newElem));

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

            alert(split)
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
            alert(newPath)
            FileManager.rename(obj).success(function(data) {

                var newElem = data;

                var obj = TreeNav.getParentElement(relativeUriContextClick, dataForTheTree);
                var elem = obj.element;
                var pos = obj.pos;
                alert(JSON.stringify(elem) + " POS " + pos)
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


        // initializations
        if ($scope.operation === 'rename' || $scope.operation === 'renameFolder') {
            $scope.selectedItem = nodeName;
        } else if ($scope.operation === 'delete') {
            $scope.delete();
        } else if ($scope.operation === 'deleteDirectory') {
            $scope.deleteDirectory();
        }

    });
