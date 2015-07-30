var timeUnits = require("minium/timeunits")
    _ = require("lodash");

var base = $(":root").unless(".modal-backdrop").add(".modal-dialog");

if (typeof module !== 'undefined') module.exports = base;