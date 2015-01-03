'use strict';

var ConfigsController = function($scope, $rootScope, $modalInstance, $state, $stateParams, $log, $location, FS, FormatService, launcherService, WebDriverFactory) {


    $scope.browsers = {
        "firefox": true,
        "chrome": false,
        "IE": true,
        "opera": true

    };

    $scope.browsers_radio = [{
        id: 1,
        name: "firefox"
    }, {
        id: 2,
        name: "chrome"
    }, {
        id: 3,
        name: "IE"
    }, {
        id: 4,
        name: "opera"
    }];
    $scope.selectBrowser = 1;

    $scope.idProperty = "id";
    $scope.nameProperty = "name";
    $scope.bootstrapSuffix = "default";

    $scope.ok = function() {
        $scope.$close(true);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.$dismiss();
    };

    $scope.createWebDriver = function() {
        WebDriverFactory.create("wd","Chrome").success(function() {
            toastr.success("Created");
        }).error(function(data) {
            alert(JSON.stringify(data));
            toastr.error('Could not create a new WebDriver!!');
        });
    }


};
