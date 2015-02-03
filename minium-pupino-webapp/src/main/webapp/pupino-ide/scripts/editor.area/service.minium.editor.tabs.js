'use strict';

pupinoIDE.factory('MiniumEditor', function($modal, $cookieStore, StepProvider, SnippetsProvider, EvalService, TabFactory, editorPreferences) {
    var MiniumEditor = function() {}

    //////////////////////////////////////////////////////////////////
    //
    // Initialize the instance of the editor
    //
    // Parameters:
    //   scope - the scope from the controller beacuse we need to use
    //             some of the function define in the controller
    //
    //////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.init = function(scope) {
        // Public properties, assigned to the instance ('this')
        // list of editors
        this.editors = [];
        //scope
        this.scope = scope;

        //init the possible modes
        this.modeEnum = {
            JS: "JS", // optionally you can give the object properties and methods
            FEATURE: "FEATURE",
            YAML: "YAML"
        };
        //the actual mode
        this.mode = "";

        //the settings of the editor
        this.defaultSettings = {
            theme: 'ace/theme/monokai',
            fontSize: 14,
            printMargin: false,
            highlightLine: true,
            wrapMode: false,
            softTabs: true,
            HighlightActiveLine: true,
            tabSize: 2,
            resize: true
        };

        //this settings can be loaded a cookie
        //if the cookie dont exist load default settings
        this.settings = editorPreferences.loadEditorPreferences(this.defaultSettings);

        //init the event handler for ctrl + scroll to resize fontSize
        this.initMouseWheelEvenHandler();

        this.ignore = false;
    }

    //////////////////////////////////////////////////////////////////
    //
    // Create a new instance of an editor
    //
    // Parameters:
    //   session - {EditSession} Session to be used for new Editor instance
    //
    //////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.addInstance = function(fileContent, num) {

        console.log('add a tab with an ace editor instance' + JSON.stringify(fileContent));

        // the panel id is a timestamp plus a random number from 0 to 10000
        var tabUniqueId = new Date().getTime() + Math.floor(Math.random() * 10000);

        var fileProps = fileContent.fileProps || "";
        //create the DOM elements
        TabFactory.createTab(tabUniqueId, fileProps);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);

        var fileName = fileProps.name || "";
        //create a new session and set the content
        setAceContent(fileContent, editor);

        //set the type of file extension
        this.setTypeFile(fileName, editor);

        //change the settings of editor (themes, size, etc)
        editorPreferences.setEditorSettings(editor, this.settings);

        // resize the editor
        editor.resize();

        // add listener to input
        listenChanged(editor, this)

        //create event listeners (bind keys events)
        bindKeys(editor, this);

        //init snippets like autocompletion
        initSnippets(editor);

        //check if fileContent has fileProps
        var fileProps = fileContent.fileProps || "";
        //add this instance to the list of editors instance
        this.editors.push({
            id: tabUniqueId,
            instance: editor,
            relativeUri: fileProps.relativeUri,
            mode: this.mode,
            selected: fileContent
        });

        return {
            id: tabUniqueId,
            instance: editor,
            relativeUri: fileProps.relativeUri,
            mode: this.mode,
            selected: fileContent
        }

    }

    /////////////////////////////////////////////////////////////////
    //
    // Get all the instances
    //
    // Return from the all the instances of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getEditors = function() {
        console.log(this.editors)
        return this.editors;
    }

    /////////////////////////////////////////////////////////////////
    //
    // Get all the instances
    //
    // Return from the all the instances of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getScope = function() {
        return this.scope;
    }

    /////////////////////////////////////////////////////////////////
    //
    // Get possible modes
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.modes = function() {
        return this.modeEnum;
    }

    /////////////////////////////////////////////////////////////////
    //
    // Get number of edirtors
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.size = function() {
        return this.editors.length;
    }

    /////////////////////////////////////////////////////////////////
    //
    // Get settings
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getSettings = function() {
        return this.settings;
    }

    /////////////////////////////////////////////////////////////////
    //
    // Set settings
    // Set the settings for every instance
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.setSettings = function(settings) {
        //creates a shallow copy
        //maintaining the fileds that dont exists in settings
        this.settings = angular.extend(settings);
        this.editors.forEach(function(item) {
            var editor = item.instance;
            console.log(editor)
            editorPreferences.setEditorSettings(editor, settings);
        });

        editorPreferences.storeEditorPreferences(this.settings);
        console.log(this.settings);
    }

    /////////////////////////////////////////////////////////////////
    //
    // Reset the setting to default
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.resetSetting = function() {
        this.setSettings(this.defaultSettings);
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
        return (editor != null ? editor : null);
    };

    /////////////////////////////////////////////////////////////////
    //
    // Remove the session from ID
    //
    // 
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.deleteSession = function(id) {
        for (var i = this.editors.length - 1; i >= 0; i--) {
            if (this.editors[i].id == id) {
                this.editors.splice(i, 1);
            }
        }
    };

    ////////////////////////////////////////////////////////////////
    //
    // hightlight Line in editor
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.hightlightLine = function(row, editor, type) {
        editor.getSession().setBreakpoint(row, type);
    };

    ////////////////////////////////////////////////////////////////
    //
    // Save the file
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.saveFile = function(editor) {
        saveFile(editor, this);
    };

    ////////////////////////////////////////////////////////////////
    //
    //Activate selector gadget
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.activateSelectorGadget = function(editor) {
        activateSelectorGadget(editor);
    };

    ////////////////////////////////////////////////////////////////
    //
    //Evaluate Expression
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.evaluate = function(editor) {
        evaluate(editor);
    };

    ////////////////////////////////////////////////////////////////
    //
    // Set Session the file
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.setSession = function(id, filePath) {
        for (var i = this.editors.length - 1; i >= 0; i--) {
            if (this.editors[i].id == id) {
                break;
            }
        }
        this.editors[i].fileProps.relativeUri = filePath;
    };

    ////////////////////////////////////////////////////////////////
    //
    // Launch test
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.launchCucumber = function(editor) {
        launchCucumber(editor, this.scope);
    };

    ////////////////////////////////////////////////////////////////
    //
    // Check if the tab is dirty
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.isDirty = function(id) {
        var editor = this.getSession(id);
        var elem = $("#save_" + id);
        console.log(elem.attr('class'))
            //check if the element is dirty
        if (elem.hasClass("hide")) {
            return false; //the element is not dirty
        } else {
            return true; //the element is dirty
        }
    };

    ////////////////////////////////////////////////////////////////
    //
    // remove tab session
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.closeTab = function(id, tabs, element) {
        //get the element 
        var panelId = element.closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        tabs.tabs("refresh");
        //remove the instance of tabs that we closed
        this.deleteSession(id);
    };

    MiniumEditor.prototype.setTypeFile = function(fileName, editor) {

        if (/\.js$/.test(fileName)) {

            var _this = this;

            editor.getSession().setMode("ace/mode/javascript");

            editor.commands.addCommand({
                name: "evaluate",
                bindKey: {
                    win: "Ctrl-Enter",
                    mac: "Command-Enter"
                },
                exec: evaluate,
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

            this.mode = this.modeEnum.JS;
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
            //set the mode
            this.mode = this.modeEnum.FEATURE;
        }

        if (/\.yml$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/yaml");

            //set the mode
            this.mode = this.modeEnum.YAML;
        }

    }

    ////////////////////////////////////////////////////////////////
    //
    // PRIVATE FUCNTIONS
    //
    /////////////////////////////////////////////////////////////////

    MiniumEditor.prototype.initMouseWheelEvenHandler = function(settings) {
        //KEY EVENT FOR CTRL + SCROLL MOUSE
        var curSize;
        var self = this;

        $(window).bind('mousewheel DOMMouseScroll', function(event) {
            if (event.ctrlKey == true) {
                var e = this.event;

                // determines direction of scroll
                var delta = e.wheelDelta || -e.detail;
                curSize = self.settings.fontSize;

                // scroll down
                if (delta > 0) {
                    curSize -= 0.25;
                } else { //scroll up
                    curSize += 0.25;
                }
                self.settings.fontSize = curSize;
                self.setSettings(self.settings);
                console.log(curSize);

                event.preventDefault();
            }
        });
    }

    //////////////////////////////////////////////////////////////////
    //
    // Configure the snippets of the editor
    //
    //////////////////////////////////////////////////////////////////
    function initSnippets(editor) {
        // autocompletion
        var langTools = ace.require("ace/ext/language_tools");
        //snippets
        var snippetManager = ace.require("ace/snippets").snippetManager;

        editor.setOptions({
            // enableBasicAutocompletion: true,  //this enable a autocomplete (ctrl + space)
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        StepProvider.all().then(function(response) {

            var util = ace.require("ace/autocomplete/util");
            var originalRetrievePrecedingIdentifier = util.retrievePrecedingIdentifier;
            util.retrievePrecedingIdentifier = function(text, pos, regex) {
                if (!/^\s*(?:Given|When|Then|And|Neither)\s+/.test(text)) {
                    return originalRetrievePrecedingIdentifier(text, pos, regex);
                }
                return text.replace(/^\s+/, "");
            };

            //register the snippets founded
            snippetManager.register(response.data, "gherkin");
        });

        //snippets for scenario
        //when we write a scenario
        //he complete the scenario with a step
        var snippets = SnippetsProvider.all();

        console.log(snippets)
        snippetManager.register(snippets, "gherkin");
    }

    //////////////////////////////////////////////////////////////////
    // Put or remove the marker
    // Is isDirty is true put "*" in the tab
    //////////////////////////////////////////////////////////////////
    function markAsDirty(tabUniqueId, isDirty) {
        if (isDirty === true) {
            $('#save_' + tabUniqueId).removeClass("hide");
        } else {
            $('#save_' + tabUniqueId).addClass("hide");
        }
    }

    //////////////////////////////////////////////////////////////////
    //
    // Setup Key bindings
    //
    // Parameters:
    //   editor - instance of the editor
    //
    //////////////////////////////////////////////////////////////////
    function bindKeys(editor, that) {
        var _this = that;
        editor.commands.addCommand({
            name: "saveFile",
            bindKey: {
                win: "Ctrl-S",
                mac: "Command-S",
                sender: "editor|cli"
            },
            exec: function(env) {
                saveFile(env, _this);
            },
            readOnly: false // should not apply in readOnly mode
        });
        editor.commands.addCommand({
            name: "openFile",
            bindKey: {
                win: "Ctrl-Shift-R",
                mac: "Command-Shift-R",
                sender: "editor|cli"
            },
            exec: function(env) {
                console.log("open file")
            },
            readOnly: false // should not apply in readOnly mode
        });
    }

    //////////////////////////////////////////////////////////////////
    //
    // Create a listener to
    //  Every time an event is detected it will execute the event handler
    //  that we define. 
    //  When we save the file an event is triggered and the flag {ignore} 
    //  come as true to ignore this event and mark the editor as clean and
    //  put the flag {ignore} has false again
    //  When other events are event triggered it will mark the editor as 
    //  dirty
    //  
    // Parameters:
    //   editor - instance of the editor
    //   that   - class variables
    //////////////////////////////////////////////////////////////////
    function listenChanged(editor, that) {
        var _this = that;
        editor.on('input', function() {
            var tabUniqueId = getEditorID(editor);
            if (_this.ignore !== true) {
                if (!editor.getSession().getUndoManager().isClean()) {
                    markAsDirty(tabUniqueId, true)
                }
            } else {
                //in this case
                markAsDirty(tabUniqueId, false)
                _this.ignore = false;
            }

        });
    }

    //////////////////////////////////////////////////////////////////
    //
    // Save a file and update the editor instance
    //  we mark the value ignore has true
    //  when we save the file we update the content of the editor and
    //  we don't reset the undo manager.
    //  
    // Parameters:
    //   editor - instance of the editor
    //////////////////////////////////////////////////////////////////
    function saveFile(editor, that) {
        var _this = that;
        //flag for the even listener don't mark as dirty the editor 
        _this.ignore = true;
        console.log(_this)
        var item = _this.scope.selected.item;
        item.content = editor.getSession().getValue();
        console.log(editor);
        console.log(_this.scope.selected.item);
        item.$save(function() {

            var tabUniqueId = getEditorID(editor);
            updateContent(item, editor, _this, tabUniqueId)
                //setAceContent(item, editor);
            toastr.success("File saved")

            editor.getSession().getUndoManager().markClean();
            console.log(editor.getSession().getUndoManager());
            markAsDirty(tabUniqueId, false)

        }, function(response) {
            var data = response.data;

            console.log(response)

            toastr.error(data.message, "The file contains " + data.exception)
        });

    };

    function updateContent(item, editor, that, tabUniqueId) {
        console.log(item)
        var fileName = item.fileProps.name || "";

        var _this = that;

        if (/\.js$/.test(fileName)) {
            //var _this = this;
            editor.getSession().setMode("ace/mode/javascript");
            _this.mode = _this.modeEnum.JS;
        }
        if (/\.feature$/.test(fileName)) {
            setDocumentValue(item, editor, tabUniqueId);
            //var _this = this;
            editor.getSession().setMode("ace/mode/gherkin");

            //set the mode
            console.log(_this)
            _this.scope.subscribeMessages();
            _this.mode = _this.modeEnum.FEATURE;
        }

        if (/\.yml$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/yaml");

            //set the mode
            _this.mode = _this.modeEnum.YAML;
        }
        //change the settings of editor (themes, size, etc)
        editorPreferences.setEditorSettings(editor, _this.settings);
    }

    /**
     * Set the content of the session
     * @param {item} the properties of the file
     * @param {editor} the editor than we gonna edit
     **/
    function setAceContent(item, editor) {

        var content = item.content || "";
        var cursor = editor.getCursorPosition();
        var EditSession = ace.require('ace/edit_session').EditSession;
        var UndoManager = ace.require('ace/undomanager').UndoManager;
        //editor.getSession().getDocument().setValue(item.content);

        var session = editor.getSession();
        session = new EditSession(content);

        session.setUndoManager(new UndoManager());

        editor.setSession(session);
        console.log(session)
            // editor.setSession(ace.createEditSession(item.content))
        editor.moveCursorToPosition(cursor);
        editor.clearSelection();
    }

    /**
     * Update the document value attatched to a EditSession
     * We don't need to create a new EditSession
     * This way we can maintain the UndoManager
     * @returns {Boolean}
     **/
    function setDocumentValue(item, editor, tabUniqueId) {
        var content = item.content || "";
        var cursor = editor.getCursorPosition();

        var session = editor.getSession();

        //can be done this way but has some bugs
        //   var text = new Document(text);
        // var document = session.setDocument(content);

        var document = session.getDocument().setValue(content);
        editor.moveCursorToPosition(cursor);
        editor.clearSelection();
    }

    ////////////////////////////////////////////////////////////////
    //
    // Get Unique id for the editor
    //
    // editor.container always get a result like this editor_1444444
    // we want the id
    /////////////////////////////////////////////////////////////////
    function getEditorID(editor) {
        var container = editor.container.id;
        var res = container.split("_");
        var tabUniqueId = res[1];
        return tabUniqueId;
    };

    function openFile() {
        this.scope.$apply(function() {
            this.scope.openFile();
        });
    };

    // from minium app
    function evaluate(editor) {
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
        console.log(launchParams)
            //launch the execution
        scope.launch(launchParams);
    };

    return new MiniumEditor;

});
