'use strict';

var NewFileController = function($scope, $modalInstance, $state, $controller, $stateParams, $log, $location, FS, FileFactory, FormatService, launcherService) {

    //extends the fileController
    $controller('FileController', {
        $scope: $scope
    });
    $scope.fileName = "";

    $scope.createFile = function(fileName, path) {
        var fs = path || "";
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
