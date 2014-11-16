'use strict';

var ConfigsController = function($scope, $rootScope, $modalInstance, $state, $stateParams, $log, $location, FS, FormatService, launcherService) {
    
    $scope.myModel = {
        "firefox": true,
        "chrome": false,
        "IE": true,
        "safari": true

    };

    $scope.format = function(props) {

        var path = props.relativeUri || props;

        FormatService.file(path).success(function(data) {
          console.debug(data);
        }).error(function(data) {
          console.debug("error", data);
        });
    }

     $scope.formatDirectory = function(props) {

        var path = props.relativeUri || props;

        FormatService.directory(path).success(function(data) {
          console.debug(data);
        }).error(function(data) {
          console.debug("error", data);
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
