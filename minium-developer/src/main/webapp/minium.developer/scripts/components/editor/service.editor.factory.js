/**
 * Creates and initialize an editor instance
 *
 */
miniumDeveloper.service('EditorFactory', function(editorPreferences, StepProvider, SnippetsProvider, StepSnippetsProvider, MiniumMethodsProvider) {

    //init the possible modes
    var modeEnum = {
        JS: "JS",
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

        var fileName = fileProps.name || "console";

        //create a new session and set the content
        setAceContent(fileContent, editor);

        //set mode
        var mode = this.setMode(fileName, editor);

        //change the settings of editor (themes, size, etc)
        editorPreferences.setEditorSettings(editor, settings);

        // resize the editor
        editor.resize();

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
            iniJSSnippets(editor);

        }
        if (/\.feature$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/gherkin");
            mode = modeEnum.FEATURE;
            initCucumberSnippets(editor);
        }
        if (/\.yml$/.test(fileName)) {
            editor.getSession().setMode("ace/mode/yaml");
            mode = modeEnum.YAML;
        }
        //if untitled file
        if (fileName === 'console') {
            editor.getSession().setMode("ace/mode/javascript");
            mode = modeEnum.JS;
            iniJSSnippets(editor);
        }
        return mode;
    }

    var iniJSSnippets = function(editor) {
        // autocompletion
        var langTools = ace.require("ace/ext/language_tools");
        //snippets
        var snippetManager = ace.require("ace/snippets").snippetManager;

        // //step snippets
        var snippets = StepSnippetsProvider.all();
        snippetManager.register(snippets, "javascript");

        var jsonUrl = "minium.developer/ext/minium/methods.json";

        var miniumAutoCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                $.getJSON(jsonUrl,
                    function(wordList) {
                        callback(null, wordList.map(function(ea) {
                            return {
                                caption: ea.caption,
                                description: ea.description,
                                snippet: ea.content,
                                meta: ea.type
                            }
                        }));
                    })
            },
            getDocTooltip: function(item) {
                if (!item.docHTML) {
                    item.docHTML = [
                        "<b>", item.caption, "</b>", "<hr></hr>",
                        item.description
                    ].join("");
                }
            }
        };

        editor.completers = [langTools.snippetCompleter, langTools.textCompleter, miniumAutoCompleter]

        editor.commands.on("afterExec", function(e) {

            // when the token is a point only put the completer with minium functions
            if (e.command.name == "insertstring" && e.args === ".") {
                editor.completers = [miniumAutoCompleter]
                editor.execCommand("startAutocomplete")
            } else {
                editor.completers = [langTools.snippetCompleter, langTools.textCompleter, miniumAutoCompleter]
            }
        })

        editor.setOptions({
            enableBasicAutocompletion: true, //this enable a autocomplete (ctrl + space)
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

    }

    //////////////////////////////////////////////////////////////////
    //
    // Configure the snippets of the editor
    //
    //////////////////////////////////////////////////////////////////
    var initCucumberSnippets = function(editor) {
        // autocompletion
        var langTools = ace.require("ace/ext/language_tools");
        //snippets
        var snippetManager = ace.require("ace/snippets").snippetManager;

        editor.$blockScrolling = Infinity;

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

    }

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
