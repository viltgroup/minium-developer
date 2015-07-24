var base = require("base"),
    menu = require("menu"),
    notifications = require("notifications");

var developer = {
  launchBrowser : function (browserInfo) {
    menu.open([ "Run", "Launch Browser" ]);
    var browserBtn = base.find("#idProperty button").withText(browserInfo.browserName);
    var createBtn = base.find("#createWebDriver").not(":disabled");
    
    browserBtn.click();
    
    if (browserInfo.url) {
      var remoteBtn = base.find("#remoteWebDriver");
      var remoteUrlFld = base.find(":text").withAttr("ng-model", "remoteWebDriverUrl");
      
      remoteBtn.click();
      remoteUrlFld.fill(browserInfo.url);
    }
    
    createBtn.click();
    
    var disabledCreateBtn = base.find("#createWebDriver:disabled");
    disabledCreateBtn.waitForUnexistence("very-slow");
    
    expect(notifications.successes()).to.have.text("Created a new WebDriver");
  }
};

if (typeof module !== 'undefined') module.exports = developer;