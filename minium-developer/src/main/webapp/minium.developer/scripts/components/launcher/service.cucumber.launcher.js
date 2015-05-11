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
            console.log(snippetsForUndefinedSteps);

            var feature = new FeatureFacade(data, snippetsForUndefinedSteps);

            var faillingSteps = feature.notPassingsteps;

            var resultsSummary = feature.resultsSummary;
            //refactor all this logic
            //URGENT NEED TO PUT THIS ON A MODEL
            //CANT BE IN A CONTROLLER

            var annotations = _.map(faillingSteps, function(step) {
                var result = step.status;
                var msg, type;
                if (result === 'failed') {
                    msg = step.result.error_message;
                    type = 'error';
                } else if (result === 'undefined') {
                    msg = 'Undefined. Can’t find a matching Step Definition';
                    type = 'info';
                } else {
                    msg = 'Skipped. Steps that follow undefined, pending or failed steps are never executed (even if there is a matching Step Definition)';
                    type = 'warning';
                }

                var lines = msg;

                return {
                    row: step.line - 1,
                    text: msg,
                    type: type
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
                }
            }

            toastr.info('<em class="fa fa-rocket"></em> <strong>' + feature.resultsSummary.runCount + ' Steps </strong><br>' +
                '<em class="fa fa-check-square"></em> <strong>' + feature.resultsSummary.passed + ' Passing</strong><br>' +
                '<em class="fa fa-bug"></em> <strong>' + feature.resultsSummary.failures + ' Failure</strong><br>' +
                '<em class="fa fa-warning"></em> <strong>' + feature.resultsSummary.skipped + ' Skipped</strong><br>' +
                '<em class="fa fa-exclamation"></em> <strong>' + feature.resultsSummary.undefined + ' Undefined</strong>');


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
