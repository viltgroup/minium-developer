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

var EditorAreaController = function($scope, $log, $timeout, $modal, $state, $location, $window, $stateParams, EvalService, FS, launcherService, FormatService, StepProvider, SnippetsProvider) {

    var runningTest = Ladda.create(document.querySelector('#runningTest'));

    var setAceContent = function() {};

    $scope.testExecuting = false;

    var loadFile = function(props) {
        var path = props.relativeUri || props;
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
        $scope.image = "/screenshot?timestamp=" + new Date().getTime();
        stopwatch = $timeout(function() {
            $scope.image = "/screenshot?timestamp=" + new Date().getTime();
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

    $scope.openExecution = function  (argument) {
         $('#screenShotsModal').modal({
            show: true
        });
    }

    $scope.takeScreenShot = function(argument) {
        $scope.image = "/screenshot?timestamp=" + new Date().getTime();
    };

    $scope.markerIds = [];
    $scope.clearMarkers = function () {
        $scope.markerIds.forEach(function (markerId) {
            $scope.editor.session.removeMarker(markerId);
        });
        $scope.markerIds = [];
    }

    /**
     * WebSocket
     * @type {SockJS}
     */
    var subscribeMessages = function () {

        $scope.tests = {};
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
                        $scope.tests.total = testMessage.body;
                        break;
                    case "failing":
                        $scope.tests.failing = $scope.tests.failing + "\n\n\n" + testMessage.body;
                        break;
                    case "passed":
                        $scope.tests.passed = testMessage.body;
                        break;
                    default: //do nothing
                }
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
                    default: //do nothing
                }
                if (markerId) $scope.markerIds.push(markerId);
            });

        });
    };

    $scope.launchAll = function(argument) {
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

        toastr.success("Test Started...");
        runningTest.start();
        $scope.tests = {};

        //start to take screenshots
        $scope.takeScreenShot();

        // clear markers
        $scope.clearMarkers();

        launcherService.launch(launchParams).success(function(data) {


            var notPassingsteps = jsonPath.eval(data, "$..steps[?(@.result.status!='passed')]");

            var failingSteps = jsonPath.eval(data, "$..steps[?(@.result.status=='failed')]");
            var skippedSteps = jsonPath.eval(data, "$..steps[?(@.result.status=='skipped')]");
            var passedSteps = jsonPath.eval(data, "$..steps[?(@.result.status=='passed')]");
            var durations = jsonPath.eval(data, "$..duration");

            $scope.resultsSummary.passed = passedSteps.length;
            $scope.resultsSummary.failures = failingSteps.length;
            $scope.resultsSummary.skipped = skippedSteps.length;

            $scope.resultsSummary.runCount = passedSteps.length + notPassingsteps.length;
            var totalDuration = 0;
            $.each(durations, function() {
                totalDuration += this;
            });
            //convert in millisecond
            $scope.resultsSummary.runTime = totalDuration / 1000000.0;
            console.log(totalDuration);

            console.log($scope.resultsSummary);

            annotations = _.map(notPassingsteps, function(step) {
                var result = step.result;
                var msg = result.status === 'failed' ? result.error_message : 'Skipped';
                var lines = msg.split("\n");
                if (lines.length > 10) {
                    msg = lines.slice(0, 10).join("\n");
                }
                return {
                    row: step.line - 1,
                    text: msg,
                    type: (result.status === 'failed' ? 'error' : 'warning')
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

            $scope.killtimer();
            //stop button
            runningTest.stop();
            //$('#screenShotsModal').modal('hide');

            //$('#launchModal').modal('show');
            $scope.editor.getSession().setAnnotations(annotations);

            //remove the lock in test execution
            $scope.testExecuting = false;
        });
    }


    $scope.resultsSummary = {};
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

            var range = editor.getSelectionRange();
            var line = range.start.row;

            var launchParams = {
                line: line,
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

    //Handle onclose and on change location browser
    window.onbeforeunload = function(e) {
        socket.close();
    };

    $scope.$on('$locationChangeStart', function(event, next, current) {
        socket.close();
    });

    $('#miniumOnDrugs').click(function() {
        $(".navbar-brand").css('background', 'url(/app/img/minium_loader.gif) no-repeat left center');
        $(".navbar-brand").css('background-color', '#367fa9');
        $(".navbar-brand").css('color', '#f9f9f9');
    });

};
