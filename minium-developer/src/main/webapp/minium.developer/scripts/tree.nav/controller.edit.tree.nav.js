'use strict';

angular.module('minium.developer')
    .controller('EditTreeNavController', function($scope, $modalInstance, TreeNav, relativeUriContextClick, dataForTheTree,operation) {

        var relativeUriContextClick = relativeUriContextClick;
        var dataForTheTree = dataForTheTree;
        var operation = operation;
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

            var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
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

            var aux = dataForTheTree;
            var node;
            for (var i = 0; i < aux.length; i++) {
                if (aux[i].name == elem) {
                    console.log(aux[i].children)
                    node = aux[i];
                    break;
                }
            }
            var children = dataForTheTree[i].children;
            var childNode;
            for (var y = 0; y < children.length; y++) {
                if (children[y].name === child) {
                    childNode = children[y];
                    break;
                }
            }
            alert(JSON.stringify(childNode))

            dataForTheTree[i].children.splice(y, 1);
            var newElem = {
                label: "newFile.yml",
                lastModified: 1422905820000,
                name: "newFile.yml",
                relativeUri: "config/applicatio(another%20copy)sdasdsad.yml",
                size: 349,
                type: "FILE",
                uri: "http://localhost:9000/fs/config/applicatio(another%20copy)sdasdsad.yml"
            };
            dataForTheTree[i].children.push(newElem);

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
                var obj = TreeNav.getElement(relativeUri, dataForTheTree);
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

            var obj = TreeNav.getParentElement(relativeUri, dataForTheTree);
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
            // alert(relativeUriContextClick)
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

            var obj = TreeNav.getElement(relativeUri, dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;
            // alert(JSON.stringify(elem))
            elem.splice(pos, 1);
            // alert(JSON.stringify(elem))
            var promise = $scope.open(elem, newElem);

            // promise.then(function() {
            //     elem.push(newElem);
            // });


        }


        $scope.renameFolder = function() {
            //TODO
            //get the element
            //change in serve
            //remove the changed element
            //add renamed element from server
            alert(relativeUriContextClick)
            var obj = TreeNav.getNode(relativeUriContextClick,dataForTheTree);
            var elem = obj.element;
            var pos = obj.pos;
            // alert(elem)
            $scope.loadChildren(elem);
        }


        $scope.getInfo = function() {
            //TODO
            //get the info form the server
        }


        
        $scope.ok = function() {
            alert(operation);
            // $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    });
