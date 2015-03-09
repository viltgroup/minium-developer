/**
 * Creates and initialize an editor instance
 * 
 */
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