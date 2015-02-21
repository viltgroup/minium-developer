
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

