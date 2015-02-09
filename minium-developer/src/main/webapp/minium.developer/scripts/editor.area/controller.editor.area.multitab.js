'use strict';

angular.module('minium.developer')
    .controller('EditorAreaMultiTabController', function($rootScope, $scope, $log, $timeout, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, EvalService, FeatureFacade, FileFactory, FileLoader, SessionID, GENERAL_CONFIG) {

        //initialize the service to manage the instances
        var editors = MiniumEditor;
        editors.init($scope);

        //functions needed to be here
        var runningTest = Ladda.create(document.querySelector('#runningTest'));

         //to know when the execution was stopped
        //inicialize a false
        $scope.executionWasStopped = false;
        //image to take screenshots
        $scope.image = {}; 

        //open modal to see the execution state
        $scope.openExecution = function(argument) {
            $('#screenShotsModal').modal({
                show: true
            });
        }

        
        $scope.takeScreenShot = function(argument) {
            $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
        };

        
        $scope.clearMarkers = function() {
            $scope.activeSession.getSession().clearBreakpoints();
            $scope.activeSession.getSession().setAnnotations([]);
        }
       
        //stops a launch execution
        $scope.stopLaunch = function() {
            launcherService.stop().success(function() {
                $scope.onFinishTestExecution();
                $scope.executionWasStopped = true;
                //toastr.warning("Test was stopped!!")
            });
        };

        //executed after the test execution
        //chnage the flag of execution test
        $scope.onFinishTestExecution = function(annotations) {
            //stop button NEED TO INSERT
            runningTest.stop();
            //$('#screenShotsModal').modal('hide');
            //$('#launchModal').modal('show');

            if (annotations)
                $scope.launchTestSession.getSession().setAnnotations(annotations);
            //remove the lock in test execution
            $scope.testExecuting = false;
        }


        /**
         * Initialize tabs
         */
        
        var tabs = $('#tabs').tabs({
            beforeActivate: function(event, ui) {
                var tabId = ui.newPanel.attr('data-tab-id');
                var editor = editors.getSession(tabId);

                if (editor !== null) {
                    //console.log(editor)
                    $scope.activeSession = editor.instance;
                    $scope.selected.item = editor.selected;
                    $scope.activeID = editor.id;
                    $scope.activeSession.focus();

                    //console.log($scope.selected.item)
                    //set the mode
                    $scope.mode = editor.mode;
                    $state.go("global.editorarea.sub", {
                        path: editor.relativeUri
                    }, {
                        location: 'replace', //  update url and replace
                        inherit: false,
                        notify: false
                    });
                }
            }
        });

        // close icon: removing the tab on click
        tabs.delegate("span.ui-icon-close", "click", function() {
            //console.log($(this).parent());
            var tabUniqueId = $(this).parent().attr('data-id');
            var dirty = editors.isDirty(tabUniqueId);
            if (dirty === true) {
                //the editor is dirty so check if the user 
                var answer = confirm(GENERAL_CONFIG.UNSAVED_MSG);
                if (answer) {
                    editors.closeTab(tabUniqueId, tabs, $(this));
                }
            } else {
                editors.closeTab(tabUniqueId, tabs, $(this));
            }

            if (editors.size() == 0) {
                $scope.addEmptyTab();
            }
        });

        $scope.getSession = function() {
            console.log($scope.selected.item)
        }

        if ($stateParams.path) {
            $scope.loadFile($stateParams.path);
        } else {
            $scope.loadFile("");
        }

        //create an empty editor
        $scope.addEmptyTab = function() {
            $scope.loadFile("");
            editors.getEditors();
        }

        $scope.setTheme = function(themeName) {
            editors.setTheme($scope.activeSession, themeName);
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

        $scope.subscribeMessages = function() {

            if (isAlreadySubscribed)
                return;

            isAlreadySubscribed = true;

            var session_id = $scope.readCookie("JSESSIONID");
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
                        //console.log(message.body);
                        var step = JSON.parse(message.body);
                        var markerId;
                        switch (step.status) {
                            case "failed":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "failed");
                                // markerId = $scope.activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "error_line", "fullLine");
                                break;
                            case "passed":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "passed");
                                //markerId = $scope.activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "success_line", "fullLine");
                                break;
                            case "executing":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "breakpoint");
                                // markerId = $scope.activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 5), "executing_line", "line");
                                //breakpoint(step.line - 1);
                                break;
                            case "undefined":
                                editors.hightlightLine((step.line - 1), $scope.launchTestSession, "undefined");
                                //markerId = $scope.activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 2), "undefined_line", "line");
                                break;
                            default: //do nothing
                        }
                    });
                });
            });
        };

        /**
         * Save the file of active session
         *
         */
        $scope.saveFile = function() {
            editors.saveFile($scope.activeSession);
        }

        /**
         * Open Selector Gadget
         *
         */
        $scope.activateSelectorGadget = function() {
            if ($scope.mode == editors.modeEnum.JS) {
                editors.activateSelectorGadget($scope.activeSession);
            }
        }

        /**
         * Evaluate Expression
         */
        $scope.evaluate = function() {
            if ($scope.mode == editors.modeEnum.JS) {
                editors.evaluate($scope.activeSession);
            }
        }

        /**
         * Clean the scope of the engine
         */
        $scope.cleanScriptEngineScope = function() {
            EvalService.clean();
        }

        /**
         * LAUnch test
         */
        $scope.launchCucumber = function() {
            editors.launchCucumber($scope.activeSession);
        }

        //functions used in the 2 modules
        $scope.isEmptyObject = function(obj) {

            if (obj.length && obj.length > 0)
                return false;

            if (obj.length === 0)
                return true;
        }

        $scope.launchAll = function() {
            //if no file is selected
            if ($scope.selected.item === undefined)
                return;

            var launchParams = {
                fileProps: $scope.selected.item.fileProps
            };

            $scope.launch(launchParams);
        }

        var annotations = [];
        var executionWasStopped;
        $scope.launch = function(launchParams) {

            $scope.launchTestSession = $scope.activeSession;
            //check if the test already executing
            if ($scope.testExecuting == true) {
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_EXECUTING);
                return;
            }

            //put a lock in test execution
            $scope.testExecuting = true;

            //init values for live results
            $scope.tests.total;
            $scope.testsExecuted = 0;
            $scope.isFailing = false;

            toastr.success(GENERAL_CONFIG.MSG.TEST_STARTED);
            runningTest.start();
            $scope.tests = {};

            //start to take screenshots
            $scope.takeScreenShot();

            // clear markers
            $scope.clearMarkers();

            //reset the variable
            executionWasStopped = false;

            $("#status").removeClass().addClass("").html("Running");

            launcherService.launch(launchParams).success(function(data) {

                //if execution was stopped there's no need to execute the block
                if (executionWasStopped == true) return;

                console.log(data)
                    //check if the data is valid
                if (data === undefined || data === "") {
                    $scope.stopLaunch();
                    toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
                    return;
                }

                var feature = new FeatureFacade(data);

                $scope.faillingSteps = feature.notPassingsteps;

                $scope.resultsSummary = feature.resultsSummary;

                console.debug(feature.resultsSummary);

                annotations = _.map(feature.resultsSummary.notPassingsteps, function(step) {
                    var result = step.status;
                    var msg = result === 'FAILED' ? step.errorMessage : 'Skipped';
                    var lines = msg;

                    return {
                        row: step.line - 1,
                        text: msg,
                        type: (result === 'FAILED' ? 'error' : 'warning')
                    };
                });

                if (annotations.length > 0) {
                    toastr.warning(GENERAL_CONFIG.TEST.FAILING);
                    $("#runningTest").removeClass("btn-warning").addClass("btn-danger");
                    $("#status").removeClass().addClass("").html("Failing");
                } else {
                    if ($scope.resultsSummary.runCount == 0) {
                        //no test were run
                        $("#status").removeClass().addClass("").html(GENERAL_CONFIG.TEST.NOT_EXECUTED);
                        toastr.error("No test executed");
                    } else {
                        $("#runningTest").removeClass("btn-warning").addClass("btn-success");

                        $("#status").removeClass().addClass("").html("Passed");
                        toastr.success(GENERAL_CONFIG.TEST.PASS);
                    }

                    annotations.push({
                        row: launchParams.line,
                        text: GENERAL_CONFIG.TEST.EXECUTED_PASSED,
                        type: 'info'
                    });

                }

                $scope.onFinishTestExecution(annotations);


            }).error(function() {
                $scope.stopLaunch();
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
            });
        }

        $('#miniumOnDrugs').click(function() {
            $(".navbar-brand").css('background', 'url(images/minium_loader.gif) no-repeat left center');
            $(".navbar-brand").css('background-color', '#367fa9');
            $(".navbar-brand").css('color', '#f9f9f9');
        });

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


        $scope.readCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        //functions used in the 2 modules
        $scope.isEmpty = function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        }

    });
