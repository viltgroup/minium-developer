'use strict';

angular.module('minium.developer')
    .controller('EditorAreaController', function($scope, $q, $log, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, EvalService, FeatureFacade, FileFactory, TabLoader, SessionID, GENERAL_CONFIG) {

        //is the actual file selected
        //every time we move to other tab 
        //this value is being update

        //this object store all information about the active nodes
        //can put it in a class
        $scope.active = {
            selected: {},
            selectedNode: "",
            session: null, //store the active instance of the editor
            mode: "", //mode of the open file
            activeID: null //store the ID of the active editor
        }

        $scope.resultsSummary = {};
        //init variables
        $scope.testExecuting = false;
        //store the editor where the test are launched 
        //to know where we can mark the result of the tests
        $scope.launchTestSession = null;
        //init the minium editor 
        //that manage editor and tabs
        //service is shared by controllers
        var editors = MiniumEditor;

        /////////////////////////////////////////////////////////////////
        //
        // load the file and create a new editor instance with the file loaded
        //
        /////////////////////////////////////////////////////////////////

        $scope.loadFile = function(props) {
            //create an empty file
            var promise = TabLoader.loadFile(props, editors);
            var deferred = $q.defer();

            promise.then(function(result) {
                //success handler
                var newEditor = result;
                $scope.setActiveEditor(newEditor);
                deferred.resolve(newEditor);
            }, function(errorPayload) {
                //the promise was rejected
                toastr.error(GENERAL_CONFIG.ERROR_MSG.FILE_NOT_FOUND)
                deferred.reject(newEditor);
            });
            return deferred.promise;
        };

        $scope.setActiveEditor = function(editor) {
            $scope.active = {
                session: editor.instance,
                selected: {
                    item: editor.selected
                },
                activeID: editor.id,
                mode: editor.mode
            }
            $scope.active.session.focus();

            //ace editor dont update the editor until a click or set a the cursor
            //so i need to get a solution
            var pos = editor.instance.selection.getCursor();
            pos.column += 1;
            editor.instance.moveCursorToPosition(pos);
            pos.column -= 1;
            editor.instance.moveCursorToPosition(pos);


            //set state
            $state.go("global.editorarea.sub", {
                path: editor.relativeUri
            }, {
                location: 'replace', //  update url and replace
                inherit: false,
                notify: false
            });
        }

        /////////////////////////////////////////////////////////////////
        //
        // EVENTS HANDLERS
        //
        /////////////////////////////////////////////////////////////////

        //REFACTOR put this in a directive or service 
        //search what the best way to do this.
        //value to check if thres any editor dirty

        //TODO
        //Another option here is when we close the window
        //try to close tab one by one
        window.addEventListener("beforeunload", function(e) {
            var confirmationMessage = GENERAL_CONFIG.UNSAVED_MSG;

            if (editors.areDirty()) {
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
            editors.resizeEditors();
        });

        /**
         * LAUNCH Webdriver selector Modal
         */
        $scope.setWebDriverMsg = function(value) {
            $scope.webDriverError = value;
        }


        $scope.webDriverError = false;
        $scope.openModalWebDriverSelect = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "minium.developer/views/editor.area/modal/configs.html",
                controller: "WebDriversController",
                size: size,
                resolve: {
                    error: function() {
                        return $scope.webDriverError;
                    }
                }
            });

            modalInstance.result.then(function(value) {
                $scope.setWebDriverMsg(value);
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    });
