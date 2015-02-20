'use strict';

miniumDeveloper.factory('launcherService', function($http) {
    return {
        launch: function(params) {
            return $http.post("/app/rest/launch", params);
        },
        dotcucumber: function() {
            return $http.get("/app/rest/dry-run", {
                params: {
                    dotcucumber: true
                }
            });
        },
        autocomplete: function(autocompleteReq) {
            return $http.post("/app/rest/autocomplete", autocompleteReq);
        },
        stop: function() {
            return $http.post("/app/rest/stop", {});
        },
        isRunning: function() {
            return $http.get("/app/rest/isRunning");
        },
        stepDefinitions: function() {
            return $http.get("/app/rest/stepDefinitions");
        }
    };
})

miniumDeveloper.factory('StepProvider', function($http) {
    return {
        all: function() {
            return $http.get("/app/rest/snippets");
        }
    };
});

miniumDeveloper.factory('SnippetsProvider', function() {
    return {
        all: function() {
            return [{
                name: "scenario",
                trigger: "sc",
                content: [
                    "Scenario: ${1:Little description here}",
                    "  Given ${2:something}"
                ].join("\n")
            }, {
                name: "scenario_outline",
                trigger: "sco",
                content: [
                    "Scenario Outline: ${1:Little description here}",
                    "  Given ${2:something}",
                    "  Examples:",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "feature",
                trigger: "feat",
                content: [
                    "Feature: ${1:Little description here}                                                                                                                                                                                                                                                              ",
                    " ",
                    "  Scenario Outline: ${2:Little description here}",
                    "    Given ${3:something}",
                    "    Examples:",
                    "    | ${4:attr1} | ${4:attr2} |"
                ].join("\n")
            }];
        }
    };
})


miniumDeveloper.factory('StepSnippetsProvider', function() {

    var KEYWORD = {
        GIVEN: "Given", // optionally you can give the object properties and methods
        WHEN: "When",
        THEN: "Then"
    };

    var createStep = function(keyword) {
        return keyword + "(/^${1:step}'(.*?)'$/, function(${2:arg}) { \n\n });"
    }

    return {
        all: function() {
            return [{
                name: "When",
                trigger: "when",
                content: [
                    createStep(KEYWORD.WHEN)
                ].join("\n")
            }, {
                name: "Given",
                trigger: "given",
                content: [
                    createStep(KEYWORD.GIVEN)
                ].join("\n")
            }, {
                name: "Then",
                trigger: "then",
                content: [
                    createStep(KEYWORD.THEN)
                ].join("\n")
            }];
        }
    };
})
miniumDeveloper.factory('ReportService', function($resource) {
    return $resource('mocks/result.json', {}, {
        getData: {
            method: 'GET',
            isArray: false
        }
    });
})
miniumDeveloper.factory('SelectorGadgetService', function($http) {
    return {
        activate: function() {
            return $http.post("/app/rest/js/selectorGadget/activate");
        },
        deactivate: function() {
            return $http.post("/app/rest/js/selectorGadget/deactivate");
        },
        cssSelector: function() {
            return $http.post("/app/rest/js/selectorGadget/cssSelector");
        }
    };
})
miniumDeveloper.factory('EvalService', function($http) {
    return {
        eval: function(params) {
            return $http({
                method: "POST",
                url: '/app/rest/js/eval',
                data: params ? $.param(params) : '',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        },
        clean: function() {
            return $http({
                method: "POST",
                url: '/app/rest/js/clean'
            });
        }
    };
})


miniumDeveloper.factory('FeatureFacade', function() {
    /**
     * Constructor
     */
    function FeatureFacade(data, snippetsForUndefinedSteps) {
        this.feature = data;
        this.snippetsForUndefinedSteps = snippetsForUndefinedSteps;
        var elements = this.process(data);
    }

    /**
     * Public method, assigned to prototype
     */

    FeatureFacade.prototype.process = function(data) {
        var r = true;
        this.notPassingsteps = jsonPath.eval(data, "$..steps[?(@.status!='PASSED')]");
        var failingSteps = jsonPath.eval(data, "$..steps[?(@.status=='FAILED')]");
        var skippedSteps = jsonPath.eval(data, "$..steps[?(@.status=='UNDEFINED')]");
        var passedSteps = jsonPath.eval(data, "$..steps[?(@.status=='PASSED')]");
        var durations = jsonPath.eval(data, "$..duration");

        var totalDuration = 0;
        $.each(durations, function() {
            totalDuration += this;
        });

        this.resultsSummary = {
            runCount: passedSteps.length + this.notPassingsteps.length,
            passed: passedSteps.length,
            failures: failingSteps.length,
            skipped: skippedSteps.length,
            notPassingsteps: this.notPassingsteps.length,
            runTime: totalDuration / 1000000.0
        }

    };

    /**
     * Return the constructor function
     */
    return FeatureFacade;
});

/*
Factory to register backends
 */
miniumDeveloper.factory('backendFactory', function($http) {
    return {
        register: function(params) {
            return $http.post("/app/rest/backends/register", params);
        }
    };
})




miniumDeveloper.service('FileLoader', function($q, FS) {

    var all = [];

    this.loadFile = function(props, editors) {
        //load the file and create a new editor instance with the file loaded
        var newEditor = {};
        var result = editors.isOpen(props);
        var deferred = $q.defer();

        var emptyEditor = function() {
            //create an empty editor
            newEditor = editors.addInstance("", 1);
        }

        if (props === "") {
            //create an empty editor
            emptyEditor();
            deferred.resolve(newEditor);
        } else if (result.isOpen) {
            var id = result.id;
            //tab is already open
            var tab = "#panel_" + id;
            var index = $('#tabs a[href="' + tab + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);
        } else {

            var path = props.relativeUri || props;
            FS.get({
                path: path
            }, function(fileContent) {
                //succes handler file exists 
                result = editors.isOpen(props);
                if (result.isOpen) {
                    var id = result.id;
                    //tab is already open
                    var tab = "#panel_" + id;
                    var index = $('#tabs a[href="' + tab + '"]').parent().index();
                    $("#tabs").tabs("option", "active", index);
                } else {
                    newEditor = editors.addInstance(fileContent);
                    deferred.resolve(newEditor);
                }

            }, function() {
                //error handler file dont found
                //so create an empty editor
                emptyEditor();
                deferred.reject(newEditor);
            });

        }
        return deferred.promise;

    }

});


miniumDeveloper.service('SessionID', function($http, $q) {
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

// This module creates and append the new elements create for new tabs
miniumDeveloper.factory('TabFactory', function($http, $q) {
    var tabFactory = {
        height: '700',
    };

    tabFactory.createTab = function(tabUniqueId, fileProps) {
        var fileName = fileProps.name || "untitled";

        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" data-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '" title="' + fileProps.relativeUri + '" name="' + fileName + '">' + fileName + '<span id="save_' + tabUniqueId + '" class="hide">*</span></a> <span class="ui-icon ui-icon-close close-tab" ></span></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

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
        newEditorElement.height(this.height);
    };

    return tabFactory;

});




// this service load and store preferences from cookies
miniumDeveloper.factory('editorPreferences', function($cookieStore) {
    var EditorPreferences = {};


    /**
     * Returns the settings from a coookie if the cookie exists,
     * return the default settings if theres no cookie
     * @returns {settings}
     **/
    EditorPreferences.loadEditorPreferences = function(defaultsSettings) {
        var editorPreferences = $cookieStore.get("editorPreferences");
        editorPreferences = editorPreferences ? JSON.parse(editorPreferences) : {};
        return _.defaults(editorPreferences, defaultsSettings);
    };


    EditorPreferences.storeEditorPreferences = function(settings) {

        $cookieStore.put("editorPreferences", JSON.stringify(settings), {
            expires: 365 * 5
        });

    }

    EditorPreferences.setEditorSettings = function(editor, settings) {

        editor.setTheme(settings.theme);

        editor.setShowPrintMargin(settings.printMargin);
        editor.setFontSize(settings.fontSize);
        editor.getSession().setTabSize(settings.tabSize);
        editor.getSession().setUseSoftTabs(settings.softTabs);
        editor.setHighlightActiveLine(settings.HighlightActiveLine);
        //to sroll
        editor.resize(settings.resize);
    }

    return EditorPreferences;

});


// this service load and store open tabs from cookies
miniumDeveloper.service('openTab', function($cookieStore) {

    this.store = function(editors) {

        var reltivepaths = [];
        editors.forEach(function(editor) {
            console.debug(editor.relativeUri)
            reltivepaths.push(editor.relativeUri);
        });

        $.cookie('openTabs', reltivepaths, {
            expires: 7
        });

        console.debug("cookie stored")
    };

    this.load = function() {
        var openTabs = $.cookie('openTabs');
        var paths = openTabs !== undefined ? openTabs.split(",") : [];
        return paths;
    }

});

// This module creates and append the new elements create for new tabs
miniumDeveloper.service('EditorFactory', function(editorPreferences, StepProvider, SnippetsProvider, StepSnippetsProvider) {


    //init the possible modes
    var modeEnum = {
        JS: "JS", // optionally you can give the object properties and methods
        FEATURE: "FEATURE",
        YAML: "YAML"
    };

    /**
     * Constructor, with class name
     */
    this.create = function(tabUniqueId, fileContent, settings) {

        var fileProps = fileContent.fileProps || "";
        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);

        var fileName = fileProps.name || "";
        //create a new session and set the content
        setAceContent(fileContent, editor);

        //set mode 
        var mode = this.setMode(fileName, editor);

        //change the settings of editor (themes, size, etc)
        editorPreferences.setEditorSettings(editor, settings);

        // resize the editor
        editor.resize();

        //init snippets like autocompletion
        initSnippets(editor);

        return {
            editor: editor,
            mode: mode
        };
    }


    this.setMode = function(fileName, editor) {
        var mode;
        if (/\.js$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/javascript");
            mode = modeEnum.JS;
        }
        if (/\.feature$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/gherkin");
            mode = modeEnum.FEATURE;
        }
        if (/\.yml$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/yaml");
            mode = modeEnum.YAML;
        }

        return mode;
    }

    //////////////////////////////////////////////////////////////////
    //
    // Configure the snippets of the editor
    //
    //////////////////////////////////////////////////////////////////
    var initSnippets = function(editor) {
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

        snippetManager.register(snippets, "gherkin");


        //step snippets
        snippets = StepSnippetsProvider.all();
        snippetManager.register(snippets, "javascript");
    }

    // from minium app
    var evaluate = function(editor) {
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

    /**
     * Set the content of the session
     * @param {item} the properties of the file
     * @param {editor} the editor than we gonna edit
     **/
    var setAceContent = function(item, editor) {

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


});


// This module creates and append the new elements create for new tabs
miniumDeveloper.factory('Editor', function() {
    /**
     * Constructor, with class name
     */
    function Editor(firstName, lastName, role, organisation) {
        // Public properties, assigned to the instance ('this')
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.organisation = organisation;
    }

    /**
     * Public method, assigned to prototype
     */
    Editor.prototype.getFullName = function() {
        return this.firstName + ' ' + this.lastName;
    };

    /**
     * Private property
     */
    var possibleRoles = ['admin', 'editor', 'guest'];

    /**
     * Private function
     */
    function checkRole(role) {
        return possibleRoles.indexOf(role) !== -1;
    }

    /**
     * Static property
     * Using copy to prevent modifications to private property
     */
    Editor.possibleRoles = angular.copy(possibleRoles);

    /**
     * Return the constructor function
     */
    return Editor;

});
