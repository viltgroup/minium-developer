var keys = require("minium/keys");

Given(/^I'm at (.*)$/, function (url) {
  browser.get(url);
});

When(/^I accept the cookies$/, function() {
  var cookiesFrame = $("iframe").frames();
  if (cookiesFrame.checkForExistence("immediate")) {
    cookiesFrame.find("#introAgreeButton").click();
  }
});

When(/^I search for (.*)$/, function (query) {
  var searchbox = $(":input").withName("q");

  searchbox.fill(query);
  searchbox.sendKeys(keys.ENTER);
});

Then(/^a link for (.*) is displayed$/, function (linkUrl) {
  var links = $("a");
  var link  = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
  expect(link).to.have.size(1);
});

Then(/^links corresponding to (.*) are displayed$/, function (query) {
  var links = $("a");
  var linkUrls = config.searches[query];

  expect(linkUrls).not.to.be.empty();

  linkUrls.forEach(function (linkUrl) {
    var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
    expect(link).to.exist();
  });
});
