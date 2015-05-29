/**
 * This service load and store open tabs from cookies
 *
 */
miniumDeveloper.service('openTab', function() {

    this.store = function(editors) {

        var reltivepaths = [];
        editors.forEach(function(editor) {
            if (editor.relativeUri != undefined && editor.relativeUri !== "") {
                reltivepaths.push(editor.relativeUri);
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
