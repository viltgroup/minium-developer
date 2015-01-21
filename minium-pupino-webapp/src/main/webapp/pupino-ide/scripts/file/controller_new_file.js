'use strict';

var NewFileController = function($scope, $modalInstance, $state, $controller, $stateParams, $log, $location, FS, FileFactory, FormatService, launcherService, MiniumEditor) {

    //extends the fileController
    $controller('FileController', {
        $scope: $scope
    });
    $scope.fileName = "";

    var parentScope = MiniumEditor.getScope();

    console.log(parentScope.selectedNode)


    if (parentScope.selectedNode.type !== "FILE") {
        // $scope.fs.current = parentScope.selectedNode;
        // $scope.loadChildren(parentScope.selectedNode);
    }

    $scope.createFile = function(fileName, path) {
        var fs = parentScope.selectedNode.relativeUri || "";
        FileFactory.create(fs + fileName).success(function() {
            $scope.asyncLoad($scope.fs.current);
            toastr.success("Created file " + $scope.fileName);
            $scope.fileName = "";
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

};
