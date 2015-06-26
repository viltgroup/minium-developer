/**
 * Responsable to launch a cucumber test
 * And process the result of execution
 *
 */
miniumDeveloper.service('cumcumberLauncher', function($q, $translate, $filter, launcherService, FeatureFacade) {

    var $translate = $filter('translate');
    //functions needed to be here
    var runningTest = Ladda.create(document.querySelector('#runningTest'));

    this.launch = function(launchParams, executionWasStopped, snippetsForUndefinedSteps, faillingSteps, resultsSummary, launchTestSession, socket_key) {
        var def = $q.defer();

        runningTest.start();
        launcherService.launch(launchParams, socket_key).success(function(data) {

            //if execution was stopped there's no need to execute the block
            if (executionWasStopped == true) return;

            //check if the data is valid
            if (data === undefined || data === "") {
                stopLaunch();
                toastr.error($translate('test_msg.test_error'));
                return;
            }
            console.log(snippetsForUndefinedSteps);

            var feature = new FeatureFacade(data, snippetsForUndefinedSteps);

            var faillingSteps = feature.notPassingsteps;

            var resultsSummary = feature.resultsSummary;
            //refactor all this logic
            //URGENT NEED TO PUT THIS ON A MODEL
            //CANT BE IN A CONTROLLER

            console.debug(faillingSteps)

            var annotations = _.map(faillingSteps, function(step) {
                var result = step.status;
                var msg, type;
                if (result === 'failed') {
                    msg = step.result.error_message.substring(0, 500);
                    type = 'error';
                } else if (result === 'undefined') {
                    msg = $translate('cucumber.undefided')
                    type = 'info';
                } else {
                    msg = $translate('cucumber.skipped');
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
                toastr.warning($translate('test_msg.failing'));
                $("#runningTest").parent("a").removeClass("green").addClass("red");
                $("#status").removeClass().addClass("").html("Failing");
            } else {
                if (resultsSummary.runCount == 0) {
                    //no test were run
                    $("#status").removeClass().addClass("").html($translate('test_msg.not_executed'));
                    toastr.error($translate('test_msg.not_executed'));
                } else {
                    $("#runningTest").parent("a").removeClass("red").addClass("green");
                    $("#status").removeClass().addClass("").html("Passed");
                    toastr.success($translate('test_msg.pass'));
                }
            }

            toastr.info('<em class="fa fa-rocket"></em> <strong>' + feature.resultsSummary.runCount + ' ' + $translate('report.steps') + '</strong><br>' +
                '<em class="fa fa-check-square"></em> <strong>' + feature.resultsSummary.passed + ' ' + $translate('report.passing') + '</strong><br>' +
                '<em class="fa fa-bug"></em> <strong>' + feature.resultsSummary.failures + ' ' + $translate('report.failure') + '</strong><br>' +
                '<em class="fa fa-warning"></em> <strong>' + feature.resultsSummary.skipped + ' ' + $translate('report.skipped') + '</strong><br>' +
                '<em class="fa fa-exclamation"></em> <strong>' + feature.resultsSummary.undefined + ' ' + $translate('report.undefined') + '</strong>');


            onFinishTestExecution(annotations, launchTestSession);

            data = {
                feature: feature,
                faillingSteps: faillingSteps,
                resultsSummary: resultsSummary
            };

            def.resolve(data);

        }).error(function() {
            stopLaunch();
            toastr.error($translate('test_msg.test_error'));
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
