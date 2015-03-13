/**
 * Responsable to launch a cucumber test
 * And process the result of execution
 *
 */
miniumDeveloper.service('cumcumberLauncher', function($q, launcherService, FeatureFacade, GENERAL_CONFIG) {

    //functions needed to be here
    var runningTest = Ladda.create(document.querySelector('#runningTest'));



    this.launch = function(launchParams, executionWasStopped, snippetsForUndefinedSteps, faillingSteps, resultsSummary, launchTestSession) {
        var def = $q.defer();

        runningTest.start();
        launcherService.launch(launchParams).success(function(data) {

            //if execution was stopped there's no need to execute the block
            if (executionWasStopped == true) return;

            //check if the data is valid
            if (data === undefined || data === "") {
                stopLaunch();
                toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
                return;
            }

            var feature = new FeatureFacade(data, snippetsForUndefinedSteps);

            var faillingSteps = feature.notPassingsteps;

            var resultsSummary = feature.resultsSummary;

            //refactor all this logic
            //URGENT NEED TO PUT THIS ON A MODEL
            //CANT BE IN A CONTROLLER
            var annotations = _.map(faillingSteps, function(step) {
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
                $("#runningTest").parent("a").removeClass("green").addClass("red");
                $("#status").removeClass().addClass("").html("Failing");
            } else {
                if (resultsSummary.runCount == 0) {
                    //no test were run
                    $("#status").removeClass().addClass("").html(GENERAL_CONFIG.TEST.NOT_EXECUTED);
                    toastr.error(GENERAL_CONFIG.TEST.NOT_EXECUTED);
                } else {
                    $("#runningTest").parent("a").removeClass("red").addClass("green");
                    $("#status").removeClass().addClass("").html("Passed");
                    toastr.success(GENERAL_CONFIG.TEST.PASS);

                    annotations.push({
                        row: launchParams.line - 1,
                        text: GENERAL_CONFIG.TEST.EXECUTED_PASSED,
                        type: 'info'
                    });
                }
            }

            onFinishTestExecution(annotations, launchTestSession);

            data = {
                feature: feature,
                faillingSteps: faillingSteps,
                resultsSummary: resultsSummary
            };

            def.resolve(data);

        }).error(function() {
            stopLaunch();
            toastr.error(GENERAL_CONFIG.ERROR_MSG.TEST_ERROR);
            def.reject();
        });

        return def.promise;
    };



    this.stopLaunch = function() {
        stopLaunch();
    }

    //executed after the test execution
    //chnage the flag of execution test
    var onFinishTestExecution = function(annotations, launchTestSession) {
        //stop button NEED TO INSERT
        runningTest.stop();
        if (annotations)
            launchTestSession.getSession().setAnnotations(annotations);
    };

    //stops a launch execution
    var stopLaunch = function() {
        launcherService.stop().success(function() {
            onFinishTestExecution();

        });
    };


});
