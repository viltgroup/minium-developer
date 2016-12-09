(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('ContextMenuEditorController', ContextMenuEditorController);

    ContextMenuEditorController.$inject = ['$rootScope', '$scope', '$translate', '$state','RecorderService', 'WebDriverFactory'];

    function ContextMenuEditorController($rootScope, $scope, $translate, $state, RecorderService, WebDriverFactory) {

        $scope.recorderIsAvailable = false;
        WebDriverFactory.isRecorderAvailableForBrowser("chrome").success(function(isAvailable) {
            $scope.recorderIsAvailable = isAvailable;
        });

        $scope.test = function() {
            $scope.previewFeatureWithExternalCucumberData();
        }

        $scope.addSnippet = function() {

            var currline = $rootScope.activeEditor.instance.getSelectionRange().start.row;
            var session = $rootScope.activeEditor.instance.session;

            session.insert({
                row: currline,
                column: 0
            }, "\t# @source:file.csv");

            // set the selected range
            // TODO: Refactor
            var Range = require("ace/range").Range;
            $rootScope.activeEditor.instance.selection.setRange(new Range(currline, 11, currline, 19) );
            $rootScope.activeEditor.instance.focus();
        }

        $scope.search = function() {
            var editor =  $rootScope.activeEditor.instance;
            $state.go("global.editorarea.sub.open", {
                line: editor.getSession().doc.getTextRange(editor.selection.getRange())
            }, {
                notify: false,
            });

        }

        $scope.pasteRecordedScript = function() {
            RecorderService.getScript().success(function(script) {
                if (script) {
                    var editor = $rootScope.activeEditor.instance;
                    var session = editor.getSession();
                    var range = editor.getSelectionRange();
                    session.remove(range);
                    session.insert(range.start, script);
                } else {
                    $translate('recorder.messages.no_recorded_script')
                        .then(function(translatedMessage) {
                            toastr.warning(translatedMessage);
                        });
                }
            });
        }
    }

})();
