'use strict';
angular.module('minium.developer')
    .controller('WebDriversController', function($rootScope, $scope, $translate, $filter, $modalInstance, $state, $stateParams, $log, $location, FS, launcherService, WebDriverFactory, error) {

        var $translate = $filter('translate');
        if (error) {
            $scope.error = true;
            $scope.errorMessage = $translate('webdriver.not_launched');
            error = undefined;
        }

        var OS = {
            MAC: 'mac',
            LINUX: 'linux',
            WINDOWS: 'windows'
        };

        var allBrowsers = {
            "CHROME": {
                displayName: "Chrome",
                shortDisplayName: "chrome",
                icon: "icon-chrome",
                os: [OS.MAC, OS.WINDOWS, OS.LINUX]
            },
            "FIREFOX": {
                displayName: "Firefox",
                shortDisplayName: "firefox",
                icon: "icon-firefox",
                os: [OS.MAC, OS.WINDOWS, OS.LINUX]
            },
            "IE": {
                displayName: "Internet Explorer",
                shortDisplayName: "internet explorer",
                icon: "icon-ie",
                os: [OS.WINDOWS]
            },
            "SAFARI": {
                displayName: "Safari",
                shortDisplayName: "safari",
                icon: "icon-compass",
                os: [OS.MAC]
            },
            "PHANTOMJS": {
                displayName: "PhantomJS",
                shortDisplayName: "phantomjs",
                icon: "icon-globe",
                os: [OS.MAC, OS.WINDOWS, OS.LINUX]
            }

        };

        $scope.browsers = {};
        /**
         * Filter browsers by current OS
         * 
         */
        var filterBrowsersByOS = function() {

            // if it cannot get the browser OS
            if (!$rootScope.availableWebDrivers) {
                $scope.browsers = allBrowsers;
                return;
            }

            for (var key in allBrowsers) {
                if ($rootScope.availableWebDrivers.indexOf(key) != -1) {
                    $scope.browsers[key] = allBrowsers[key];
                }
            }
        }

        $scope.selectBrowser;
        $scope.isProcessing = false;

        $scope.idProperty = "shortDisplayName";
        $scope.nameProperty = "displayName";
        $scope.bootstrapSuffix = "default";

        $scope.remoteWebDriverUrl = "";
        $scope.useRemoteWebDriver = false;
        $scope.toggleText = $translate('webdriver.use_remote');

        $scope.ok = function() {
            $scope.$close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };


        $scope.setRemoteWebDriver = function() {
            $scope.useRemoteWebDriver = !$scope.useRemoteWebDriver;
            $scope.toggleText = $scope.useRemoteWebDriver ? $translate('webdriver.use_local') : $translate('webdriver.use_remote');
        }

        $scope.createWebDriver = function() {
            //functions needed to be here
            var creatingWebDriver = Ladda.create(document.querySelector('#createWebDriver'));
            $scope.isProcessing = true;
            creatingWebDriver.start();
            var config = {};
            if ($scope.useRemoteWebDriver) {
                config = {
                    url: $scope.remoteWebDriverUrl,
                    desiredCapabilities: {
                        browserName: $scope.selectBrowser
                    }
                };
            } else {
                config = {
                    desiredCapabilities: {
                        browserName: $scope.selectBrowser
                    }
                };
            }

            WebDriverFactory.create(config).success(function() {
                toastr.success($translate('webdriver.new'));
                $scope.$close(false);
            }).error(function(data) {
                creatingWebDriver.stop();
                toastr.error($translate('webdriver.error_creating'));
            });
        }

        /////////////////////////////////////////////////////////////////
        // Initializations
        /////////////////////////////////////////////////////////////////
        filterBrowsersByOS();

    });
