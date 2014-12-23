'use strict';

//
//SelectorGadgetCtrl
//
function SelectorGadgetCtrl($rootScope, $scope, $location, $modalInstance, SelectorGadgetService, editor) {

    var request = SelectorGadgetService.activate()
        .success(function() {
            toastr.success("Selector Gadget activated");
        })
        .error(function() {
            toastr.warning("Selector Gadget failed");
        });


    $scope.accept = function() {
        var request = SelectorGadgetService.cssSelector()
            .success(function(data) {
                if (data.expression) {
                    var session = editor.getSession();
                    var range = editor.getSelectionRange();
                    var position = range.start;
                    session.remove(range);
                    session.insert(position, data.expression);

                    $modalInstance.close(data);

                    toastr.success("Picked CSS selector is " + data + "!");
                } else {
                    // close modal
                    $modalInstance.dismiss('cancel');

                    toastr.warning("No element was picked");
                }
            })
            .error(function() {
                toastr.warning("Could not pick element");
            });
    };

    $scope.cancel = function() {
        var request = SelectorGadgetService.deactivate()
            .success(function(data) {
                // close modal
            })
            .error(function() {
                toastr.warning("Could not deactivate selector gadget");
            });
        $modalInstance.dismiss('cancel');
    };
};

var EditorAreaController = function($rootScope, $scope, $log, $timeout, $modal, $state, $location, $window, $stateParams, EvalService, FS, launcherService, FormatService, StepProvider, SnippetsProvider, FeatureFacade) {
    
    console.debug("loaded EditorAreaController")
    var runningTest = Ladda.create(document.querySelector('#runningTest'));

    var setAceContent = function() {};

    $scope.testExecuting = false;

    var loadFile = function(props) {
        var path = props.relativeUri || props;
        console.debug(path);
        FS.get({
            path: path
        }, function(fileContent) {
            $scope.selected.item = fileContent;
            setAceContent(fileContent);
            //if params gotoLine != undifined
            if ($state.params.line) {
                $scope.editor.scrollToLine($state.params.line, true, true, function() {});
                $scope.editor.gotoLine($state.params.line, 0, true);
            }
            
            $timeout(checkModified, 2000);
        });
    };

    var checkModified = function() {
        var selectedItem = $scope.selected.item;
        if (!selectedItem) return;
        FS.get({
            action: 'props',
            path: selectedItem.fileProps.relativeUri
        }, function(props) {
            if (selectedItem.fileProps.lastModified < props.lastModified) {
                $log.info("File " + props.relativeUri + " updated externally, reloading it");
                loadFile(props);
            } else {
                $timeout(checkModified, 10000);
            }
        });
    };

    $scope.selected = {};

    if ($stateParams.path) {
        loadFile($stateParams.path);
    }

    $scope.image = {};
    var stopwatch = null;
    var timer = function() {
        $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
        stopwatch = $timeout(function() {
            $scope.image = "/app/rest/screenshot?timestamp=" + new Date().getTime();
            timer();
        }, 2000);
    };

    $scope.killtimer = function() {
        $timeout.cancel(stopwatch);
        stopwatch = null;
    };

    $scope.runtimer = function() {
        timer();
    };

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
            $scope.editor.session.removeMarker(markerId);
        });
        $scope.markerIds = [];
        $scope.editor.session.clearBreakpoints();
    }

    /**
     * WebSocket
     * @type {SockJS}
     */
    $scope.tests = {};
    $scope.cenas = 0;
    var subscribeMessages = function() {

        var socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {

            console.log('Connected: ' + frame);
            stompClient.subscribe("/tests", function(message) {
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

            stompClient.subscribe("/cucumber", function(message) {
                console.log(message.body);
                var step = JSON.parse(message.body);
                var markerId;
                switch (step.status) {
                    case "failed":
                        markerId = $scope.editor.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "error_line", "fullLine");
                        break;
                    case "passed":
                        markerId = $scope.editor.session.addMarker(new range(step.line - 1, 0, step.line - 1, 1000), "success_line", "fullLine");
                        break;
                    case "executing":
                        markerId = $scope.editor.session.addMarker(new range(step.line - 1, 0, step.line - 1, 5), "executing_line", "line");
                        breakpoint(step.line - 1);
                        break;
                    default: //do nothing
                }
                if (markerId) $scope.markerIds.push(markerId);
            });

        });
    };

    $scope.launchAll = function() {
        //if no file is selected
        if ($scope.selected.item === undefined)
            return;

        var launchParams = {
            fileProps: $scope.selected.item.fileProps
        };

        launch(launchParams);
    }
    var annotations = [];
    var launch = function(launchParams) {

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
        var x ;
        
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
                console.debug(step + "\n"+ lines.slice(0, 10));
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
                    $("#status").removeClass().addClass("label label-warning").html("0 tests executed");
                    toastr.warning("0 test executed");
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

            onFinishTestExecution();


        });
    }


    //to know when the execution was stopped
    //inicialize a false
    var executionWasStopped = false;
    //stops a launch execution
    $scope.stopLaunch = function() {
        launcherService.stop().success(function() {
            toastr.warning("Test Stopped with success!!")
            onFinishTestExecution();
            executionWasStopped = true;
        });
    };
    var onFinishTestExecution = function() {
        $scope.killtimer();
        //stop button
        runningTest.stop();
        //$('#screenShotsModal').modal('hide');
        //$('#launchModal').modal('show');
        $scope.editor.getSession().setAnnotations(annotations);
        //remove the lock in test execution
        $scope.testExecuting = false;
    }

    $scope.resultsSummary = {};

    //creates breakpoint in ace editor
    var breakpoint = function(row) {
        $scope.editor.getSession().setBreakpoint(row, "breakpoint");
    };

    // ACE
    $scope.aceLoaded = function(editor) {
        console.debug("new editor", editor);
        $scope.editor = editor;
        editor.setTheme("ace/theme/monokai");
        editor.setShowPrintMargin(false);
        editor.setFontSize(14);
        editor.getSession().setTabSize(2);
        editor.getSession().setUseSoftTabs(true);
        editor.setHighlightActiveLine(true);
        //to sroll
        editor.resize(true);

        var range = ace.require('ace/range').Range;

        var launchCucumber = function() {


            var selectedItem = $scope.selected.item;
            if (!selectedItem) return;

            var lines = [];
            var range;
            $scope.editor.forEachSelection({
                exec: function() {
                    range = $scope.editor.getSelectionRange();
                    lines.push(range.start.row + 1);
                }
            });
            var launchParams = {
                line: lines.reverse(),
                fileProps: selectedItem.fileProps
            };
            //launch the execution
            launch(launchParams);

        };

        var saveFile = function() {
            var item = $scope.selected.item;
            item.content = editor.getSession().getValue();
            item.$save(function() {
                setAceContent(item);
            });
        };

        var openFile = function() {
            $scope.$apply(function() {
                $scope.openFile();
            });
        };

        // from minium app
        var evalutate = function(editor) {
            var range = editor.getSelectionRange();
            var session = editor.getSession();

            var line = range.start.row;
            var code = range.isEmpty() ? session.getLine(line) : session.getTextRange(range);

            var request = EvalService.eval({
                    expr: code,
                    lineno: line + 1
                })
                .success(function(data) {
                    if (data.size >= 0) {
                        toastr.success(data.size + " matching web elements");
                    } else {
                        toastr.success(data.value ? _.escape(data.value) : "No value");
                    }
                })
                .error(function(exception) {
                    console.error("Evaluation failed", exception);
                    toastr.warning(exception.message);
                    if (exception.lineNumber >= 0 && !exception.sourceName) {
                        var errors = [{
                            row: exception.lineNumber - 1,
                            column: 0,
                            text: exception.message,
                            type: "error"
                        }];
                        editor.getSession().setAnnotations(errors);
                    }
                });
        };

        var activateSelectorGadget = function(editor) {
            var modalInstance = $modal.open({
                templateUrl: 'selectorGadgetModal.html',
                controller: 'SelectorGadgetCtrl',
                resolve: {
                    editor: function() {
                        return editor;
                    }
                }
            });
        };
        // END from minium app
        editor.commands.addCommand({
            name: 'newFile',
            bindKey: {
                win: 'Ctrl-P',
                mac: 'Command-P',
                sender: 'editor|cli'
            },
            exec: function(env, args, request) {
                alert("HI!");
            }
        });

        editor.commands.addCommand({
            name: "saveFile",
            bindKey: {
                win: "Ctrl-S",
                mac: "Command-S",
                sender: "editor|cli"
            },
            exec: saveFile,
            readOnly: false // should not apply in readOnly mode
        });
        editor.commands.addCommand({
            name: "openFile",
            bindKey: {
                win: "Ctrl-Shift-R",
                mac: "Command-Shift-R",
                sender: "editor|cli"
            },
            exec: openFile,
            readOnly: false // should not apply in readOnly mode
        });

        setAceContent = function(fileContent) {
            var fileName = fileContent.fileProps.name;
            if (/\.js$/.test(fileName)) {
                editor.getSession().setMode("ace/mode/javascript");

                editor.commands.addCommand({
                    name: "evaluate",
                    bindKey: {
                        win: "Ctrl-Enter",
                        mac: "Command-Enter"
                    },
                    exec: evalutate,
                    readOnly: false // should not apply in readOnly mode
                });
                editor.commands.addCommand({
                    name: "activateSelectorGadget",
                    bindKey: {
                        win: "Ctrl-Shift-C",
                        mac: "Command-Shift-C"
                    },
                    exec: activateSelectorGadget,
                    readOnly: false // should not apply in readOnly mode
                });
            }
            if (/\.feature$/.test(fileName)) {
                editor.getSession().setMode("ace/mode/gherkin");

                editor.commands.addCommand({
                    name: "launchCucumber",
                    bindKey: {
                        win: "Ctrl+Enter",
                        mac: "Ctrl+Enter"
                    },
                    exec: launchCucumber,
                    readOnly: false // should not apply in readOnly mode
                });

                subscribeMessages();
            }

            var cursor = editor.getCursorPosition();
            editor.getSession().getDocument().setValue(fileContent.content);
            editor.moveCursorToPosition(cursor);
            editor.clearSelection();
        };

        // using input event
        editor.on('input', function() {

        });

        // autocompletion
        var langTools = ace.require("ace/ext/language_tools");
        editor.setOptions({
            enableLiveAutocompletion: true,
            enableSnippets: true
        });

        var stepSources = StepProvider.all();
        var snippetManager = ace.require("ace/snippets").snippetManager;

        snippetManager.register(_.map(stepSources, function(stepSource) {
            var simpleStep = stepSource
                .replace(/\([^\)]*\)/, "...");
            var stepContent = stepSource
                .replace(/\([^\)]*\)/, "${0:value}");

            var snippet = {
                name: simpleStep,
                // start : "there are",
                // trigger : /(\w+)/.exec(stepSource)[0],
                content: stepContent
            };
            //console.log(snippet);
            return snippet;
        }), "gherkin");

        var snippets = SnippetsProvider.all();
        snippetManager.register(snippets, "gherkin");
    };

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

    
    /*
    MULTITAB
     */
    $scope.multiTab = false;


  
};
