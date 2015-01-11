'use strict';
var EditorAreaMultiTabController = function($scope, $log, $timeout, $modal, $state, $location, $window, $stateParams, MiniumEditor, FS,launcherService,FeatureFacade) {


    var runningTest = Ladda.create(document.querySelector('#runningTest'));

    $scope.image = {};

    $scope.openExecution = function(argument) {
        $('#screenShotsModal').modal({
            show: true
        });
    }

    $scope.takeScreenShot = function(argument) {
        $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
    };

    $scope.markerIds = [];
    $scope.clearMarkers = function() {
        $scope.markerIds.forEach(function(markerId) {
            console.debug(activeSession);
            activeSession.session.removeMarker(markerId);
        });
        $scope.markerIds = [];
        activeSession.getSession().clearBreakpoints();
    }

    
    var editors = new MiniumEditor($scope);

    //to know when the execution was stopped
    //inicialize a false
    $scope.executionWasStopped = false;
    //stops a launch execution
    $scope.stopLaunch = function() {
        launcherService.stop().success(function() {
            toastr.warning("Test Stopped with success!!")
            onFinishTestExecution();
            $scope.executionWasStopped = true;
        });
    };

    $scope.onFinishTestExecution = function(annotations) {
        //stop button NEED TO INSERT
        runningTest.stop();
        //$('#screenShotsModal').modal('hide');
        //$('#launchModal').modal('show');
        activeSession.getSession().setAnnotations(annotations);
        //remove the lock in test execution
        $scope.testExecuting = false;
    }

    $scope.resultsSummary = {};


    //init variables
    $scope.testExecuting = false;

    var activeSession = null;
    // initialize tabs
    var tabs = $('#tabs').tabs({
        beforeActivate: function(event, ui) {
            var tabId = ui.newPanel.attr('data-tab-id');
            activeSession = editors.getSession(tabId);
        }
    });

    $scope.getSession = function() {
        console.log(activeSession);
    }

    $("li[id*=panel_nav_]").on("click", function() {
        alert("Tab Clicked!");
    });

    $scope.selected = {};
    var loadFile = function(props) {
        //alert(props)
        var result = editors.isOpen(props);

        if (props === "") {
            //create an empty editor
            activeSession = editors.addInstance("", 1);
        } else if (result.isOpen) {
            var id = result.id;
            //tab is already open
            var tab = "#panel_" + id;
            var index = $('#tabs a[href="' + tab + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);
        } else {
            var path = props.relativeUri || props;
            console.debug(path);
            FS.get({
                path: path
            }, function(fileContent) {
                $scope.selected.item = fileContent;
                activeSession = editors.addInstance(fileContent);
            });
        }
    };

    if ($stateParams.path) {
        loadFile($stateParams.path);
    }

    // initialize button listener
    $('#addTab').on('click', function() {
        loadFile("");
        editors.getEditors();
    });

    //CLOSE TAB
    $('#tabs').on('click', '.close', function() {

        console.log('close a tab and destroy the ace editor instance');

        console.log($(this).parent());

        var tabUniqueId = $(this).parent().attr('data-tab-id');

        console.log(tabUniqueId);

        var resultArray = $.grep(editors, function(n, i) {
            return n.id === tabUniqueId;
        }, true);

        var editor = resultArray[0].instance;

        // destroy the editor instance
        editor.destroy();

        // remove the panel and panel nav dom
        $('#tabs').find('#panel_nav_' + tabUniqueId).remove();
        $('#tabs').find('#panel_' + tabUniqueId).remove();

    });

    //stop the timeouts
    $scope.$on('$destroy', function() {
        $timeout.cancel(stopwatch);
    });
    $scope.$on('$locationChangeStart', function() {
        $timeout.cancel(stopwatch);
    });

    $('#miniumOnDrugs').click(function() {
        $(".navbar-brand").css('background', 'url(images/minium_loader.gif) no-repeat left center');
        $(".navbar-brand").css('background-color', '#367fa9');
        $(".navbar-brand").css('color', '#f9f9f9');
    });
    $scope.multiTab = true;

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

    $scope.subscribeMessages = function() {

        var session_id = $scope.readCookie("JSESSIONID");
        var socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {

            console.log('Connected: ' + frame);
            stompClient.subscribe("/tests/" + session_id, function(message) {
                var body = message.body;
                console.log(eval('(' + body + ')'));
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
                console.log($scope.tests.total)
            });


            var range = ace.require('ace/range').Range;

            stompClient.subscribe("/cucumber/" + session_id, function(message) {
                console.log(message.body);
                var step = JSON.parse(message.body);
                var markerId;
                switch (step.status) {
                    case "failed":
                        markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "error_line", "fullLine");
                        break;
                    case "passed":
                        markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "success_line", "fullLine");
                        break;
                    case "executing":
                        markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 5), "executing_line", "line");
                        breakpoint(step.line - 1);
                        break;
                    case "undefined":
                        markerId = activeSession.session.addMarker(new range(step.line - 1, 0, step.line - 1, 2), "undefined_line", "line");
                        break;
                    default: //do nothing
                }
                if (markerId) $scope.markerIds.push(markerId);
            });

        });
    };

    //creates breakpoint in ace editor
    var breakpoint = function(row) {
        activeSession.getSession().setBreakpoint(row, "breakpoint");
    };



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
        // console.log($scope.fs.current.children)
    };

    var loadChildren = function(item) {
        // if (item.childrenLoaded) return;
        asyncLoad(item);
        // item.childrenLoaded = true;
    };

    $scope.showSelected = function(node) {

        $scope.selectedNode = node;
        console.log($scope.selectedNode)
        if (node.type == "FILE") {
            loadFile($scope.selectedNode.relativeUri);
        } else {
            console.log(node.children)
            loadChildren(node);
            //expand the node
            $scope.expandedNodes.push(node)
        }

    };

    $scope.showToggle = function(node, expanded) {
        console.log(node.children)
        loadChildren(node);
    };

    console.debug($scope.fs.current)
    asyncLoad($scope.fs.current);



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

    $scope.getColor = function(node) {
        if (node.name === "features") {
            return "red";
        }
        // } else if (node.name === "steps") {
        //     return "blue"
        // }

    };

    $scope.collapseAll = function() {
        alert("sds")
        $scope.expandedNodes = [];
    };


    //functions used in the 2 modules
    $scope.isEmptyObject = function(obj) {

        if (obj.length && obj.length > 0)
            return false;

        if (obj.length === 0)
            return true;
    }
    var annotations = [];
    var executionWasStopped;
     $scope.launch = function(launchParams) {
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
        var x;

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

            console.log($scope.resultsSummary);

            annotations = _.map(feature.notPassingsteps, function(step) {
                var result = step.status;
                var msg = result === 'FAILED' ? step.errorMessage : 'Skipped';
                var lines = msg;
                console.debug(step + "\n" + lines.slice(0, 10));
                // if (lines.length > 10) {
                //     msg = lines.slice(0, 10).join("\n");
                // }
                return {
                    row: step.line - 1,
                    text: msg,
                    type: (result === 'FAILED' ? 'error' : 'warning')
                };
            });

            if (annotations.length > 0) {
                toastr.warning("Test didn't pass!!");
                $("#status").removeClass().addClass("label label-danger").html("Failing");
            } else {
                if ($scope.resultsSummary.runCount == 0) {
                    //no test were run
                    $("#status").removeClass().addClass("label label-danger").html("No tests executed");
                    toastr.error("No test executed");
                } else {
                    $("#status").removeClass().addClass("label label-success").html("Passing");
                    toastr.success("Test Pass with Sucess");
                }

                annotations.push({
                    row: launchParams.line,
                    text: 'Test Executed and Pass',
                    type: 'info'
                });
            }

            $scope.onFinishTestExecution();


        }).error(function(){
            alert("error")
        });
    }
};
