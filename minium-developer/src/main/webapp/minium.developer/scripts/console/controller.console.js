(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('ConsoleController', ConsoleController);

    ConsoleController.$inject = ['$scope', 'ConsoleLog'];

    function ConsoleController($scope, ConsoleLog) {
        console.log("Console ");
        //scope only needed for linkFn function
        var c = new ConsoleLog($scope);
        var editor = c.editor;


        $scope.isActivePause = false;
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

                if ($scope.isActivePause == false) {
                    console.log(message);
                    editor.insert(message.body + "\n");
                    editor.navigateLineEnd();
                } else {
                    $scope.pausedLog.push(message.body + "\n");
                }

            });

        });

        $scope.addPausedLines = function() {
            angular.forEach($scope.pausedLog, function(data) {
                editor.insert(data);
            });
            $scope.pausedLog = [];
        }

        $scope.clearLog = function() {
            editor.getSession().setValue("");
        };

        $scope.gotoLine = function(lineNo, element) {
            editor.gotoLine(lineNo);
        };

        $scope.toggleEditor = function() {
            $scope.isLogVisible = !$scope.isLogVisible;

            $.cookie('log', $scope.isLogVisible, {
                expires: 7
            });

            $(".console-log").toggle();
            $(window).trigger('resize');
        }

        //show and hide the log from the cookie
        var initLog = function() {
            
            if ($.cookie('log') !== undefined) {
                $scope.isLogVisible = JSON.parse($.cookie('log'));
                if (!$scope.isLogVisible) {
                    $(".console-log").toggle();
                }
            } else {
                $scope.isLogVisible = true;
            }

            $(window).trigger('resize');
        }

        initLog();

    }
})();
