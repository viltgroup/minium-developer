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

        var editors = MiniumEditor;

        editors.init($scope);

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

                editors.hightlightLine(10, $scope.activeSession, "failed");
                editors.hightlightLine(12, $scope.activeSession, "failed");

            }, function(errorPayload) {
                //the promise was rejected
                toastr.error(GENERAL_CONFIG.ERROR_MSG.FILE_NOT_FOUND)
            });
        };


        //REFACTOR put this in a directive or service 
        //search what the best way to do this.
        //value to check if thres any editor dirty
        $scope.isDirty = false;
        window.onbeforeunload = function(e) {
            var message = 'Are you sure you want to leave this page?';
            if (isDirty) { 
                return message; 
            } 
        };
        
        
        $scope.$on('$locationChangeStart', function(event, nextPath, current) {
            if ( nextPath.indexOf("editor") == -1 && isDirty )
                var answer = confirm("Are you sure you want to leave this page?")
            if (!answer) {
                event.preventDefault();
            }
        });


    });
    
