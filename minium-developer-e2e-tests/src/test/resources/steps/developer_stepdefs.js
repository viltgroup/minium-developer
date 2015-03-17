var base = require("base"),
    editors = require("editors"),
    notifications = require("notifications"),
    developer = require("developer");

Given(/^I'm at Minium Developer$/, function() {
  browser.get(config.baseUrl);
});

Given(/^a browser is already launched$/, function () {
  var editor = editors.console();
  var evalBtn = base.find(".btn").withText("Evaluate");
  
  editor.setValue("browser.getCurrentUrl()");
  editor.selectAll();
  evalBtn.click();
  
  var successNotifications = notifications.successes();
  var cancelBtn = base.find(".btn").withText("Cancel");
  var condition = successNotifications.or(cancelBtn);
  
  if (condition.waitForExistence().is(successNotifications)) return;
  
  // most likely we don't have a browser yet
  cancelBtn.click();
  
  developer.launchBrowser(config.defaultBrowser);
});

When(/^I wait until the test is completed$/, function () {
  var floatLoading = $(".running-data .ladda-spinner [role=progressbar]");
  floatLoading.waitForUnexistence("very-slow");
});