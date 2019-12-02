// Imports
var performance = require("performance");
var keys = require("minium/keys");

// Scenarios
When(/^Check if that the domain responds: "([^"]*)"$/, function(url) {
  browser.get(url);
});

When(/^I append the performance data to the report$/, function() {
  scenario.write(performance.getString());
});

Then(/^The current page loads in less than the threshold$/, function() {
  expect(performance.getPageloadInSeconds()).to.be.lessThan(config.threshold);
});

When(/^I print the performance of the current website$/, function() {
  console.log(" === Performance === ");
  console.log("Current URL: " + performance.getURL());
  console.log("Performance Data: " + performance.getPerformanceString());
  console.log("Resource Stats: " + performance.getStatsString());
  console.log("Response Status Code: " + performance.getStatusCode());
  console.log("JavaScript Errors: " + performance.getJSErrorsString());
  console.log("Time to Load the current page: " + performance.getPageloadInSeconds());
});

When(/^I search for "([^"]*)"$/, function (query) {
  var searchbox = $(":input").withName("q");
  searchbox.fill(query);
  searchbox.sendKeys(keys.ENTER);
});

Then(/^links corresponding to "([^"]*)" are displayed$/, function (query) {
  var links = $("a");
  var linkUrls = config.searches[query];

  expect(linkUrls).not.to.be.empty();

  linkUrls.forEach(function (linkUrl) {
    var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
    expect(link).to.exist();
  });
});