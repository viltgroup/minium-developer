var timeUnits = require("minium/timeunits");

browser.configure()
  .waitingPreset("fast")
    .timeout(1, timeUnits.SECONDS);

var base = $(":root").unless(".modal-backdrop").add(".modal-dialog");

if (typeof module !== 'undefined') module.exports = base;