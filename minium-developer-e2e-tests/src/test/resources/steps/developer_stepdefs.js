var base = require("base"),
    editors = require("editors"),
    notifications = require("notifications"),
    developer = require("developer");

Given(/^I'm at Minium Developer$/, function() {
  browser.get(config.baseUrl);
});

Given(/^a browser is already launched$/, function () {
  var editor = editors.console();
  var evalBtn = base.find("#evaluator");
  
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

Then(/^I should see the info of "(.*?)"/, function(label) {
  var labelElem = $(".modal-body .ng-scope").withText(label);
  var infoElem = $(".label").rightOf(labelElem);
  expect(infoElem).to.exist();
});
 

Given(/^the console is visible$/, function() {
  var console = $("#console-log");
  
  if( console.visible().size() === 0){
    
    // console is hidden, click on show log
    $("#log .btn").visible().click();
  }
});

When(/^I hide the console$/, function() {
  $("#log .btn").eq(0).click();
});

Then(/^I should not see the console$/, function() {
  var console = $("#console-log");
  expect(console.visible()).to.have.size(0);
});

When(/^I refresh the page$/, function() {
  browser.get(browser.getCurrentUrl());
});
 
 When(/^I write the expression "([^"]*)"$/, function(expr) {
  var editor = editors.console();
  editor.setValue(expr, 1);
  editor.execCommand('startAutocomplete');
});

Then(/^I shoul see the autocomplete tooltip$/, function() {
  var autocompleteToolTip = $(".ace_autocomplete .ace_content").visible();
  expect(autocompleteToolTip).to.exist();
});

Then(/^I should see the function "([^"]*)" in doc tooltip$/, function(fn) {
  var functionName = $(".ace_doc-tooltip b").withText(fn);
  expect(functionName).to.exist();
});
 
Then(/^I should see at minimum (\d+) webdrivers availables$/, function(number) {
  expect($(".webdrivers button[type='button']").visible()).to.have.size(number);
});

When(/^I evaluate the expression "([^"]*)"$/, function(expression) {
  
});

When(/^I clean the scope$/, function() {
  
});


When(/^I fill the field JSON fied with$/, function(text) {
  $("#advanced-field").fill(text);
});

Then(/^I should see message "([^"]*)"$/, function(text) {
  var label = $(".label-feedback").visible().withText(text);
  expect(label).to.exist();
});
 
 
Then(/^I should see the image which has alternative text "(.*)"$/, function(imageAlt) {
  expect($('img').withAttr("alt", imageAlt).visible()).to.exist();
});
