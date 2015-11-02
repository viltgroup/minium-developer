/**
 * This service load and store open tabs from cookies
 *
 */
miniumDeveloper.service('openTab', function() {

    this.store = function(editors) {

        var reltivepaths = [];
        editors.forEach(function(editor) {
            var relativeUri = editor.file.fileProps.relativeUri;
            if (relativeUri != undefined && relativeUri !== "" && editor.type === "FILE") {
                reltivepaths.push(relativeUri);
            }
        });

        $.cookie('openTabs', reltivepaths, {
            expires: 7
        });
    };

    this.load = function() {
        var openTabs = $.cookie('openTabs');
        var paths = (openTabs !== undefined && openTabs !== "") ? openTabs.split(",") : [];
        return paths;
    }

});
