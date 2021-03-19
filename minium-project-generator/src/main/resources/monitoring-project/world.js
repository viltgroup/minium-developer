var timeUnits = require("minium/timeunits");

World(function () {
    browser.configure()
      .defaultTimeout(5, timeUnits.SECONDS)
      .defaultInterval(500, timeUnits.MILLISECONDS)
      .waitingPreset("slow")
        .timeout(30, timeUnits.SECONDS)
        .interval(1, timeUnits.SECONDS)
      .done()
      .interactionListeners()
        .add(minium.interactionListeners.onStaleElementReference().thenRetry())
      .done();
}, function() {
    browser.configure().interactionListeners().clear();
});