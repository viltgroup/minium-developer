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

