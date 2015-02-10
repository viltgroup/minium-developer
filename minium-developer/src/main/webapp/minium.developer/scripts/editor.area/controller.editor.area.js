'use strict';

angular.module('minium.developer')
    .controller('EditorAreaController', function($rootScope, $scope, $log, $timeout, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, EvalService, FeatureFacade, FileFactory, FileLoader, SessionID, GENERAL_CONFIG) {

        //is the actual file selected
        //every time we move to other tab 
        //this value is being update
        $scope.selected = {};
        $scope.selectedNode = "";

        $scope.resultsSummary = {};

        //init variables
        $scope.testExecuting = false;
        //mode of the open file
        $scope.mode = "";

        //store the active instance of the editor
        $scope.activeSession = null;
        //store the editor where the test are launched 
        $scope.launchTestSession = null;

        $scope.activeID = null;

        //init the minium editor 
        //that manage editor and tabs
        //service is shared by controllers
        var editors = MiniumEditor;

        //load the file and create a new editor instance with the file loaded
        $scope.loadFile = function(props) {
            //create an empty file
            var promise = FileLoader.loadFile(props, editors);

            console.log(promise)

            promise.then(function(result) {
                //success handler
                console.log(result)
                var newEditor = result;
                console.log(newEditor)
                $scope.activeSession = newEditor.instance;
                $scope.activeSession.focus();
                $scope.selected.item = newEditor.selected;
                $scope.activeID = newEditor.id;
                $scope.mode = newEditor.mode;

            }, function(errorPayload) {
                //the promise was rejected
                toastr.error(GENERAL_CONFIG.ERROR_MSG.FILE_NOT_FOUND)
            });
        };


        //REFACTOR put this in a directive or service 
        //search what the best way to do this.
        //value to check if thres any editor dirty
        $scope.isDirty = false;

        window.addEventListener("beforeunload", function(e) {
            var confirmationMessage = GENERAL_CONFIG.UNSAVED_MSG;

            if ($scope.isDirty) {
                (e || window.event).returnValue = confirmationMessage; //Gecko + IE
                return confirmationMessage; //Webkit, Safari, Chrome
            }
        });

        $scope.$on('$locationChangeStart', function(event, nextPath, current) {
            if (nextPath.indexOf("editor") == -1 && $scope.isDirty) {
                var answer = confirm(GENERAL_CONFIG.UNSAVED_MSG)
                if (!answer) {
                    event.preventDefault();
                }
            }


        });


        //TEMPORARY SOLUTION - NEDD TO PUT IN directive
        $(window).on('resize', function() {
           // editors.resizeEditors();
        });

    });
