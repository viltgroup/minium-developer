var base = require("base"),
    menu = require("menu"),
    notifications = require("notifications");

var developer = {
  launchBrowser : function (type) {
    menu.open([ "Run", "Launch Browser" ]);
    var browserBtn = base.find("#idProperty button").withText(type);
    var createBtn = base.find("#createWebDriver").not(":disabled");
    
    browserBtn.click();
    createBtn.click();
    
    expect(notifications.successes()).to.have.text("Created a WebDriver");
  }
};

if (typeof module !== 'undefined') module.exports = developer;