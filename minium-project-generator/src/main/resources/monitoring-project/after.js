var scenario;

Before(function (s) {
    browser.configure()
      .interactionListeners()
        .add(minium.interactionListeners.slowMotion(1, timeUnits.SECONDS))
        .add(minium.interactionListeners.onBrowserGet(s))
      .done();

    scenario = s;
});

After(function (scenario) {
    browser.configure().interactionListeners().clear();
});