'use strict';


pupinoIDE.factory('LaunchTest', function(launcherService, FeatureFacade) {

    function LaunchTest(scope) {
        this.scope = scope;
        console.log(this.scope);
    }

    LaunchTest.prototype.getScope = function() {
        return this.scope
    }

    LaunchTest.prototype.launch = function(launchParams) {
        console.debug(launchParams)

        //check if the test already executing
        if (this.scope.testExecuting == true) {
            toastr.error("A test is already running!!");
            return;
        }

        //put a lock in test execution
        this.scope.testExecuting = true;

        toastr.success("Test Started...");
        //runningTest.start();

        //reset Values
        this.scope.resetTotal();

        //start to take screenshots
        this.scope.takeScreenShot();

        // clear markers
        this.scope.clearMarkers();

        //reset the variable
        this.scope.executionWasStopped = false;
        var x;

        var _this = this;
        var annotations = [];
        launcherService.launch(launchParams).success(function(data) {
            //if execution was stopped there's no need to execute the block
            if (_this.scope.executionWasStopped == true) return;
            var feature = new FeatureFacade(data);
            console.debug(feature);
            _this.scope.faillingSteps = feature.notPassingsteps;

            _this.scope.resultsSummary.passed = feature.passedSteps.length;
            _this.scope.resultsSummary.failures = feature.failingSteps.length;
            _this.scope.resultsSummary.skipped = feature.skippedSteps.length;

            _this.scope.resultsSummary.runCount = feature.passedSteps.length + feature.notPassingsteps.length;

            // //convert in millisecond
            _this.scope.resultsSummary.runTime = feature.totalDuration / 1000000.0;

            console.log(_this.scope.resultsSummary);

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
                if (_this.scope.resultsSummary.runCount == 0) {
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

            _this.scope.onFinishTestExecution(annotations);


        });

    }

    LaunchTest.prototype.launchAll = function(launchParams) {
        //if no file is selected
        if (this.scope.selected.item === undefined)
            return;

        var launchParams = {
            fileProps: this.scope.selected.item.fileProps
        };

        this.launch(launchParams);
    }

     LaunchTest.prototype.subscribeMessages = function() {
       this.scope.subscribeMessages();
    }

    return LaunchTest;
});

pupinoIDE.factory('MiniumEditor', function($modal, StepProvider, SnippetsProvider, EvalService) {
    /**
     * Constructor, with class name
     */
    function MiniumEditor(launchExecutor) {
        // Public properties, assigned to the instance ('this')
        this.editors = [];
        this.activeInstance = null;
        this.launchExecutor = launchExecutor;
        console.debug(this.launchTest);
    }

    //////////////////////////////////////////////////////////////////
    //
    // Create a new editor
    //
    // Parameters:
    //   session - {EditSession} Session to be used for new Editor instance
    //
    //////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.addInstance = function(fileContent, num) {
        var range = ace.require('ace/range').Range;

        console.log('add a tab with an ace editor instance' + JSON.stringify(fileContent));

        // the panel id is a timestamp plus a random number from 0 to 10000
        var tabUniqueId = new Date().getTime() + Math.floor(Math.random() * 10000);


        addDOM(tabUniqueId);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);
        //change the settings of editor (themes, size, etc)
        setSettings(editor);

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

            var _this = this;

            editor.getSession().setMode("ace/mode/gherkin");

            editor.commands.addCommand({
                name: "launchCucumber",
                bindKey: {
                    win: "Ctrl+Enter",
                    mac: "Ctrl+Enter"
                },
                exec: function(env) {
                    console.log(_this.launchExecutor);
                    launchCucumber(env, _this.launchExecutor);
                },
                readOnly: false // should not apply in readOnly mode
            });

           this.launchExecutor.subscribeMessages();
        }

        var cursor = editor.getCursorPosition();
        editor.getSession().getDocument().setValue(fileContent.content);
        editor.moveCursorToPosition(cursor);
        editor.clearSelection();


        // resize the editor
        editor.resize();

        //check if fileContent has fileProps
        var fileProps = fileContent.fileProps || "";
        this.editors.push({
            id: tabUniqueId,
            instance: editor,
            relativeUri: fileProps.relativeUri
        });

        createEventsListeners(editor);
        //init other configurations like autocompletion
        otherConfigurations(editor);

        return editor;
    }



    MiniumEditor.prototype.getEditors = function() {
        console.log(this.editors)
        return this.editors;
    }

    MiniumEditor.prototype.isOpen = function(relativeUri) {
        var isOpen = false;
        var id = null;
        $.each(this.editors, function(i, obj) {
            console.log(obj.relativeUri + " cenas " + relativeUri)
            if (obj.relativeUri === relativeUri) {
                id = obj.id;
                isOpen = true;
            }
        });
        return {
            isOpen: isOpen,
            id: id
        }
    }

    MiniumEditor.prototype.getSession = function(id) {
        var editor = null;
        $.each(this.editors, function(i, obj) {
            console.log(obj.id + " cenas " + id)
            if (obj.id == id) {
                editor = obj;
                return false; //this stops de loop (works like a break)
            }
        });
        return editor;
    }


    /**
     * Private function
     */

    function addDOM(tabUniqueId, file_name) {
        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" ><a href="#panel_' + tabUniqueId + '" >' + tabUniqueId + '</a></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        console.log('tabIndex: ' + tabIndex);

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div id="editor_' + tabUniqueId + '">// some code here</div>');

        newTabPanelElement.append(newEditorElement);

        // set the size of the panel
        // newTabPanelElement.width('600');
        // newTabPanelElement.height('600');

        // // set the size of the editor
         // newEditorElement.width('1180');
        newEditorElement.height('500');

    }

    function setSettings(editor) {
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/gherkin");
        editor.setShowPrintMargin(false);
        editor.setFontSize(14);
        editor.getSession().setTabSize(2);
        editor.getSession().setUseSoftTabs(true);
        editor.setHighlightActiveLine(true);
        //to sroll
        editor.resize(true);
    }

    function otherConfigurations(editor) {
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
    }

    function createEventsListeners(editor) {
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
    }



    function saveFile() {
        var item = this.scope.selected.item;
        item.content = editor.getSession().getValue();
        item.$save(function() {
            setAceContent(item);
        });
    };


    function openFile() {
        this.scope.$apply(function() {
            this.scope.openFile();
        });
    };


    // from minium app
    function evalutate(editor) {
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

    function activateSelectorGadget(editor) {
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



    function launchCucumber(editor, launchExecutor) {

        var scope = launchExecutor.getScope();

        var selectedItem = scope.selected.item;
        if (!selectedItem) return;
        console.log(editor);

        var lines = [];
        var range;
        editor.forEachSelection({
            exec: function() {
                range = editor.getSelectionRange();
                lines.push(range.start.row + 1);
            }
        });
        var launchParams = {
            line: lines.reverse(),
            fileProps: selectedItem.fileProps
        };
        //launch the execution
        scope.launch(launchParams);
    };


    return MiniumEditor;


});
