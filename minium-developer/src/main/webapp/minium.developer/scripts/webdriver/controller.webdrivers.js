'use strict';
angular.module('minium.developer')
    .controller('WebDriversController', function($scope, $rootScope, $modalInstance, $state, $stateParams, $log, $location, FS, launcherService, WebDriverFactory, error, GENERAL_CONFIG) {

        if (error) {
            $scope.error = true;
            $scope.errorMessage = GENERAL_CONFIG.WEBDRIVER.NOTLAUNCHED;
            error = undefined;
        }




        $scope.browsers = {
            "Chrome": {
                displayName: "Chrome",
                shortDisplayName: "chrome",
                icon: "icon-chrome"
            },
            "Firefox": {
                displayName: "Firefox",
                shortDisplayName: "firefox",
                icon: "icon-firefox"
            },
            "InternetExplorer": {
                displayName: "Internet Explorer",
                shortDisplayName: "internet explorer",
                icon: "icon-ie"
            },
            "Opera": {
                displayName: "Opera",
                shortDisplayName: "opera",
                icon: "icon-opera"
            },
            "Safari": {
                displayName: "Safari",
                shortDisplayName: "safari",
                icon: "icon-compass"
            },
            "PhantomJS": {
                displayName: "PhantomJS",
                shortDisplayName: "phantomjs",
                icon: "icon-globe"
            }

        };



        $scope.selectBrowser;
        $scope.isProcessing = false;
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
            //functions needed to be here
            var creatingWebDriver = Ladda.create(document.querySelector('#createWebDriver'));
            $scope.isProcessing = true;
            creatingWebDriver.start();
            var config = {
                desiredCapabilities: {
                    browserName: $scope.selectBrowser
                }
            };

            WebDriverFactory.create(config).success(function() {
                toastr.success("Created a WebDriver");
                $scope.$close(false);

            }).error(function(data) {
                creatingWebDriver.stop();
                toastr.error('Could not create a new WebDriver!!');
            });
        }

    });
