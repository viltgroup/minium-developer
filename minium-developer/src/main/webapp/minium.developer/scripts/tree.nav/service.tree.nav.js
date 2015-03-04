'use strict';

// This module creates and append the new elements create for new tabs
miniumDeveloper.factory('TreeNav', function($http, $q) {
    var TreeNav = {};

    TreeNav.getParentElement = function(relativeUri, treeData) {
        //do the split to get the level of depth
        var levels = relativeUri.split("/");
        //remove the last element
        //if got more than one element
        //for instance if it is a file on the first level
        if (levels.length >= 1){
            levels.splice(levels.length - 1, 1);
        }

        //get the first level
        var aux = treeData;
        var node, pos;
        for (var i = 0; i < aux.length; i++) {
            var level = unescape(levels[0])
            if (aux[i].name == level) {
                console.log(aux[i].children)
                node = aux[i];
                pos = i;
                break;
            }
        }
       
        if (node.type === "FILE") {
            //no need for the rest of the code
            //beacause its a file form the first level
            var elem = node;
        } else {
            var elem = node.children;

            levels.splice(0, 1);
            levels.forEach(function(value, i) {
                console.debug('START %d: %s', i, value);
                //add to the
                console.debug(elem);
                var children = elem;
                var childNode;
                for (var y = 0; y < children.length; y++) {
                    if (children[y].name === value) {
                        // alert(y + " " + children[y].name + " " + value)
                        childNode = children[y];
                        pos = y;
                        break;
                    }
                }

                elem = childNode.children;
                //console.debug(elem);
                alert(JSON.stringify(elem))
            });

            // if (elem.children == undefined)
            //     elem.children = [];
        }


        return {
            element: elem,
            pos: pos
        }

    }


    TreeNav.getParentElement2 = function(relativeUri, treeData) {
        //if it is a folder
        //config/folder1/subfolder/
        var lastChar = relativeUri.charAt(relativeUri.length - 1);
        if(lastChar == "/")
             relativeUri = relativeUri.substring(0, relativeUri.length -1);
        //do the split to get the level of depth
        var levels = relativeUri.split("/");

        //remove the last element
        //if got more than one element
        //for instance if it is a file on the first level
        if (levels.length > 1){
            var selectedItem = levels[levels.length -1 ];
            levels.splice(levels.length - 1, 1);
        }

        //get the first level
        var aux = treeData;
        var node, pos;
        for (var i = 0; i < aux.length; i++) {
            var level = unescape(levels[0])
            if (aux[i].name == level) {
                console.log(aux[i].children)
                node = aux[i];
                pos = i;
                break;
            }
        }
       
        if (node.type === "FILE") {
            //no need for the rest of the code
            //beacause its a file form the first level
            var elem = aux;
        } else {
            var elem = node.children;

            levels.splice(0, 1);
            levels.forEach(function(value, i) {
                console.debug('START %d: %s', i, value);
                //add to the
                console.debug(elem);
                var children = elem;
                var childNode;
                for (var y = 0; y < children.length; y++) {
                    if (children[y].name === value) {
                        // alert(y + " " + children[y].name + " " + value)
                        childNode = children[y];
                        break;
                    }
                }

                elem = childNode.children;

                for(var i = 0; i < elem.length ; i++){
                    alert("LAST ONE " + elem[i].name)
                    if (elem[i].name === selectedItem) {
                        pos = i;
                        alert("FOUND "  +elem[i].name + " "+ i);
                        break;
                    }
                }
                //console.debug(elem);
                alert(JSON.stringify(elem[pos]))
            });

            if (elem.children == undefined)
                elem.children = [];
        }


        return {
            element: elem,
            pos: pos
        }

    }

    TreeNav.getElement = function(relativeUri, treeData) {

        if (relativeUri.indexOf("/") > -1) {
            var levels = relativeUri.split("/");
            //remove the last element
            //if got more than one element
            //for instance if it is a file on the first level
            // if (levels.length >= 1)
            //     levels.splice(levels.length - 1, 1);

            //get the first level
            var aux = treeData;
            var node, pos;
            for (var i = 0; i < aux.length; i++) {
                var level = unescape(levels[0])
                if (aux[i].name == level) {
                    console.log(aux[i].children)
                    node = aux[i];
                    pos = i;
                    break;
                }
            }
            var elem;

            elem = node.children;

            levels.splice(0, 1);
            levels.forEach(function(value, i) {
                console.debug('START %d: %s', i, value);
                //add to the
                console.debug(elem);
                var children = elem;
                var childNode;
                for (var y = 0; y < children.length; y++) {
                    if (children[y].name === value) {
                        // alert(y + " " + children[y].name + " " + value)
                            // childNode = children[y];
                        pos = y;
                        break;
                    }
                }

                // elem = childNode.children;
                //console.debug(elem);
                // alert(JSON.stringify(elem))

                if (elem.children == undefined)
                    elem.children = [];
            });

        } else { //first level
            // alert(relativeUri)
            var level = unescape(relativeUri);
            var aux = treeData;
            var node, pos;
            for (var i = 0; i < aux.length; i++) {
                if (aux[i].name == level) {
                    console.log(aux[i].children)
                        // node = aux[i];
                    pos = i;
                    break;
                }
            }

            var elem = treeData;
        }

        return {
            element: elem,
            pos: pos
        }


    }

    //get node of folders
    TreeNav.getNode = function(relativeUri, treeData) {


        var levels = relativeUri.split("/");
        //remove the last element
        //if got more than one element
        //for instance if it is a file on the first level
        if (levels.length >= 1)
            levels.splice(levels.length - 1, 1);

        //get the first level
        var aux = treeData;
        var node, pos;
        for (var i = 0; i < aux.length; i++) {
            var level = unescape(levels[0])
            if (aux[i].name == level) {
                console.log(aux[i].children)
                node = aux[i];
                pos = i;
                break;
            }
        }
        var elem;

        elem = node;

        levels.splice(0, 1);
        levels.forEach(function(value, i) {
            console.debug('START %d: %s', i, value);
            //add to the
            console.debug(elem);
            var children = elem.children;
            var childNode;
            for (var y = 0; y < children.length; y++) {
                if (children[y].name === value) {
                    // alert(y + " " + children[y].name + " " + value)
                    childNode = children[y];
                    pos = y;
                    break;
                }
            }

             elem = childNode;
            //console.debug(elem);
            // alert(JSON.stringify(elem))

            // if (elem.children == undefined)
            //     elem.children = [];
        });


        return {
            element: elem,
            pos: pos
        }


    }
    return TreeNav;

});
