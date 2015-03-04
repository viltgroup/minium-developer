'use strict';

angular.module('minium.developer')
    .controller('EditorAreaMultiTabController', function($scope, $interval,$timeout, $modal, $state, $stateParams, MiniumEditor, launcherService, EvalService, FeatureFacade, SessionID, GENERAL_CONFIG, WebDriverFactory, openTab, cumcumberLauncher) {

        //initialize the service to manage the instances
        var editors = MiniumEditor;
        editors.init($scope);


        //to know when the execution was stopped
        //inicialize a false
        $scope.executionWasStopped = false;
        
        /**
         * Initialize tabs
         */
        var tabs = $('#tabs').tabs({
            beforeActivate: function(event, ui) {
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
            closeTab($(this));
        });

        var closeTab = function(elem) {
            var tabUniqueId = elem.parent().attr('data-id');
            var dirty = editors.isDirty(tabUniqueId);
            if (dirty === true) {
                //the editor is dirty so check if the user 
                var answer = confirm(GENERAL_CONFIG.UNSAVED_MSG);
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
            var openTabs = openTab.load();
            for (var i = 0; i < openTabs.length; i++) {
                $scope.loadFile(openTabs[i]);
            }
            return openTabs;
        }

        if ($stateParams.path) {
            tabLoader();
            //wait for every files load
            $scope.loadFile($stateParams.path);
            // setTimeout(, 5000);
        } else {
            var openTabs = tabLoader();
            //if theres no open tabs, open one
            // if (openTabs.size() === 0)
                $scope.loadFile("");
        }

        //create an empty editor
        $scope.addEmptyTab = function() {
            $scope.loadFile("");
            editors.getEditors();
        }

        //set the theme of the editor
        $scope.setTheme = function(themeName) {
            editors.setTheme($scope.active.session, themeName);
        }

        /**
         * WEBSOCKETS
         */
        $scope.tests = {};
        $scope.cenas = 0;
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

            var session_id;
            var socket = new SockJS("/app/ws");
            var stompClient = Stomp.over(socket);

            //get the sessionID in the server 
            //to use it for private sockets
            //workflow : 
            //1- get the sessionID in the server
            //2- wait for the response 
            //3- subscribe to a websocket with the sessionID fetched
            // TODO: Need a better solution
            SessionID.sessionId().then(function(data) {
                session_id = data;

                stompClient.connect({}, function(frame) {
                    var suffix = frame.headers;

                    stompClient.subscribe("/tests/" + session_id, function(message) {
                        var body = message.body;
                        var testMessage = eval('(' + body + ')');

                        switch (testMessage.type) {
                            case "total":
                                $scope.cenas = testMessage.body;
                                break;
                            case "failing":
                                $scope.tests.failing = $scope.tests.failing + "\n\n\n" + testMessage.body;
                                $scope.isFailing = true;
                                break;
                            case "passed":
                                $scope.testsExecuted = $scope.testsExecuted + 1;
                                $scope.tests.passed = testMessage.body;
                                //alert("tests.executed " + ($scope.testsExecuted ))
                                break;
                            default: //do nothing
                        }
                        $scope.$apply();
                    });

                    var range = ace.require('ace/range').Range;

                    stompClient.subscribe("/cucumber/" + session_id, function(message) {
                        var step = JSON.parse(message.body);
                        var markerId;
                        switch (step.status) {
                            case "failed":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "failed");
                                break;
                            case "passed":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "passed");
                                break;
                            case "executing":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "breakpoint");
                                break;
                            case "undefined":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "undefined");
                                break;
                            case "snippet":
                                snippetsForUndefinedSteps.push(step.name);
                                break;
                            default: //do nothing
                        }
                    });
                });
            }, function(errorPayload) {
                //the promise was rejected
                toastr.error(GENERAL_CONFIG.ERROR_MSG.SOCKET_CONNECT)
            });
        };



        /**
         * Clean the scope of the engine
         */
        $scope.cleanScriptEngineScope = function() {
            EvalService.clean();
        }




        $scope.launchAll = function() {
            //if no file is selected
            if ($scope.active.selected.item === undefined)
                return;

            var launchParams = {
                fileProps: $scope.active.selected.item.fileProps
            };

            $scope.launch(launchParams);
        }

        var annotations = [];
        var executionWasStopped;
        var reLaunchParams;
        $scope.launch = function(launchParams) {
            reLaunchParams = launchParams;
            $scope.launchTestSession = $scope.active.session;
            //check if the test already executing
            if ($scope.testExecuting == true) {
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_EXECUTING);
                return;
            }
            /*
             * check if a webdriver if launched
             */
            WebDriverFactory.isCreated().success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                //put a lock in test execution
                launchTest(launchParams);
                $scope.setWebDriverMsg(false);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //set the modal select webdriver 
                //now the modal wil be launch with an error message
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

            toastr.success(GENERAL_CONFIG.MSG.TEST_STARTED);
            // clear markers
            $scope.clearMarkers();

            //reset the variable
            executionWasStopped = false;
            snippetsForUndefinedSteps = [];

            $("#status").removeClass().addClass("").html("Running");

            /*
            Cucumber launcher to launch the test
             */
            cumcumberLauncher.launch(launchParams, executionWasStopped, snippetsForUndefinedSteps, $scope.faillingSteps, $scope.resultsSummary, $scope.launchTestSession)
                .then(function(data) {
                        feature = data.feature;
                        $scope.faillingSteps = data.faillingSteps;
                        $scope.resultsSummary = data.resultsSummary;
                    },
                    function(data) {
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
                templateUrl: 'minium.developer/views/editor.area/modal/launch.html',
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

        $scope.openModalWebDriverSelect = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "minium.developer/views/editor.area/modal/configs.html",
                controller: "WebDriversController",
                size: size,
                resolve: {
                    error: function() {
                        return $scope.webDriverError;
                    }
                }
            });

            modalInstance.result.then(function(value) {
                $scope.setWebDriverMsg(value);
                if (relaunch) {
                    launchTest(reLaunchParams);
                }
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        //////////////////////////////////////////////////////////////////
        // EVENT HANDLER  CTLR + P 
        // to Search a file
        //////////////////////////////////////////////////////////////////
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 80 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                //your implementation or function calls
                // $state.transition();
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
