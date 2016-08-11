var timeUnits = require("minium/timeunits");

World(function () {
  browser.configure()
    .defaultTimeout(5, timeUnits.SECONDS)
    .defaultInterval(500, timeUnits.MILLISECONDS)
    // Waiting presets
    // for more details, see: http://minium.vilt.io/docs/minium-training/minium-core-js/#waiting-interactions-and-presets
    .waitingPreset("slow")
      .timeout(30, timeUnits.SECONDS)
      .interval(1, timeUnits.SECONDS)
    .done()
    // Interaction Listeners
    // for more details, see: http://minium.vilt.io/docs/minium-training/minium-core-js/#interaction-listeners
    .interactionListeners()
      .add(minium.interactionListeners.onStaleElementReference().thenRetry())
      //.add(minium.interactionListeners.onUnhandledAlert().accept())
      //.add(minium.interactionListeners.ensureUnexistence($(".loading")).withWaitingPreset("slow"))
      //.add(minium.interactionListeners.onTimeout().when($(".loading")).waitForUnexistence($(".loading")).withWaitingPreset("slow").thenRetry())
    .done();
});
