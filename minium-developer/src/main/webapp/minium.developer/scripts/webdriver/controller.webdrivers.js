'use strict';
angular.module('minium.developer')
    .controller('WebDriversController', function($rootScope, $scope, $translate, $filter, $modalInstance, $state, $stateParams, WebDriverFactory, error) {

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

        $scope.selectedBrowser = undefined;

        // TODO- put this in a directive
        $scope.isActive = function(webdriver) {
            return $scope.selectedBrowser ? ($scope.selectedBrowser.name === webdriver.name) : false;
        };


        $scope.activate = function(webdriver) {
            if (!$scope.isActive(webdriver)) {
                $scope.selectedBrowser = webdriver;
            }
        };

        $scope.getIcon = function(webdriver) {
            return webdriver.iconClass || "icon-globe";
        }

        $scope.advancedCapabilities = false;
        $scope.useRemoteWebDriver = false;
        $scope.remoteWebDriverUrl = "";
        $scope.advancedCapabilitiesConfig = "";
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

            if ($scope.advancedCapabilities) {

                // if user choose insert JSON Configuration
                if (IsValidJsonString($scope.advancedCapabilitiesConfig)) {
                    var objectConfig = JSON.parse($scope.advancedCapabilitiesConfig);
                    config = $scope.advancedCapabilitiesConfig;
                } else {
                    toastr.error($translate('webdriver.json_invalid'));
                    creatingWebDriver.stop();
                    return;
                }
            } else if ($scope.useRemoteWebDriver) {
                $scope.selectedBrowser.url = $scope.remoteWebDriverUrl,
                    config = $scope.selectedBrowser;

            } else {
                $scope.selectedBrowser.desiredCapabilities = $scope.selectedBrowser.desiredCapabilities[0];
                config = $scope.selectedBrowser;
            }

            WebDriverFactory.create(config).success(function() {
                toastr.success($translate('webdriver.new'));
                $scope.$close(false);
            }).error(function() {
                creatingWebDriver.stop();
                toastr.error($translate('webdriver.error_creating'));
            });
        }

        $scope.validateJSON = function() {
            if (!IsValidJsonString($scope.advancedCapabilitiesConfig)) {
                $scope.advancedWebDriverForm.jsonConfig.$setValidity('validJson', false);
            } else {
                $scope.advancedWebDriverForm.jsonConfig.$setValidity('validJson', true);
            }

        }

        function IsValidJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        $scope.formIsInvalid = function() {

            // if returns TRUE the button will be disabled
            if ($scope.advancedCapabilities) {
                return $scope.selectedBrowser === undefined || $scope.isProcessing === true || $scope.advancedCapabilitiesConfig == '' || $scope.advancedWebDriverForm.jsonConfig.$error.validJson;
            } else if($scope.useRemoteWebDriver) {
                return $scope.selectedBrowser === undefined || $scope.isProcessing === true || $scope.remoteWebDriverUrl == '' ;
            } else{
                return $scope.selectedBrowser === undefined || $scope.isProcessing === true ;
            }
        }


        $scope.addDefaultJson = function() {
            var defaultJsonConfig = {
                url: '<url>',
                desiredCapabilities: {
                    browserName: '<browserName>',
                    version: '<version>'
                }
            };
            $scope.advancedCapabilitiesConfig = JSON.stringify(defaultJsonConfig,null, "\t");
        }

    });
