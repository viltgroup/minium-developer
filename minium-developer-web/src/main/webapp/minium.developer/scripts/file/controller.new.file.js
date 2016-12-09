'use strict';

angular.module('minium.developer')
    .controller('NewFileController', function($scope, $modalInstance, $state, $controller, $stateParams, $log, $location, FS, FileManager, launcherService, MiniumEditor) {

        //extends the fileController
        $controller('FileController', {
            $scope: $scope
        });
        $scope.fileName = "";

        var parentScope = MiniumEditor.getScope();

        // if (parentScope.active.selectedNode !== "" && parentScope.active.selectedNode.type !== "FILE") {
        //     $scope.fs.current = parentScope.active.selectedNode;
        //     // $scope.loadChildren(parentScope.selectedNode);
        // }else{
        //     $scope.asyncLoad($scope.fs.current);
        // }

        $scope.asyncLoad($scope.fs.current);
        $scope.createFile = function(fileName, path) {
            var fs = $scope.fs.current.relativeUri || "";
            
            FileManager.create(fs + fileName).success(function(data) {
                //$scope.asyncLoad($scope.fs.current);
                toastr.success("Created file " + $scope.fileName);
                $scope.fileName = "";
                //reload the children where the file was created
                $scope.loadChildren($scope.fs.current);
                $scope.$close(true);
            }).error(function(data) {
                toastr.error("Error " + data);
            });
        }

        $scope.ok = function() {
            $scope.$close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

    });
