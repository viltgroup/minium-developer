(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('ConsoleController', ConsoleController);

    ConsoleController.$inject = ['$rootScope', '$scope', '$state', 'ConsoleLog', 'stackTraceParser'];

    function ConsoleController($rootScope, $scope, $state, ConsoleLog, stackTraceParser) {

        //////////////////////////////////////////////////////////////////
        // websockets 
        //////////////////////////////////////////////////////////////////
        var socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);

        stompClient.connect({}, function(frame) {

            stompClient.subscribe("/log", function(message) {

                if ($scope.isActivePause == false) {
                    console.log(message);
                    var stackTrace;
                    if (!$scope.showCompleteStackTrace) {
                        //parse the stacktarce
                        stackTrace = stackTraceParser.parseLine(message.body);
                    } else {
                        //show the complete stacktrace
                        stackTrace = message.body + '\n';
                    }
                    editor.insert(stackTrace);
                    editor.navigateLineEnd();
                } else {
                    $scope.pausedLog.push(message.body + '\n');
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

        /**
         * Create linkable links in the editor
         *
         */
        var addHoverLinkEvent = function(editor) {
            var HoverLink = ace.require("hoverlink").HoverLink
            editor.hoverLink = new HoverLink(editor);
            editor.hoverLink.on("open", function(e) {
                console.log(e)
                var clickedValue = e.value.split(":");
                //split the uri and the line (example: step/stepfile.js:16 )
                var relativeUri = clickedValue[0];
                var line = clickedValue[1];

                $scope.loadFile(decodeURIComponent(relativeUri)).then(function(result) {
                    if (line) {
                        $rootScope.active.session.gotoLine(line);
                    }
                });
            })
        }

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

        $scope.toggleStackTrace = function() {
            $scope.showCompleteStackTrace = !$scope.showCompleteStackTrace;
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

        //////////////////////////////////////////////////////////////////
        // INITIALIZATIONS
        //////////////////////////////////////////////////////////////////

        initLog();

        //scope only needed for angular linkFn function
        var c = new ConsoleLog($scope);
        var editor = c.editor;

        addHoverLinkEvent(editor);

        $scope.isActivePause = false;
        $scope.showCompleteStackTrace = false;
        console.log(editor);
    }

})();
