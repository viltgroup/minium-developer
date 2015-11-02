/**
 * Load the file and create new tabs
 * When we want to open a new file, the logic is here
 *
 */
miniumDeveloper.service('TabLoader', function($q, FS) {

    var all = [];

    /**
     * Load a file and check if the is already open on a tab
     * @param  {[type]} file    the property file
     * @param  {[type]} editors the service with the editors info
     * @return a promise
     */
    this.loadFile = function(relativeUri, editors) {
        //load the file and create a new editor instance with the file loaded
        var newEditor = {};
        var result = editors.isOpen(relativeUri);
        var deferred = $q.defer();

        var emptyEditor = function() {
            //create an empty editor
            var fileProps = {
                content: "// this editor can be used as a javascript expression evaluator\n// cannot be saved\n\n",
                type: "console",
                fileProps: ""
            }
            newEditor = editors.addInstance(fileProps, 1);
            //go to line
            newEditor.instance.gotoLine(4);
        }

        if (relativeUri === "") { //if the is empty
            //create an empty editor
            emptyEditor();
            deferred.resolve(newEditor);
        } else if (result.isOpen) { //if a tab is already open
            var id = result.id;
            //tab is already open
            var tab = "#panel_" + id;
            var index = $('#tabs a[href="' + tab + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);

            newEditor = editors.getSession(id);
            deferred.resolve(newEditor);
        } else { //if theres no tab opened with this file

            //get the file
            FS.get({
                path: relativeUri
            }, function(fileContentAndProps) {

                //succes handler file exists
                result = editors.isOpen(relativeUri);
                if (result.isOpen) {
                    var id = result.id;
                    //tab is already open
                    var tab = "#panel_" + id;
                    var index = $('#tabs a[href="' + tab + '"]').parent().index();
                    $("#tabs").tabs("option", "active", index);
                } else {
                    newEditor = editors.addInstance(fileContentAndProps);
                    deferred.resolve(newEditor);
                }

            }, function() {
                //error handler file dont found
                deferred.reject(newEditor);
            });

        }
        return deferred.promise;

    }

});
