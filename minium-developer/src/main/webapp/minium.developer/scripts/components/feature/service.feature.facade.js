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

        this.resultsSummary = {
            runCount: data.numberOfSteps,
            passed: data.numberOfPasses,
            failures: data.numberOfFailures,
            skipped: data.numberOfSkipped,
            undefined: data.numberOfUndefined,
            notPassingsteps: data.numberOfFailures + data.numberOfSkipped + data.numberOfUndefined,
            runTime: data.durationOfSteps / 1000000.0
        }
    };

    /**
     * Return the constructor function
     */
    return FeatureFacade;
});
