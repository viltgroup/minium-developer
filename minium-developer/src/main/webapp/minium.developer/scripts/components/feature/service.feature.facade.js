/**
 * Data coming from the result of an execution of a feature in cucumber
 * Process the data to get some stats an summary
 *
 */
miniumDeveloper.factory('FeatureFacade', function() {
    /**
     * Constructor
     */
    function FeatureFacade(data, snippetsForUndefinedSteps) {
        this.feature = data;
        this.snippetsForUndefinedSteps = snippetsForUndefinedSteps;
        var elements = this.process(data);
    }

    /**
     * Public method, assigned to prototype
     */

    FeatureFacade.prototype.process = function(data) {
        var r = true;
        this.notPassingsteps = jsonPath.eval(data, "$..steps[?(@.status!='PASSED')]");
        var failingSteps = jsonPath.eval(data, "$..steps[?(@.status=='FAILED')]");
        var skippedSteps = jsonPath.eval(data, "$..steps[?(@.status=='SKIPPED')]");
        var undefinedSteps = jsonPath.eval(data, "$..steps[?(@.status=='UNDEFINED')]");
        var passedSteps = jsonPath.eval(data, "$..steps[?(@.status=='PASSED')]");
        var durations = jsonPath.eval(data, "$..duration");

        var totalDuration = 0;
        $.each(durations, function() {
            totalDuration += this;
        });

        this.resultsSummary = {
            runCount: passedSteps.length + this.notPassingsteps.length,
            passed: passedSteps.length,
            failures: failingSteps.length,
            skipped: skippedSteps.length,
            undefined: undefinedSteps.length,
            notPassingsteps: this.notPassingsteps.length,
            runTime: totalDuration / 1000000.0
        }

    };

    /**
     * Return the constructor function
     */
    return FeatureFacade;
});