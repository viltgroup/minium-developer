'use strict';
var EditorAreaMultiTabController = function($scope, $log, $timeout, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, FeatureFacade, FileFactory, FileLoader) {

    var runningTest = Ladda.create(document.querySelector('#runningTest'));

    //open modal to see the execution state
    $scope.openExecution = function(argument) {
        $('#screenShotsModal').modal({
            show: true
        });
    }

    $scope.image = {};
    $scope.takeScreenShot = function(argument) {
        $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
    };

    $scope.markerIds = [];
    $scope.hasBreakPoints = false;
    $scope.clearMarkers = function() {
        // $scope.markerIds.forEach(function(markerId) {
        //     activeSession.session.removeMarker(markerId);
        // });
        // $scope.markerIds = [];
        activeSession.getSession().clearBreakpoints();
        activeSession.getSession().setAnnotations([]);
    }

    //initialize the service to manage the instances
    var editors = MiniumEditor;

    editors.init($scope);

    //to know when the execution was stopped
    //inicialize a false
    $scope.executionWasStopped = false;

    //stops a launch execution
    $scope.stopLaunch = function() {
        launcherService.stop().success(function() {
            $scope.onFinishTestExecution();
            $scope.executionWasStopped = true;
            //toastr.warning("Test was stopped!!")
        });
    };

    $scope.onFinishTestExecution = function(annotations) {
        //stop button NEED TO INSERT
        runningTest.stop();
        //$('#screenShotsModal').modal('hide');
        //$('#launchModal').modal('show');
        console.log(annotations)
        launchTestSession.getSession().setAnnotations(annotations);
        //remove the lock in test execution
        $scope.testExecuting = false;
    }

    $scope.resultsSummary = {};


    //init variables
    $scope.testExecuting = false;
    //mode of the open file
    $scope.mode = "";

    //store the active instance of the editor
    var activeSession = null;
    //store the editor where the test are launched 
    var launchTestSession = null;

    var activeID = null;
    /**
     * Initialize tabs
     */
    var tabs = $('#tabs').tabs({
        beforeActivate: function(event, ui) {
            var tabId = ui.newPanel.attr('data-tab-id');
            var editor = editors.getSession(tabId);

            if (editor !== null) {
                //console.log(editor)
                activeSession = editor.instance;
                $scope.selected.item = editor.selected;
                activeID = editor.id;
                activeSession.focus();

                //console.log($scope.selected.item)
                //set the mode
                $scope.mode = editor.mode;
                $state.go("global.multi", {
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
            var answer = confirm('If you leave this page you are going to lose all unsaved changes, are you sure you want to leave?');
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

    $scope.selected = {};

    //load the file and create a new editor instance with the file loaded
    $scope.loadFile = function(props) {

        var promise = FileLoader.loadFile(props, editors);

        promise.then(function(result) {

            var newEditor = result;
            //console.log(newEditor)
            activeSession = newEditor.instance;
            activeSession.focus();
            $scope.selected.item = newEditor.selected;
            activeID = newEditor.id;
            $scope.mode = newEditor.mode;
        }, function(errorPayload) {
            //TODO
        });

    };



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

    $scope.multiTab = true;

    $scope.setTheme = function(themeName) {
        editors.setTheme(activeSession, themeName);
    }

    $scope.getSelected = function() {
        //console.log(activeSession);
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
        stompClient.connect({}, function(frame) {

            //console.log(frame);
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

            stompClient.subscribe('/user/messages', function(msg) {
                alert(msg.body);
            });


            stompClient.subscribe("/cucumber/" + session_id, function(message) {
                //console.log(message.body);
                var step = JSON.parse(message.body);
                var markerId;
                switch (step.status) {
                    case "failed":
                        editors.hightlightLine((step.line - 1), launchTestSession, "failed");
                        // markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "error_line", "fullLine");
                        break;
                    case "passed":
                        editors.hightlightLine((step.line - 1), launchTestSession, "passed");
                        //markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "success_line", "fullLine");
                        break;
                    case "executing":
                        editors.hightlightLine((step.line - 1), launchTestSession, "breakpoint");
                        // markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 5), "executing_line", "line");
                        //breakpoint(step.line - 1);
                        break;
                    case "undefined":
                        editors.hightlightLine((step.line - 1), launchTestSession, "undefined");
                        //markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 2), "undefined_line", "line");
                        break;
                    default: //do nothing
                }
                $scope.hasBreakPoints = true;
                // if (markerId) $scope.markerIds.push(markerId);
            });

        });
    };

    /**
     * Save the file of active session
     *
     */
    $scope.saveFile = function() {
        // //console.log(activeSession)
        // return;
        editors.saveFile(activeSession);
    }

    /**
     * Open Selector Gadget
     *
     */
    $scope.activateSelectorGadget = function() {
        if ($scope.mode == editors.modeEnum.JS) {
            editors.activateSelectorGadget(activeSession);
        }
    }

    /**
     * Evaluate Expression
     */
    $scope.evaluate = function() {
        if ($scope.mode == editors.modeEnum.JS) {
            editors.evaluate(activeSession);
        }
    }

    /**
     * LAUnch test
     */
    $scope.launchCucumber = function() {
        editors.launchCucumber(activeSession);
    }



    /**
     *   Tree view  controller
     */

    $scope.dataForTheTree = [];

    $scope.fs = {
        current: {}
    };
    var firstLoad = true;
    var asyncLoad = function(node) {

        var params = {
            path: node.relativeUri || ""
        };
        node.children = FS.list(params, function() {
            _.each(node.children, function(item) {
                // tree navigation needs a label property
                item.label = item.name;
                if (firstLoad) {
                    $scope.dataForTheTree.push(item);
                }
            });
            firstLoad = false;
        });
        // //console.log($scope.fs.current.children)
    };

    var loadChildren = function(item) {
        // if (item.childrenLoaded) return;
        asyncLoad(item);
        // item.childrenLoaded = true;
    };

    $scope.selectedNode = "";
    $scope.expandedNodes = [];
    //console.log($scope.expandedNodes);
    $scope.showSelected = function(node) {

        $scope.selectedNode = node;
        //console.log($scope.selectedNode)
        if (node.type == "FILE") {
            $scope.loadFile($scope.selectedNode.relativeUri);
            $state.go("global.multi", {
                path: $scope.selectedNode.relativeUri
            }, {
                location: 'replace', //  update url and replace
                inherit: false,
                notify: false
            });
        } else {
            loadChildren(node);
            //expand the node
            $scope.expandedNodes.push(node)
        }

    };

    $scope.showToggle = function(node, expanded) {
        //console.log(node.children)
        loadChildren(node);
    };

    console.debug($scope.fs.current)
    asyncLoad($scope.fs.current);

    /**
     * REFACTOR THIS URGENT
     * NEED TO PUT IT in another controller and have parallel states
     */


    // //extends the fileController
    // $controller('FileController', {
    //     $scope: $scope
    // });

    // $scope.fileName = "";

    // $scope.createFile = function(fileName, path) {   
    //     var fs = path || "";
    //     FileFactory.create(fs + fileName).success(function() {
    //         $scope.asyncLoad($scope.fs.current);
    //         toastr.success("Created file " + $scope.fileName);

    //         $scope.loadFile(fs + fileName);
    //         $state.go("global.multi", {
    //             path: (fs + fileName)
    //         }, {
    //             location: 'replace', //  update url and replace
    //             inherit: false,
    //             notify: false
    //         });

    //         editors.setSession(activeID,(fs + fileName))
    //         $scope.fileName = "";
    //         $('#NewFileModal').modal('hide');
    //     }).error(function(data) {
    //         toastr.error("Error " + data);
    //     });
    // }


    /**
     * NAVIGATION FOLDERS Functions
     */
    $scope.opts = {
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            isFeature: "a2",
            label: "a6",
            labelSelected: "a8"
        },
        isLeaf: function(node) {
            if (node.type === "DIR")
                return false;
            else
                return true;
        },
        isFeature: function(node) {
            if (node.type === "DIR")
                return false;
            else
                return true;
        },
        dirSelectable: false
    };

    $scope.collapseAll = function() {
        $scope.expandedNodes = [];
    };


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

        launchTestSession = activeSession;
        //check if the test already executing
        if ($scope.testExecuting == true) {
            toastr.error("A test is already running!!");
            return;
        }

        //put a lock in test execution
        $scope.testExecuting = true;

        //init values for live results
        $scope.tests.total;
        $scope.testsExecuted = 0;
        $scope.isFailing = false;

        toastr.success("Test Started...");
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
            var feature = new FeatureFacade(data);
            console.debug(feature);
            $scope.faillingSteps = feature.notPassingsteps;

            $scope.resultsSummary.passed = feature.passedSteps.length;
            $scope.resultsSummary.failures = feature.failingSteps.length;
            $scope.resultsSummary.skipped = feature.skippedSteps.length;

            $scope.resultsSummary.runCount = feature.passedSteps.length + feature.notPassingsteps.length;

            // //convert in millisecond
            $scope.resultsSummary.runTime = feature.totalDuration / 1000000.0;

            console.debug(feature.notPassingsteps);

            annotations = _.map(feature.notPassingsteps, function(step) {
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
                toastr.warning("Test didn't pass!!");
                $("#runningTest").removeClass("btn-warning").addClass("btn-danger");
                $("#status").removeClass().addClass("").html("Failing");
            } else {
                if ($scope.resultsSummary.runCount == 0) {
                    //no test were run
                    $("#status").removeClass().addClass("").html("No tests executed");
                    toastr.error("No test executed");
                } else {
                    $("#runningTest").removeClass("btn-warning").addClass("btn-success");

                    $("#status").removeClass().addClass("").html("Passed");
                    toastr.success("Test Pass with Sucess");
                }

                annotations.push({
                    row: launchParams.line,
                    text: 'Test Executed and Pass',
                    type: 'info'
                });

            }

            $scope.onFinishTestExecution(annotations);


        }).error(function() {
            $scope.stopLaunch();
            toastr.error("Oops, something went wrong.");
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
            $state.go("global.multi.open");
        }
    }, false);

};
