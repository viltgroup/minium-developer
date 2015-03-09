'use strict';

angular.module('minium.developer')
    .controller('EditorAreaController', function($rootScope, $scope, $q, $log, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, EvalService, FeatureFacade, TabLoader, SessionID, GENERAL_CONFIG) {

        //is the actual file selected
        //every time we move to other tab 
        //this value is being update

        //this object store all information about the active nodes
        //can put it in a class
        $rootScope.active = {
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
                deferred.reject();
            });
            return deferred.promise;
        };

        $scope.setActiveEditor = function(editor) {
            $rootScope.active = {
                session: editor.instance,
                selected: {
                    item: editor.selected
                },
                activeID: editor.id,
                mode: editor.mode
            }
            $rootScope.active.session.focus();

            console.log($rootScope.active);
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

        /**
         * Save the file of active session
         *
         */
        $scope.saveFile = function() {
            console.log($rootScope.active.session);
            editors.saveFile($rootScope.active.session);
        }

        /**
         * Launch test
         */
        $scope.launchCucumber = function() {
            editors.launchCucumber($rootScope.active.session);
        }


        /**
         * Open Selector Gadget
         *
         */
        $scope.activateSelectorGadget = function() {
            if ($rootScope.active.mode == editors.modeEnum.JS) {
                editors.activateSelectorGadget($rootScope.active.session);
            }
        }

        /**
         * Evaluate Expression
         */
        $scope.evaluate = function() {
            if ($rootScope.active.mode == editors.modeEnum.JS) {
                editors.evaluate($rootScope.active.session);
            }
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
                templateUrl: "minium.developer/views/webdriver/launch.webdriver.html",
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

        /**
         * Clear marker in lines of editor
         *
         */
        $scope.clearMarkers = function() {
            $scope.active.session.getSession().clearBreakpoints();
            $scope.active.session.getSession().setAnnotations([]);
        }

    });
