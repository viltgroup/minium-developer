//Factories
angular.module('minium.developer')
    .factory('ConsoleLog', ['$compile', 'editorPreferences', function($compile, editorPreferences) {

        function ConsoleLog(scope) {

            var defaultSettings = {
                theme: 'ace/theme/monokai',
                fontSize: 14,
                printMargin: false,
                highlightLine: true,
                wrapMode: true,
                softTabs: true,
                HighlightActiveLine: true,
                tabSize: 2,
                resize: true,
                readOnly: true
            };

            this.editor = ace.edit("console-log");

            this.editor.getSession().setMode("batchfile");

            editorPreferences.setEditorSettings(this.editor, defaultSettings);

            var that = this;
            this.editor.on("guttermousedown", function(e) {

                var target = e.domEvent.target;
                if (target.className.indexOf("ace_gutter-cell") == -1)
                    return;
                if (!that.editor.isFocused())
                    return;
                if (e.clientX > 25 + target.getBoundingClientRect().left)
                    return;

                var row = e.getDocumentPosition().row;
                if (e.editor.session.getBreakpoints()[row]) {
                    e.editor.session.clearBreakpoint(row);
                    var elemSelector = "#breakpoint_" + row;
                    $(elemSelector).remove();
                } else {
                    e.editor.session.setBreakpoint(row);
                    //add new button that go to the line
                    var template = '<button type="button" id="breakpoint_' + row + '" class="btn btn-inverse active btn-xs" ng-click="gotoLine(' + (row + 1) + ',\'' + 'console-log' + '\')">Marker L ' + (row + 1) + '</button>   ';
                    var linkFn = $compile(template);
                    var content = linkFn(scope);
                    $("#breakpoints").append(content);
                }
                e.stop();
            })

            

        }

        return ConsoleLog;
    }])
