'use strict';


var EditorAreaController = function($rootScope, $translate, $filter, $scope, $q, $modal, $state, MiniumEditor, EvalService, TabLoader, FeaturePreviewService) {

    var $translate = $filter('translate');
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
    // props - file properties
    // lineNo - num of line to go
    /////////////////////////////////////////////////////////////////

    $scope.loadFile = function(props, lineNo) {

        //load the file
        var promise = TabLoader.loadFile(props, editors);
        var deferred = $q.defer();

        promise.then(function(result) {
            //success handler
            var newEditor = result;
            $scope.setActiveEditor(newEditor);

            deferred.resolve(newEditor);
        }, function(errorPayload) {
            //the promise was rejected
            deferred.reject();

        });

        return deferred.promise;
    };

    /*
     * Set the editor as active
     * We always keep the the reference of the active(selected/open) editor
     */
    $scope.setActiveEditor = function(editor) {
        $rootScope.active = {
            session: editor.instance,
            selected: {
                item: editor.selected
            },
            selectedNode: editor.selected.fileProps,
            activeID: editor.id,
            mode: editor.mode
        }

        //if the file is not found
        if ($rootScope.active.session === undefined) {
            return;
        }

        $rootScope.active.session.focus();

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
        editors.saveFile($rootScope.active.session);
    }

    /**
     * Launch test
     */
    $scope.launchCucumber = function() {
        var runAll = false;
        editors.launchCucumber($rootScope.active.session, runAll);
    }


    $scope.launchAll = function() {
        var runAll = true;
        editors.launchCucumber($rootScope.active.session, runAll);
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
        var confirmationMessage = $translate('messages.files.unsaved');

        if (editors.areDirty()) {
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Webkit, Safari, Chrome
        }
    });

    $scope.$on('$locationChangeStart', function(event, nextPath, current) {
        if (nextPath.indexOf("editor") == -1 && $scope.isDirty) {
            var answer = confirm($translate('messages.files.unsaved'))
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


    /**
     * Clean the scope of the engine
     */
    $scope.cleanScriptEngineScope = function() {
        EvalService.clean().success(function(data) {
                toastr.success($translate('evaluator.clean.success'));
            })
            .error(function(exception) {
                toastr.error($translate('evaluator.clean.error'));
            });
    }

    $scope.previewFeatureWithExternalCucumberData = function() {
        // if the file is not a feature
        // can't open the preview
        if ($rootScope.active.mode !== 'FEATURE') {
            toastr.warning($translate('evaluator.clean.success'));
            return;
        }

        var launchParams = {
            fileProps: $rootScope.active.selectedNode
        };

        toastr.info('<i class="fa fa-circle-o-notch fa-spin fa-2x"></i> Loading Data!', {
            allowHtml: true
        });

        FeaturePreviewService.preview(launchParams).success(function(data) {
                toastr.clear();
                //create an empty editor
                var fileProps = {
                    content: data,
                    type: "preview",
                    fileProps: launchParams.fileProps
                }
                var newEditor = editors.addInstance(fileProps, 1);
                //go to line
                newEditor.instance.gotoLine(4);
                newEditor.instance.setReadOnly(true);
                toastr.success($translate('evaluator.clean.success'))
            })
            .error(function(exception) {
                toastr.clear();
                toastr.error($translate('evaluator.clean.error'));
            });
    }

};


EditorAreaController.$inject = ['$rootScope', '$translate', '$filter', '$scope', '$q', '$modal', '$state', 'MiniumEditor', 'EvalService', 'TabLoader', 'FeaturePreviewService'];

angular.module('minium.developer').controller('EditorAreaController', EditorAreaController);
