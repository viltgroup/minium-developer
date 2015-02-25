
miniumDeveloper.service('TabLoader', function($q, FS) {

    var all = [];

    /**
     * Load a file and check if the is already open on a tab
     * @param  {[type]} file    the property file
     * @param  {[type]} editors the service with the editors info
     * @return a promise
     */
    this.loadFile = function(file, editors) {
        //load the file and create a new editor instance with the file loaded
        var newEditor = {};
        var result = editors.isOpen(file);
        var deferred = $q.defer();

        var emptyEditor = function() {
            //create an empty editor
            newEditor = editors.addInstance("", 1);
        }
        
        if (file === "") {                              //if the is empty
            //create an empty editor
            emptyEditor();
            deferred.resolve(newEditor);
        } else if (result.isOpen) {                    //if a tab is already open
            var id = result.id;
            //tab is already open
            var tab = "#panel_" + id;
            var index = $('#tabs a[href="' + tab + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);
        } else {                                      //if theres no tab opened with this file

            var path = file.relativeUri || file;

            //get the file
            FS.get({
                path: path
            }, function(fileContent) {
                //succes handler file exists 
                result = editors.isOpen(file);
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
