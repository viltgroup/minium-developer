var timeUnits = require("minium/timeunits")
    _ = require("lodash");

var stableForClickListener = new JavaAdapter(Packages.minium.actions.internal.DefaultInteractionListener, {
  onBeforeEvent : function (event) {
    if (event.getInteraction() instanceof Packages.minium.web.internal.actions.ClickInteraction) {
      var elem = event.getSource().first();
      var getPosition = function () {
        return elem.apply(function () {
          return JSON.stringify($(this).position());
        });
      };
      
      // ensure stable
      var prevPos, pos = getPosition();
      do {
        elem.waitTime(50, timeUnits.MILLISECONDS);
        prevPos = pos;
        pos = getPosition();
      } while(!_.isEqual(pos, prevPos));
    }
  }
});

browser.configure()
  .waitingPreset("fast").timeout(1, timeUnits.SECONDS).done()
  .waitingPreset("very-slow").timeout(30, timeUnits.SECONDS).interval(1, timeUnits.SECONDS).done()
  .interactionListeners()
    .clear()
    .add(minium.interactionListeners.onUnhandledAlert().accept().thenRetry())
    .add(minium.interactionListeners.onStaleElementReference().thenRetry())
    .add(stableForClickListener);

var base = $(":root").unless(".modal-backdrop").add(".modal-dialog");

if (typeof module !== 'undefined') module.exports = base;