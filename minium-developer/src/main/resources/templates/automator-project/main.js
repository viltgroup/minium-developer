var timeUnits = require("minium/timeunits"),
    keys      = require("minium/keys"),
    // your modules
    //ChatBot   = require("bots/chatbot")

browser.$(":root").configure()
  .waitingPreset("fast")
    .timeout(2, timeUnits.SECONDS);

var browser = minium.newBrowser({
  desiredCapabilities : { browserName : "chrome" }
});

browser.$(":root").configure()
  .defaultTimeout(60, timeUnits.SECONDS);

