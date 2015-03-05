'use strict';

angular.module('minium.developer')
    .controller('EditTreeNavController', function($scope, $modalInstance, TreeNav, relativeUriContextClick, dataForTheTree, operation, nodeName, FileFactory, GENERAL_CONFIG) {

        var relativeUriContextClick = relativeUriContextClick;
        var dataForTheTree = dataForTheTree;
        $scope.operation = operation;
        var nodeName = nodeName;
        $scope.selectedItem = "";
        $scope.elemClick = relativeUriContextClick;

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
            //TODO
            //get the element
            //change in serve
            //remove the changed element
            //add renamed element from server
            // alert(relativeUriContextClick)
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

            
            var obj = {
                oldName: relativeUriContextClick,
                newName: newPath
            }

            alert(obj.oldName + " NP " + obj.newName);
            // JSON.stringify(obj)
            FileFactory.rename(obj).success(function(data) {

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
                var relativeUri = relativeUriContextClick;
                // alert(relativeUri)
                FileFactory.delete(relativeUri).success(function(data) {

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
                var relativeUri = relativeUriContextClick;
                // alert(relativeUri)
                FileFactory.deleteDirectory(relativeUri).success(function(data) {

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

            FileFactory.createFolder(newPath).success(function(data) {

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
            //add teh new element from server in tree
            var relativeUri = relativeUriContextClick;

            var newFile = $scope.selectedItem;

            var newPath = relativeUriContextClick + newFile;
            // alert(newPath)
            FileFactory.create(newPath).success(function(data) {

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


            // elem.push(newElem);

            // alert(JSON.stringify(elem))
            //alert(find($scope.dataForTheTree, relativeUri));

        }

        $scope.renameFolder = function() {
            //TODO
            //get the element
            //change in serve
            //remove the changed element
            //add renamed element from server
             alert(relativeUriContextClick)

            var obj = TreeNav.getNode(relativeUriContextClick, dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;
            alert(JSON.stringify(elem));
            // return;
            $scope.loadChildren(elem);
        }


        $scope.getInfo = function() {
            //TODO
            //get the info form the server
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
