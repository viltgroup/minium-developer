'use strict';

pupinoIDE.factory('MiniumEditor', function($modal, StepProvider, SnippetsProvider, EvalService) {
    /**
     * Constructor, with class name
     */
    function MiniumEditor(scope) {
        // Public properties, assigned to the instance ('this')
        this.editors = [];
        this.activeInstance = null;
        this.scope = scope;
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

        var fileProps = fileContent.fileProps || "";
        addDOM(tabUniqueId,fileProps);

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
                    console.log(_this.scope);
                    launchCucumber(env, _this.scope);
                },
                readOnly: false // should not apply in readOnly mode
            });

            this.scope.subscribeMessages();
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
        //create event listeners (bind keys events)
        bindKeys(editor);
        //init other configurations like autocompletion
        otherConfigurations(editor);

        return editor;
    }



    MiniumEditor.prototype.getEditors = function() {
        console.log(this.editors)
        return this.editors;
    }


    //////////////////////////////////////////////////////////////////
    //
    // Check is file with {relativeURi} is already open in a tab
    //
    // Parameters:
    //   relativeUri - uri of the file we want to open
    //
    //////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.isOpen = function(relativeUri) {
        var isOpen = false;
        var id = null;
        $.each(this.editors, function(i, obj) {
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

    /////////////////////////////////////////////////////////////////
    //
    // Get the Editor session by ID 
    //
    // Return from the ID the instance of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getSession = function(id) {
        var editor = null;
        $.each(this.editors, function(i, obj) {
            if (obj.id == id) {
                editor = obj;
                return false; //this stops de loop (works like a break)
            }
        });
        return (editor != null ? editor.instance : null);
    }


    ////////////////////////////////////////////////////////////////
    //
    // PRIVATE FUCNTIONS
    //
    /////////////////////////////////////////////////////////////////
    

    ////////////////////////////////////////////////////////////////
    //
    // Create new tab
    //
    //
    /////////////////////////////////////////////////////////////////
    function addDOM(tabUniqueId, fileProps) {

    	var fileName = fileProps.name || "untitled";

        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" ><a href="#panel_' + tabUniqueId + '" >' + fileName + '</a></li>');

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


    //////////////////////////////////////////////////////////////////
    //
    // Setup Key bindings
    //
    // Parameters:
    //   editor - instance of the editor
    //
    //////////////////////////////////////////////////////////////////
    function bindKeys(editor) {
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



    function launchCucumber(editor, scope) {

        var scope = scope;

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
