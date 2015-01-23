'use strict';

pupinoIDE.factory('MiniumEditor', function($modal, StepProvider, SnippetsProvider, EvalService) {
    /**
     * Constructor, with class name
     */
    var MiniumEditor = function() {}


    MiniumEditor.prototype.init = function(scope) {
        // Public properties, assigned to the instance ('this')
        this.editors = [];
        this.activeInstance = null;
        this.scope = scope;

        //init the possible modes
        this.modeEnum = {
            JS: "JS", // optionally you can give the object properties and methods
            FEATURE: "FEATURE",
            YAML: "YAML"
        };

        this.mode = "";

        this.settings = {
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

        console.log(this)
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
        addDOM(tabUniqueId, fileProps);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);

        var fileName = fileProps.name || "";
        setAceContent(fileContent, editor);
        this.setTypeFile(fileName, editor);

        //change the settings of editor (themes, size, etc)
        setSettings(editor,this.settings);

        // resize the editor
        editor.resize();

        // //add listener to input
        listenChanged(editor)

        //create event listeners (bind keys events)
        bindKeys(editor, this);

        //init other configurations like autocompletion
        otherConfigurations(editor);

        //check if fileContent has fileProps
        var fileProps = fileContent.fileProps || "";
        this.editors.push({
            id: tabUniqueId,
            instance: editor,
            relativeUri: fileProps.relativeUri,
            mode: this.mode,
            selected: fileContent
        });

        console.log(fileContent);
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
    //
    // Return from the all the instances of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.size = function() {
        return this.editors.length;
    }


    /////////////////////////////////////////////////////////////////
    //
    // Set theme
    //
    // Return from the all the instances of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.setTheme = function(editor, themeName) {
        var name = "ace/theme/" + themeName;
        editor.setTheme(name);
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
        saveFile(editor, this.scope,this);
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
        var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" data-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '" title="' + fileProps.relativeUri + '">' + fileName + ' <span id="save_' + tabUniqueId + '" class="hide">*</span></a> <span class="ui-icon ui-icon-close" ></span></li>');

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
        var newEditorElement = $('<div id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // set the size of the panel
        // newTabPanelElement.width('600');
        // newTabPanelElement.height('600');

        // // set the size of the editor
        // newEditorElement.width('1180');
        newEditorElement.height('700');

    }


    function setSettings(editor, settings) {


        editor.setTheme(settings.theme);

        editor.setShowPrintMargin(settings.printMargin);
        editor.setFontSize(settings.fontSize);
        editor.getSession().setTabSize(settings.tabSize);
        editor.getSession().setUseSoftTabs(settings.softTabs);
        editor.setHighlightActiveLine(settings.HighlightActiveLine);
        //to sroll
        editor.resize(settings.resize);
    }

    function otherConfigurations(editor) {
        // autocompletion
        var langTools = ace.require("ace/ext/language_tools");
        editor.setOptions({
            enableLiveAutocompletion: true,
            enableSnippets: true
        });

        StepProvider.all().then(function(response) {
            var snippetManager = ace.require("ace/snippets").snippetManager;

            var util = ace.require("ace/autocomplete/util");
            var originalRetrievePrecedingIdentifier = util.retrievePrecedingIdentifier;
            util.retrievePrecedingIdentifier = function(text, pos, regex) {
                if (!/^\s*(?:Given|When|Then|And|Neither)\s+/.test(text)) {
                    return originalRetrievePrecedingIdentifier(text, pos, regex);
                }
                return text.replace(/^\s+/, "");
            };

            snippetManager.register(response.data, "gherkin");
        });
    }


    //////////////////////////////////////////////////////////////////
    //
    // Create a listener to
    //
    // Parameters:
    //   editor - instance of the editor
    //
    //////////////////////////////////////////////////////////////////
    function listenChanged(editor) {

        editor.on('input', function() {
            //  console.log( editor.session.getUndoManager().isClean() )
            var tabUniqueId = getEditorID(editor);
            // if (editor.session.getUndoManager().isClean()) {
            //     markAsDirty(tabUniqueId, false)
            // } else {
            markAsDirty(tabUniqueId, true)
                // }
        });
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
    function bindKeys(editor,that) {
        var _this = that;
        editor.commands.addCommand({
            name: "saveFile",
            bindKey: {
                win: "Ctrl-S",
                mac: "Command-S",
                sender: "editor|cli"
            },
            exec: function(env) {
                saveFile(env,_this);
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

    function saveFile(editor,that) {
        var _this = that;
        var item = _this.scope.selected.item;
        item.content = editor.getSession().getValue();
        console.log(editor);
        console.log(_this.scope.selected.item);
        item.$save(function() {
            updateContent(item,editor,_this)
            //setAceContent(item, editor);
            toastr.success("File saved")
            var tabUniqueId = getEditorID(editor);
            markAsDirty(tabUniqueId, false)
        }, function(response) {
            var data = response.data;

            console.log(response)

            toastr.error(data.message, "The file contains " + data.exception)
        });

    };

    
    function updateContent(item,editor,that) {
        console.log(item)
        var fileName = item.fileProps.name || "";
        
        setAceContent(item, editor);        
        var _this = that;

        if (/\.js$/.test(fileName)) {

            //var _this = this;

            editor.getSession().setMode("ace/mode/javascript");

            // editor.commands.addCommand({
            //     name: "evaluate",
            //     bindKey: {
            //         win: "Ctrl-Enter",
            //         mac: "Command-Enter"
            //     },
            //     exec: evaluate,
            //     readOnly: false // should not apply in readOnly mode
            // });
            // editor.commands.addCommand({
            //     name: "activateSelectorGadget",
            //     bindKey: {
            //         win: "Ctrl-Shift-C",
            //         mac: "Command-Shift-C"
            //     },
            //     exec: activateSelectorGadget,
            //     readOnly: false // should not apply in readOnly mode
            // });
            
            _this.mode = _this.modeEnum.JS;
        }
        if (/\.feature$/.test(fileName)) {

            //var _this = this;

            editor.getSession().setMode("ace/mode/gherkin");

            // editor.commands.addCommand({
            //     name: "launchCucumber",
            //     bindKey: {
            //         win: "Ctrl+Enter",
            //         mac: "Ctrl+Enter"
            //     },
            //     exec: function(env) {
            //         //console.log(_this.scope);
            //         launchCucumber(env, _this.scope);
            //     },
            //     readOnly: false // should not apply in readOnly mode
            // });
            
            //set the mode
            console.log(_this)
            _this.scope.subscribeMessages();
           _this.mode = _this.modeEnum.FEATURE;
        }

        if (/\.yml$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/yaml");

            //set the mode
            //this.mode = this.modeEnum.YAML;
        }

        //change the settings of editor (themes, size, etc)
        setSettings(editor,_this.settings);


    }

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


pupinoIDE.service('FileLoader', function($q, FS) {

    var all = [];

    this.loadFile = function(props, editors) {
        console.debug(props)
            //load the file and create a new editor instance with the file loaded
        var newEditor;
        var result = editors.isOpen(props);

        var deferred = $q.defer();

        if (props === "") {
            //create an empty editor
            newEditor = editors.addInstance("", 1);
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
                newEditor = editors.addInstance(fileContent);
                deferred.resolve(newEditor);
            });
        }

        return deferred.promise;

    }

});


pupinoIDE.factory('SessionID', function($http, $q) {
    return {
        sessionId: function() {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.get('app/rest/sessionId')
                .then(function(response) {
                    return response.data;
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    };
});
