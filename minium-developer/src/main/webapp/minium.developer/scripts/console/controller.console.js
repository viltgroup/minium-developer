(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('ConsoleController', ConsoleController);

    ConsoleController.$inject = ['$scope', 'editorPreferences','MiniumEditor'];

    function ConsoleController($scope, editorPreferences,MiniumEditor) {
        console.log("Console ");

        var editors = MiniumEditor;

        var defaultSettings = {
            theme: 'ace/theme/monokai',
            fontSize: 14,
            printMargin: false,
            highlightLine: true,
            wrapMode: false,
            softTabs: true,
            HighlightActiveLine: true,
            tabSize: 2,
            resize: true,
            readOnly: true
        };


        var editor = ace.edit("console-log");
        editorPreferences.setEditorSettings(editor, defaultSettings);
        editor.getSession().setMode("batchfile")
        $scope.isLogVisible = true;
        console.log(editor);
        $scope.aceLoaded = function(_editor) {
            // Editor part
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        };

        var socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);


        stompClient.connect({}, function(frame) {

            stompClient.subscribe("/log", function(message) {
                console.log(message);
                editor.insert(message.body + "\n");
                editor.navigateLineEnd();
            });


        });

        $scope.toggleEditor = function() {
            $scope.isLogVisible = !$scope.isLogVisible;
            $(".console-log").toggle();
            $(window).trigger('resize');
        }


    }
})();
