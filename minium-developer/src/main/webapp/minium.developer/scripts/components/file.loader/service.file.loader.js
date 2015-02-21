

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
