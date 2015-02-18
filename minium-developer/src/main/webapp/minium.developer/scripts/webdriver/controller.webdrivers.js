'use strict';
angular.module('minium.developer')
    .controller('WebDriversController', function($scope, $rootScope, $modalInstance, $state, $stateParams, $log, $location, FS, launcherService, WebDriverFactory, error, GENERAL_CONFIG) {

        if (error) {

            $scope.error = true;
            $scope.errorMessage = GENERAL_CONFIG.WEBDRIVER.NOTLAUNCHED;
        }


        $scope.browsers = {
            "Chrome": {
                displayName: "Chrome",
                shortDisplayName: "Chrome",
                icon: "icon-chrome"
            },
            "Firefox": {
                displayName: "Firefox",
                shortDisplayName: "Firefox",
                icon: "icon-firefox"
            },
            "InternetExplorer": {
                displayName: "Internet Explorer",
                shortDisplayName: "IE",
                icon: "icon-ie"
            },
            "Opera": {
                displayName: "Opera",
                shortDisplayName: "Opera",
                icon: "icon-opera"
            },
            "Safari": {
                displayName: "Safari",
                shortDisplayName: "Safari",
                icon: "icon-safari"
            },
            "PhantomJS": {
                displayName: "PhantomJS",
                shortDisplayName: "PhantomJS",
                icon: "icon-"
            }

        };


        $scope.browsers_radio = [{
            id: 1,
            name: "Firefox"
        }, {
            id: 2,
            name: "Chrome"
        }, {
            id: 3,
            name: "IE"
        }, {
            id: 4,
            name: "Opera"
        }];
        $scope.selectBrowser = 1;

        $scope.idProperty = "shortDisplayName";
        $scope.nameProperty = "displayName";
        $scope.bootstrapSuffix = "default";

        $scope.ok = function() {
            $scope.$close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

        $scope.createWebDriver = function() {
            var config = {
                desiredCapabilities : {
                    browserName : "chrome"
                }
            };
            WebDriverFactory.create(config).success(function() {
                toastr.success("Created");
            }).error(function(data) {
                alert(JSON.stringify(data));
                toastr.error('Could not create a new WebDriver!!');
            });
        }

    });
