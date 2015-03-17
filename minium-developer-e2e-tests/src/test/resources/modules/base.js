var timeUnits = require("minium/timeunits");

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
      } while(!pos.equals(prevPos));
    }
  }
});

browser.configure()
  .waitingPreset("fast")
    .timeout(1, timeUnits.SECONDS)
  .done()
  .interactionListeners()
    .clear()
    .add(minium.interactionListeners.onUnhandledAlert().accept().thenRetry())
    .add(minium.interactionListeners.onStaleElementReference().thenRetry())
    .add(stableForClickListener);

var base = $(":root").unless(".modal-backdrop").add(".modal-dialog").applyWebElements(function () {
  // if any animation is in progress, return empty set
  return jQuery(":animated").length > 0 ? $() : $(this);
});

if (typeof module !== 'undefined') module.exports = base;