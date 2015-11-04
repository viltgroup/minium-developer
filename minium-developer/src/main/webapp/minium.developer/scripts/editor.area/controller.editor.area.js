'use strict';


var EditorAreaController = function($rootScope, $translate, $filter, $scope, $q, $modal, $state, MiniumEditor, EvalService, TabLoader, FeaturePreviewService) {

    var $translate = $filter('translate');
    // contains the actual file selected. every time we move to other tab
    // this value is updated
    $rootScope.activeEditor = {
        file: {}, // stores the file props and content
        instance: null, //store the active instance of the editor
        mode: "", //mode of the open file
        activeID: null, //store the ID of the active editor
        type: "" // store the type (File,Console, Preview)
    }

    $scope.resultsSummary = {};

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

    $scope.loadFile = function(relativeUri, lineNo) {
        //load the file
        var promise = TabLoader.loadFile(relativeUri, editors);
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
        $rootScope.activeEditor = {
            instance: editor.instance,
            file: editor.file,
            activeID: editor.id,
            mode: editor.mode,
            type: editor.type,
            offsets: editor.offsets
        }

        //if the file is not found
        if ($rootScope.activeEditor.instance === undefined) {
            return;
        }

        $rootScope.activeEditor.instance.focus();

        //ace editor dont update the editor until a click or set a the cursor
        //so i need to get a solution
        var pos = editor.instance.selection.getCursor();
        pos.column += 1;
        editor.instance.moveCursorToPosition(pos);
        pos.column -= 1;
        editor.instance.moveCursorToPosition(pos);

        if (editor.type === 'FILE') {
            //set state
            $state.go("global.editorarea.sub", {
                path: editor.file.fileProps.relativeUri
            }, {
                location: 'replace', //  update url and replace
                inherit: false,
                notify: false
            });
        }

        console.log($rootScope.activeEditor);

    }

    /**
     * Save the file of active session
     *
     */
    $scope.saveFile = function() {
        editors.saveFile($rootScope.activeEditor.instance);
    }

    /**
     * Launch test
     */
    $scope.launchCucumber = function() {
        var runAll = false;
        editors.launchCucumber($rootScope.activeEditor.instance, runAll);
    }


    $scope.launchAll = function() {
        var runAll = true;
        editors.launchCucumber($rootScope.activeEditor.instance, runAll);
    }

    /**
     * Open Selector Gadget
     *
     */
    $scope.activateSelectorGadget = function() {
        if ($rootScope.activeEditor.mode == editors.modeEnum.JS) {
            editors.activateSelectorGadget($rootScope.activeEditor.instance);
        }
    }

    /**
     * Evaluate Expression
     */
    $scope.evaluate = function() {
        if ($rootScope.activeEditor.mode == editors.modeEnum.JS) {
            editors.evaluate($rootScope.activeEditor.instance);
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
        $scope.activeEditor.instance.getSession().clearBreakpoints();
        $scope.activeEditor.instance.getSession().setAnnotations([]);
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

    /**
    * Function open a new editor with feature with external data
    */
    $scope.previewFeatureWithExternalCucumberData = function() {
        // if the file is not a feature
        // can't open the preview
        if ($rootScope.activeEditor.mode !== 'FEATURE') {
            toastr.warning($translate('evaluator.clean.success'));
            return;
        }

        var file = {
            fileProps: angular.copy($rootScope.activeEditor.file.fileProps)
        };

        toastr.info('<i class="fa fa-circle-o-notch fa-spin fa-2x"></i> ' + $translate('messages.preview.feature.loading'), {
            allowHtml: true
        });

        FeaturePreviewService.preview(file).success(function(data) {
                toastr.clear();
                var fileContent = data.fileContent;
                var offsets = data.offset;

                file.fileProps.preview = true;

                var filePropsAndContent = {
                    content: fileContent,
                    type: "preview",
                    fileProps: file.fileProps,
                    offsets: offsets
                }

                var newEditor = editors.addInstance(filePropsAndContent, 1);

                // change editor settings
                newEditor.instance.focus();
                newEditor.instance.setReadOnly(true);
                toastr.success($translate('messages.preview.feature.success'));
                $scope.setActiveEditor(newEditor);
            })
            .error(function(exception) {
                toastr.clear();
                toastr.error($translate('messages.preview.feature.error'));
            });
    }

};


EditorAreaController.$inject = ['$rootScope', '$translate', '$filter', '$scope', '$q', '$modal', '$state', 'MiniumEditor', 'EvalService', 'TabLoader', 'FeaturePreviewService'];

angular.module('minium.developer').controller('EditorAreaController', EditorAreaController);
