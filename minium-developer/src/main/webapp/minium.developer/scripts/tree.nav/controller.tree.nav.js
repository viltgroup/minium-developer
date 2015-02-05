'use strict';

angular.module('minium.developer')
    .controller('TreeNavController', function($rootScope, $scope, $log, $timeout, $modal, $state, $controller, $location, $window, $stateParams, $cookieStore, MiniumEditor, FS, launcherService, EvalService, FeatureFacade, FileFactory, FileLoader, SessionID, GENERAL_CONFIG) {

        alert($scope.cenas)
        //initialize the service to manage the instances
        

        /**
         *   Tree view  controller
         */

        $scope.dataForTheTree = [];

        $scope.fs = {
            current: {}
        };
        var firstLoad = true;
        var asyncLoad = function(node) {

            var params = {
                path: node.relativeUri || ""
            };

            node.children = FS.list(params, function() {
                //sort the child by name
                node.children.sort(predicatBy("name"))
                _.each(node.children, function(item) {
                    // tree navigation needs a label property

                    item.label = item.name;
                    if (firstLoad) {
                        $scope.dataForTheTree.push(item);
                    }

                });
                firstLoad = false;
            });
        };

        $scope.loadChildren = function(item) {
            // if (item.childrenLoaded) return;
            asyncLoad(item);
            // item.childrenLoaded = true;
        };

        function predicatBy(prop) {
            return function(a, b) {
                if (a[prop] > b[prop]) {
                    return 1;
                } else if (a[prop] < b[prop]) {
                    return -1;
                }
                return 0;
            }
        }


        $scope.selectedNode = "";
        $scope.expandedNodes = [];
        //console.log($scope.expandedNodes);
        $scope.showSelected = function(node) {

            $scope.selectedNode = node;
            //console.log($scope.selectedNode)
            if (node.type == "FILE") {
                $scope.loadFile($scope.selectedNode.relativeUri);
                //need to remove this because of the search and new file
                $state.go("global.editorarea.sub", {
                    path: $scope.selectedNode.relativeUri
                }, {
                    location: 'replace', //  update url and replace
                    inherit: false,
                    notify: false
                });
            } else { //if the is on click on a file
                $scope.loadChildren(node);
                //expand the node
                $scope.expandedNodes.push(node)
            }

        };

        $scope.showToggle = function(node, expanded) {
            //console.log(node.children)
            $scope.loadChildren(node);
        };

        console.debug($scope.fs.current)
        asyncLoad($scope.fs.current);


        /**
         * NAVIGATION FOLDERS Functions
         */
        $scope.opts = {
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                isFeature: "a2",
                label: "a6",
                labelSelected: "a8"
            },
            isLeaf: function(node) {
                if (node.type === "DIR")
                    return false;
                else
                    return true;
            },
            isFeature: function(node) {
                if (node.type === "DIR")
                    return false;
                else
                    return true;
            },
            dirSelectable: false
        };

        $scope.collapseAll = function() {
            $scope.expandedNodes = [];
        };


        //functions used in the 2 modules
        $scope.isEmptyObject = function(obj) {

            if (obj.length && obj.length > 0)
                return false;

            if (obj.length === 0)
                return true;
        }

        $scope.launchAll = function() {
            //if no file is selected
            if ($scope.selected.item === undefined)
                return;

            var launchParams = {
                fileProps: $scope.selected.item.fileProps
            };

            $scope.launch(launchParams);
        }

        var annotations = [];
        var executionWasStopped;
        $scope.launch = function(launchParams) {

            launchTestSession = activeSession;
            //check if the test already executing
            if ($scope.testExecuting == true) {
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_EXECUTING);
                return;
            }

            //put a lock in test execution
            $scope.testExecuting = true;

            //init values for live results
            $scope.tests.total;
            $scope.testsExecuted = 0;
            $scope.isFailing = false;

            toastr.success(GENERAL_CONFIG.MSG.TEST_STARTED);
            runningTest.start();
            $scope.tests = {};

            //start to take screenshots
            $scope.takeScreenShot();

            // clear markers
            $scope.clearMarkers();

            //reset the variable
            executionWasStopped = false;

            $("#status").removeClass().addClass("").html("Running");

            launcherService.launch(launchParams).success(function(data) {

                //if execution was stopped there's no need to execute the block
                if (executionWasStopped == true) return;

                console.log(data)
                    //check if the data is valid
                if (data === undefined || data === "") {
                    $scope.stopLaunch();
                    toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
                    return;
                }

                var feature = new FeatureFacade(data);
                console.debug(feature);
                $scope.faillingSteps = feature.notPassingsteps;

                $scope.resultsSummary.passed = feature.passedSteps.length;
                $scope.resultsSummary.failures = feature.failingSteps.length;
                $scope.resultsSummary.skipped = feature.skippedSteps.length;

                $scope.resultsSummary.runCount = feature.passedSteps.length + feature.notPassingsteps.length;

                // //convert in millisecond
                $scope.resultsSummary.runTime = feature.totalDuration / 1000000.0;

                console.debug(feature.notPassingsteps);

                annotations = _.map(feature.notPassingsteps, function(step) {
                    var result = step.status;
                    var msg = result === 'FAILED' ? step.errorMessage : 'Skipped';
                    var lines = msg;

                    return {
                        row: step.line - 1,
                        text: msg,
                        type: (result === 'FAILED' ? 'error' : 'warning')
                    };
                });

                if (annotations.length > 0) {
                    toastr.warning(GENERAL_CONFIG.TEST.FAILING);
                    $("#runningTest").removeClass("btn-warning").addClass("btn-danger");
                    $("#status").removeClass().addClass("").html("Failing");
                } else {
                    if ($scope.resultsSummary.runCount == 0) {
                        //no test were run
                        $("#status").removeClass().addClass("").html(GENERAL_CONFIG.TEST.NOT_EXECUTED);
                        toastr.error("No test executed");
                    } else {
                        $("#runningTest").removeClass("btn-warning").addClass("btn-success");

                        $("#status").removeClass().addClass("").html("Passed");
                        toastr.success(GENERAL_CONFIG.TEST.PASS);
                    }

                    annotations.push({
                        row: launchParams.line,
                        text: GENERAL_CONFIG.TEST.EXECUTED_PASSED,
                        type: 'info'
                    });

                }

                $scope.onFinishTestExecution(annotations);


            }).error(function() {
                $scope.stopLaunch();
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
            });
        }

        $('#miniumOnDrugs').click(function() {
            $(".navbar-brand").css('background', 'url(images/minium_loader.gif) no-repeat left center');
            $(".navbar-brand").css('background-color', '#367fa9');
            $(".navbar-brand").css('color', '#f9f9f9');
        });

        //////////////////////////////////////////////////////////////////
        // EVENT HANDLER  CTLR + P 
        // to Search a file
        //////////////////////////////////////////////////////////////////
        document.addEventListener("keydown", function(e) {
            if (e.keyCode == 80 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                //your implementation or function calls
                // $state.transition();
                $state.go(".open", {}, {
                    notify: false,
                });
            }
        }, false);


        $scope.collapseAll = function() {
            $scope.expandedNodes = []
        };


        $scope.readCookie = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        //functions used in the 2 modules
        $scope.isEmpty = function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        }

    });
