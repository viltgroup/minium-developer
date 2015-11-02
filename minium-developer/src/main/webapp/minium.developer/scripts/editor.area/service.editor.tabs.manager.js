/**
 * Manage all the editor and tabs
 * Create, close, set settings
 *
 */
'use strict';

miniumDeveloper.factory('MiniumEditor', function($rootScope, $translate, $filter, $modal, EvalService, TabFactory, EditorFactory, editorPreferences, openTab, WebDriverFactory) {
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
        this.paths = [];
        //scope
        this.scope = scope;

        this.$translate = $filter('translate');

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
            resize: true,
            readOnly: false
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
    MiniumEditor.prototype.addInstance = function(fileContentAndProps, num) {

        // the panel id is a timestamp plus a random number from 0 to 10000
        var tabUniqueId = new Date().getTime() + Math.floor(Math.random() * 10000);

        var fileProps = fileContentAndProps.fileProps || "";
        var fileContent = fileContentAndProps.content || "";
        //create the DOM elements
        TabFactory.createTab(tabUniqueId, fileProps, fileContentAndProps.type);

        //inicialize editor and create and configure the editor
        //returns an object like an object with:
        //an editor and the mode(type of file feature,js,yml)
        var obj = EditorFactory.create(tabUniqueId, fileProps, fileContent, this.settings);

        var editor = obj.editor;
        this.mode = obj.mode;

        var fileName = fileProps.name || "";

        var relativeUri = fileProps.relativeUri || "";
        var editorType = fileContentAndProps.type || fileProps.type;

        //ADD EVENT HANDLERS to the editor
        addEventListeners(editor, fileName, this);

        var newEditor = {
            id: tabUniqueId,
            instance: editor,
            mode: this.mode,
            type: editorType,
            file: fileContentAndProps
        }

        //add this instance to the list of editors instance
        this.editors.push(newEditor);

        this.paths.push(relativeUri);

        openTab.store(this.editors);

        this.resizeEditors();

        return newEditor;

    }

    /////////////////////////////////////////////////////////////////
    //
    // Get all the instances
    //
    // Return from the all the instances of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getEditors = function() {
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
    // Get editor Id from is relative uri
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.getIdFromRelativeUri = function(relativeUri) {
        var id;
        this.editors.forEach(function(editor) {
            if (editor.relativeUri == relativeUri) {
                id = editor.id;
                return true;
            }
        });
        return id;
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
            editorPreferences.setEditorSettings(editor, settings);
        });

        editorPreferences.storeEditorPreferences(this.settings);

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

        $.each(this.editors, function(i, editor) {
            if (decodeURIComponent(editor.file.fileProps.relativeUri) == relativeUri) {
                id = editor.id;
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
    // Get the Editor session by ID
    //
    // Return from the ID the instance of the editor
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.resizeEditors = function(containerHeight) {
        var editor = null;
        var margin = 80;
        var containerHeight
        if ($(window).width() >= 768) {
            containerHeight = $(window).height() - $('#toolbar').height() - $('.navbar').height() - margin;
        } else {
            containerHeight = $(window).height() - $('.navbar').height() - margin;

        }

        if ($(".console-log").is(":visible")) {
            containerHeight = containerHeight - 200;
        }

        $.each(this.editors, function(i, obj) {
            var panel = "#editor_" + obj.id;
            $(panel).css({
                'height': containerHeight
            });
            obj.instance.resize();
        });
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
        openTab.store(this.editors);
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
        activateSelectorGadget(editor, this.scope);
    };

    ////////////////////////////////////////////////////////////////
    //
    //Evaluate Expression
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.evaluate = function(editor) {
        evaluate(editor, this.scope, this);
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
    MiniumEditor.prototype.launchCucumber = function(editor, runAll) {
        launchCucumber(editor, this.scope, runAll);
    };


    ////////////////////////////////////////////////////////////////
    //
    // Store the open
    //
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.storeOpenTabs = function() {
        openTab.store(this.editors);
    };


    /////////////////////////////////////////////////////////////////
    //
    // Check if there any editor dirty
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.areDirty = function() {
        var isDirty = false;
        var that = this;

        for (var i = this.editors.length - 1; i >= 0; i--) {
            if (this.isDirty(this.editors[i].id) == true) {
                isDirty = true;
                break;
            }
        }
        return isDirty;
    }

    ////////////////////////////////////////////////////////////////
    //
    // Check if the tab is dirty
    //
    /////////////////////////////////////////////////////////////////
    MiniumEditor.prototype.isDirty = function(id) {
        var elem = $("#save_" + id);
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
        // var panelId = element.closest("li").remove().attr("aria-controls");
        $("#panel_nav_" + id).remove();
        $("#panel_" + id).remove();
        tabs.tabs("refresh");
        //remove the instance of tabs that we closed
        this.deleteSession(id);
    };

    ////////////////////////////////////////////////////////////////
    //
    // Handler for Mouse Wheel Event (ctrl + scroll)
    // To resize de font of the editors
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

                event.preventDefault();
            }
        });
    }

    ////////////////////////////////////////////////////////////////
    //
    // PRIVATE FUCNTIONS
    //
    /////////////////////////////////////////////////////////////////

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


    function addEventListeners(editor, fileName, that) {

        specificHandlers(fileName, editor, that);

        if (fileName !== "") {
            // add listener to input
            listenerOnChange(editor, that)
        }

        //create event listeners (bind keys events)
        bindKeys(editor, that);

    }

    function specificHandlers(fileName, editor, that) {

        var _this = that;

        switch (_this.mode) {

            case _this.modeEnum.JS:
                editor.commands.addCommand({
                    name: "evaluate",
                    bindKey: {
                        win: "Ctrl-Enter",
                        mac: "Command-Enter"
                    },
                    exec: function(env) {
                        evaluate(env, _this.scope, _this);
                    },
                    readOnly: false // should not apply in readOnly mode
                });
                editor.commands.addCommand({
                    name: "activateSelectorGadget",
                    bindKey: {
                        win: "Ctrl-Shift-C",
                        mac: "Command-Shift-C"
                    },
                    exec: function(env) {
                        activateSelectorGadget(env, _this.scope);
                    },
                    readOnly: false // should not apply in readOnly mode
                });
                break;

            case _this.modeEnum.FEATURE:

                editor.commands.addCommand({
                    name: "launchCucumber",
                    bindKey: {
                        win: "Ctrl+Enter",
                        mac: "Command+Enter"
                    },
                    exec: function(env) {
                        console.log(env);
                        launchCucumber(env, _this.scope, false);
                    },
                    readOnly: true // should be apply in readOnly mode if TRUE
                });

                _this.scope.subscribeMessages();
                break;

            default:

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
            exec: function(env) {},
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
    function listenerOnChange(editor, that) {
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

        // if its an aux console tab, so we dont want to save the file
        if (_this.scope.activeEditor.type !== "FILE") {
            toastr.error(_this.$translate('messages.files.cannot.be.saved'))
            return;
        }
        var item = _this.scope.activeEditor.file;
        item.content = editor.getSession().getValue();

        item.$save(function() {

            var tabUniqueId = getEditorID(editor);
            updateContent(item, editor, _this, tabUniqueId);
            toastr.success(_this.$translate('messages.files.saved'));
            markAsDirty(tabUniqueId, false);

        }, function(response) {
            //clean markers
            editor.getSession().clearBreakpoints();
            var data = response.data;
            //get the first number on the string && hightlightLine the
            var line = data.message.match(/\d+/) || 0;
            _this.hightlightLine((line - 1), editor, "failed");

            toastr.error(data.message, _this.$translate('messages.files.error', {
                data: data.exception
            }))
        });

    };

    //TODO
    function createNewFile(editor, that) {
        //open modal
        //create the file in the filesystem
        //get the relativeURI
        //update the relative uri
        //update the tab name
    }


    function updateContent(item, editor, that, tabUniqueId) {
        var fileName = item.fileProps.name || "";

        var _this = that;

        var mode = EditorFactory.setMode(fileName, editor);

        switch (mode) {
            case _this.modeEnum.FEATURE:
                setDocumentValue(item, editor, tabUniqueId);
                _this.mode = mode;
                _this.scope.subscribeMessages();
                break;
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
    function evaluate(editor, scope, that) {
        //functions needed to be here
        var runningTest = Ladda.create(document.querySelector('#runningTest'));

        /*
         * check if a webdriver if launched
         */
        WebDriverFactory.isCreated().success(function(data) {
            //start tests
            runningTest.start();
            scope.testExecuting = true;

            var range = editor.getSelectionRange();
            var session = editor.getSession();

            var line = range.start.row;
            var code = range.isEmpty() ? session.getLine(line) : session.getTextRange(range);

            var request = EvalService.eval({
                    expression: code,
                    filePath: $rootScope.activeEditor.file.fileProps.relativeUri,
                    lineNumber: line + 1
                })
                .success(function(data) {
                    if (data.size >= 0) {
                        toastr.success(that.$translate('evaluator.matching', {
                            data: data.size
                        }));
                    } else {
                        //undefined is not user friendly
                        //so when an undefined come we
                        if (_.escape(data.value) === "undefined") {
                            toastr.success("OK (" + _.escape(data.value) + ")");
                        } else {
                            toastr.success(data.value ? _.escape(data.value) : that.$translate('evaluator.no_value'));
                        }
                    }
                    stopExecutionBtn(runningTest, scope);
                })
                .error(function(exception) {
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
                    stopExecutionBtn(runningTest, scope);

                });
        }).
        error(function(data) {
            scope.setWebDriverMsg(true);
            scope.relaunchEval = true;
            scope.openModalWebDriverSelect();
            stopExecutionBtn(runningTest, scope);

        });

    };

    function activateSelectorGadget(editor, that) {

        WebDriverFactory.isCreated().success(function(data) {
            var modalInstance = $modal.open({
                templateUrl: 'selectorGadgetModal.html',
                controller: 'SelectorGadgetCtrl',
                resolve: {
                    editor: function() {
                        return editor;
                    }
                }
            });
        }).error(function(data) {
            that.setWebDriverMsg(true);
            that.openModalWebDriverSelect();
        });

    };
    /**
     * Stops the ladda buton
     */
    function stopExecutionBtn(runningTest, that) {
        runningTest.stop();
        that.testExecuting = false;
    }

    function launchCucumber(editor, scope, isRunAll) {
        var scope = scope;

        var featureToRunProps = scope.activeEditor.file.fileProps;

        if (!featureToRunProps) return;

        if (!scope.activeEditor.type) {
            //scope.saveFile();
        }

        if (isRunAll === true) {
            var launchParams = {
                fileProps: featureToRunProps
            };
        } else {
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
                fileProps: featureToRunProps
            };
        }

        //launch the execution
        scope.launch(launchParams);
    };


    return new MiniumEditor;

});
