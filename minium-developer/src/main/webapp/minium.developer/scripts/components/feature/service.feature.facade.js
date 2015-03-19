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

        var failingSteps = data.numberOfFailures;
        var skippedSteps = data.numberOfSkipped;
        var undefinedSteps = data.numberOfUndefined;
        var passedSteps = data.numberOfPasses;
        var durations = data.durationOfSteps;
        this.notPassingsteps = failingSteps + skippedSteps + undefinedSteps;
        
        console.log(data.numberOfFailures)
        
        var totalDuration = 0;

        $.each(durations, function() {
            totalDuration += this;
        });

        this.resultsSummary = {
            runCount: passedSteps + this.notPassingsteps,
            passed: passedSteps,
            failures: failingSteps,
            skipped: skippedSteps,
            undefined: undefinedSteps,
            notPassingsteps: this.notPassingsteps,
            runTime: totalDuration / 1000000.0
        }

    };

    /**
     * Return the constructor function
     */
    return FeatureFacade;
});
