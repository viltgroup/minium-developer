browser.get("http://www.google.com/ncr");
  
// elements
var searchbox = $(":input").withName("q");
var button = $("button").withAttr("aria-label", "Google Search");
var resultLinks = $("h3 a");

// interactions
searchbox.fill(typeof query === 'undefined' ? "Minium VILT" : query);
button.click();
resultLinks.first().click();

console.log("Current URL:", browser.getCurrentUrl());