var expect = require("expect-webelements");
var _      = require("lodash");

Given(/^I'm at (.*)$/, function (url) {
  get(wd, url);
});

When(/^I search for (.*)$/, function (query) {
  var searchbox = $(wd, ":input").withName("q");
  var button = $(wd, "button").withAttr("aria-label", "Google Search");
  
  fill(searchbox, query);
  click(button);
});

Then(/^a link for (.*) is displayed$/, function (linkUrl) {
  var links = $(wd, "a");
  var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
  expect(link).to.have.size(1);
});

Then(/^links corresponding to (.*) are displayed$/, function (query) {
  var links = $(wd, "a");
  var linkUrls = config.searches[query];

  expect(linkUrls).not.to.be.empty();
  
  _(linkUrls).forEach(function (linkUrl) {
    var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
    expect(link).to.have.size(1);
  });
  
});
