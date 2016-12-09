'use strict';

angular.module('minium.developer')
    .controller('EditorAreaMultiTabController', function($rootScope, $scope, $translate, $filter, $q, $interval, $timeout, $modal, $state, $stateParams, MiniumEditor, launcherService, EvalService, FeatureFacade, SessionID, WebDriverFactory, openTab, cumcumberLauncher, Utils) {

        var $translate = $filter('translate');
        //initialize the service to manage the instances
        var editors = MiniumEditor;
        editors.init($scope);

        //to know when the execution was stopped
        //inicialize a false
        $scope.executionWasStopped = false;

        var socket_key;
        /**
         * Initialize tabs
         */
        var tabs = $('#tabs').tabs({
            beforeActivate: function(event, ui) {

                if (event.which == 2) {
                    event.preventDefault();
                    closeTab(ui.newPanel, ui.newPanel.attr('data-tab-id'));
                    return;
                }
                var tabId = ui.newPanel.attr('data-tab-id');
                var editor = editors.getSession(tabId);
                if (editor !== null) {
                    $scope.setActiveEditor(editor);
                }
            }
        });

        /**
         * close icon: removing the tab on click
         */
        tabs.delegate("span.ui-icon-close", "click", function() {
            closeTab($(this), $(this).parent().attr('data-id'));
        });

        var closeTab = function(elem, id) {
            var tabUniqueId = id;
            var dirty = editors.isDirty(tabUniqueId);
            if (dirty === true) {
                //the editor is dirty so check if the user
                var answer = confirm($translate('messages.files.unsaved'));
                if (answer) {
                    editors.closeTab(tabUniqueId, tabs, elem);
                }
            } else {
                editors.closeTab(tabUniqueId, tabs, elem);
            }

            if (editors.size() == 0) {
                $scope.addEmptyTab();
            }
        }

        /**
         * Load the tab from the cookie
         *
         */
        var tabLoader = function() {

            var deferred = $q.defer();
            var arrPromises = [];

            var openTabs = openTab.load();
            var numTabs = 0;

            for (var i = 0; i < openTabs.length; i++) {
                arrPromises[i] = $scope.loadFile(openTabs[i]);
            }

            $q.all(arrPromises).then(function() {
                if ($stateParams.path) {
                    var promise = $scope.loadFile($stateParams.path).then(function(result) {
                        if ($stateParams.line) {
                            $rootScope.activeEditor.instance.gotoLine($stateParams.line);
                        }
                    });
                }
                deferred.resolve();
            });

            return deferred.promise;
        }

        //////////////////////////////////////////////////////////////////
        // INITIALIZATIONS
        //////////////////////////////////////////////////////////////////

        var init = function() {
            //open tabs
            var promise = tabLoader();
            //open the console helper
            $scope.loadFile("");

        }

        init();

        //create an empty editor
        $scope.addEmptyTab = function() {
            $scope.loadFile("");
        }

        //set the theme of the editor
        $scope.setTheme = function(themeName) {
            editors.setTheme($rootScope.activeEditor.instance, themeName);
        }

        /**
         * WEBSOCKETS
         */
        $scope.tests = {};
        $scope.totalTests = 0;
        $scope.testsExecuted = 0;
        $scope.resetTotal = function() {
            //init values for live results
            $scope.tests.total;
            $scope.testsExecuted = 0;
            $scope.isFailing = false;
        }

        //to check if we already made a subscription to the sockets
        //we only need a subscription once
        var isAlreadySubscribed = false;
        var snippetsForUndefinedSteps = [];
        $scope.subscribeMessages = function() {

            if (isAlreadySubscribed)
                return;

            isAlreadySubscribed = true;

            var socket = new SockJS("/app/ws");
            var stompClient = Stomp.over(socket);

            //genarate an id to create a private connection
            socket_key = Utils.generateId();

            stompClient.connect({}, function(frame) {
                var suffix = frame.headers;

                stompClient.subscribe("/tests/" + socket_key, function(message) {
                    var body = message.body;
                    var testMessage = eval('(' + body + ')');
                    $scope.totalTests = message.body;
                    $scope.$apply();
                });

                var range = ace.require('ace/range').Range;

                stompClient.subscribe("/cucumber/" + socket_key, function(message) {
                    var step = JSON.parse(message.body);
                    var markerId;

                    switch (step.status) {
                        case "failed":
                            $scope.testsExecuted = $scope.testsExecuted + 1;
                            $scope.isFailing = true;
                            editors.hightlightLine((step.line - 1), $scope.launchedTestEditor, "failed");
                            break;
                        case "passed":
                            $scope.testsExecuted = $scope.testsExecuted + 1;
                            editors.hightlightLine((step.line - 1), $scope.launchedTestEditor, "passed");
                            break;
                        case "executing":
                            editors.hightlightLine((step.line - 1), $scope.launchedTestEditor, "breakpoint");
                            break;
                        case "undefined":
                            editors.hightlightLine((step.line - 1), $scope.launchedTestEditor, "undefined");
                            break;
                        case "snippet":
                            snippetsForUndefinedSteps.push(step.name);
                            break;
                        case "failed_example":
                            editors.hightlightLine((step.line - 1), $scope.launchedTestEditor, "failed");
                            break;
                        default: //do nothing
                    }
                    $scope.$apply();
                });
            });

        };

        var annotations = [];
        var executionWasStopped;
        var reLaunchParams;
        $scope.launch = function(launchParams) {
            reLaunchParams = launchParams;
            $scope.launchedTestEditor = $rootScope.activeEditor;
            //check if the test already executing
            if ($scope.testExecuting == true) {
                toastr.error($translate('messages.error.test_executing'));
                return;
            }
            /*
             * check if a webdriver if launched
             */
            WebDriverFactory.isCreated().success(function(data, status, headers, config) {
                // when the response is available
                // put a lock in test execution
                launchTest(launchParams);
                $scope.setWebDriverMsg(false);
            }).error(function(data, status, headers, config) {
                // or server returns response with an error status.
                // set the modal select webdriver
                // now the modal wil be launch with an error message
                $scope.setWebDriverMsg(true);
                $scope.openModalWebDriverSelect();
                relaunch = true;
            });
        }

        /**
         * Launch the test with the params
         * @param  {[type]} launchParams [description]
         *
         */

        $scope.stopLaunch = function() {
            cumcumberLauncher.stopLaunch();
        }

        var feature;
        var launchTest = function(launchParams) {

            $scope.testExecuting = true;

            startCheckIfRunning();

            //init values for live results
            $scope.tests.total;
            $scope.testsExecuted = 0;
            $scope.isFailing = false;
            $scope.tests = {};

            toastr.success($translate('messages.info.test_started'));
            // clear markers
            $scope.clearMarkers();

            //reset the variable
            executionWasStopped = false;
            snippetsForUndefinedSteps = [];

            $("#status").removeClass().addClass("").html("Running");

            /*
            Cucumber launcher to launch the test
             */
            cumcumberLauncher.launch(launchParams, executionWasStopped, snippetsForUndefinedSteps, $scope.faillingSteps, $scope.resultsSummary, $scope.launchedTestEditor, socket_key)
                .then(function(data) {
                    feature = data.feature;
                    $scope.faillingSteps = data.faillingSteps;
                    $scope.resultsSummary = data.resultsSummary;
                }, function(data) {
                    console.log(data + 'failed')
                });
        }

        /**
         * Function to check every X seconds if the test is running
         *
         */
        var checkIfRunning;
        var startCheckIfRunning = function() {
            if (angular.isDefined(checkIfRunning)) return;

            checkIfRunning = $interval(function() {
                launcherService.isRunning().then(function(response) {
                    //resposnse should come as a string and be converted in a boolean
                    $scope.testExecuting = JSON.parse(response.data);
                    if ($scope.testExecuting === false) {
                        stopCheckIfRunning();
                    }
                });

            }, 2000);

        }

        //function to stop the interval
        //created to check the status of the build
        var stopCheckIfRunning = function() {
            if (angular.isDefined(checkIfRunning)) {
                $interval.cancel(checkIfRunning);
                checkIfRunning = undefined;
            }
        }

        //////////////////////////////////////////////////////////////////
        //
        // Modals Open
        //
        //////////////////////////////////////////////////////////////////
        $scope.openModalReport = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'minium.developer/views/report/report.html',
                controller: 'ReportController',
                size: size,
                resolve: {
                    featureReport: function() {
                        return feature;
                    }
                }
            });
        };

        $scope.openModalExecution = function(size) {

            var modalInstance = $modal.open({
                templateUrl: 'minium.developer/views/editor.area/modal/execution.html',
                controller: 'ExecutionController',
                size: size,
                resolve: {
                    featureReport: function() {
                        return feature;
                    }
                }
            });
        };

        var relaunch = false;
        $scope.relaunchEval = false;
        $scope.openModalWebDriverSelect = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "minium.developer/views/webdriver/launch.webdriver.html",
                controller: "WebDriversController",
                size: size,
                resolve: {
                    error: function() {
                        return $scope.webDriverError;
                    }
                }
            });

            // when the modal is closed
            // it checks if there's any thing to run
            // this case can happen when we try to launch or evalaute
            // and no web driver is launched
            modalInstance.result.then(function(value) {
                $scope.setWebDriverMsg(value);
                if (relaunch) {
                    launchTest(reLaunchParams);

                    //reset the value
                    relaunch = false;
                } else if ($scope.relaunchEval) {
                    editors.evaluate($scope.activeEditor.instance);
                    $scope.relaunchEval = false;
                }
            });
        };

        //////////////////////////////////////////////////////////////////
        // EVENT HANDLER  CTLR + P
        // to Search a file
        //////////////////////////////////////////////////////////////////
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 80 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                $state.go(".open", {}, {
                    notify: false,
                });
            }
        }, false);

        //functions used in the 2 modules
        $scope.isEmpty = function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        }

    });
