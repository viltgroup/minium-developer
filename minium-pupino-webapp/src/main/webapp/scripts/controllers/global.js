'use strict';

var GlobalController = function($scope, $modal, $http, $log, $location, $timeout, FS, FormatService) {

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

    $scope.treeFiles = [];
    var asyncLoad = function(node) {
        console.debug(node);
        var params = {
            path: node.relativeUri || ""
        };
        node.children = FS.list(params, function() {
            _.each(node.children, function(item) {
                // tree navigation needs a label property
                item.label = item.name;
                item.parent = node;
                //$scope.resume = recursive_aux($scope.fs.current.children, tree);
            });
            //console.log(JSON.stringify(tree));
           
        });

       

       // console.log($scope.fs.current.children)
    };

    //test tree model 1
    $scope.roleList1 = [{
            "roleName": "User",
            "roleId": "role1",
            "children": [{
                "roleName": "subUser1",
                "roleId": "role11",
                "children": []
            }, {
                "roleName": "subUser2",
                "roleId": "role12",
                "children": [{
                    "roleName": "subUser2-1",
                    "roleId": "role121",
                    "children": [{
                        "roleName": "subUser2-1-1",
                        "roleId": "role1211",
                        "children": []
                    }, {
                        "roleName": "subUser2-1-2",
                        "roleId": "role1212",
                        "children": []
                    }]
                }]
            }]
        },

        {
            "roleName": "Admin",
            "roleId": "role2",
            "children": []
        },

        {
            "roleName": "Guest",
            "roleId": "role3",
            "children": []
        }
    ];


    $scope.fs = {
        current: {}
    };
   

    //roleList1 to treeview
    

    //console.log($scope.roleList);

    $scope.location = "http://localhost:8080/#"


    // var recursive_aux = function(items, tree) {

    //     for (var i = 0; i < items.length; ++i) {
    //         var item = items[i];
    //         console.log(items[i])
    //         if (item.type === "DIR") {
                
    //             tree.push({
    //                 "roleName": item.name,
    //                 "roleId": "role2",
    //                 "children": []
    //             })

    //              var childrens = loadChildren(item)
    //             console.log(childrens)
    //             var res = recursive_aux(childrens, tree[i].children);

    //         } else if (item.type === "FILE") {
    //             tree.push({
    //                 "roleName": item.name,
    //                 "roleId": "role2",
    //                 "children": []
    //             })
    //             return;
    //         }
            
    //     }
    // }
   
   asyncLoad($scope.fs.current);
    var tree = [];
   $scope.roleList = $scope.roleList1;

    


};
