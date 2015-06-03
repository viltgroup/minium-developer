(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('ConsoleController', ConsoleController);

    ConsoleController.$inject = ['$rootScope', '$scope', '$state', 'ConsoleLog', 'stackTraceParser'];

    function ConsoleController($rootScope, $scope, $state, ConsoleLog, stackTraceParser) {
        console.log("Console ");
        //scope only needed for linkFn function
        var c = new ConsoleLog($scope);
        var editor = c.editor;

        var HoverLink = ace.require("hoverlink").HoverLink
        editor.hoverLink = new HoverLink(editor);
        editor.hoverLink.on("open", function(e) {
            console.log(e)
            var clickedValue = e.value.split(":");
            //split the uri and the line (example: step/stepfile.js:16 )
            var relativeUri = clickedValue[0];
            var line = clickedValue[1];

            $scope.loadFile(decodeURIComponent(relativeUri)).then(function(result) {
                if( line ){
                     $rootScope.active.session.gotoLine(line);
                }
            });
        })

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


        //////////////////////////////////////////////////////////////////
        // websockets 
        //////////////////////////////////////////////////////////////////
        var socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) {

            stompClient.subscribe("/log", function(message) {

                if ($scope.isActivePause == false) {
                    console.log(message);
                    var stackTraceParsed = stackTraceParser.parseLine(message.body);
                    editor.insert(stackTraceParsed);
                    editor.navigateLineEnd();
                } else {
                    $scope.pausedLog.push(message.body + "\n");
                }

            });

        });

        //////////////////////////////////////////////////////////////////
        // STACKTRACE
        //////////////////////////////////////////////////////////////////
        $scope.stackTraceParser = function(stackTrace) {
            return stackTraceParser.parseInHtml(stackTrace);
        }

        //////////////////////////////////////////////////////////////////
        // EDITOR AUX FUNCTIONS
        //////////////////////////////////////////////////////////////////

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
            $(".console-log").toggle();
            $(window).trigger('resize');
        }


        //////////////////////////////////////////////////////////////////
        // INITIALIZATIONS
        //////////////////////////////////////////////////////////////////

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
