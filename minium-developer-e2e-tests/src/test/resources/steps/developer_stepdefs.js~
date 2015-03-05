var _ = require("lodash"),
    cucumberutils = require("cucumber/utils");

var resetTheme = function(){
  browser.get("http://localhost:8080/");

  var toolbar = $("#toolbar");
  var option = toolbar.find("ul li .dropdown-toggle").withText("Preferences");
  option.click();
  
  var menuOption = toolbar.find(".dropdown-menu span").withText("Preferences");
  menuOption.click();
  
  var resetBtn = $(".btn").withText("Reset default");
  resetBtn.click();
};

Given(/^I am at editor$/, function() {
   browser.get("http://localhost:8080/");
});


Given(/^I am at modal "(.*?)"$/, function(modal) {
  var toolbar = $("#toolbar");
  var option = toolbar.find("ul li .dropdown-toggle").withText(modal);
  option.click();
  
  var menuOption = toolbar.find(".dropdown-menu span").withText(modal);
  menuOption.click();
});


Then(/^I should see a notification with text "(.*?)" and with type "(.*?)"$/, function(text,type) {
  var notification = $(".toast-"+type).withText(text);
  expect(notification).not.to.be.empty();
});


Then(/^the editor should have theme "(.*?)"$/, function(arg) {
  var editor = $(".ace-"+ arg.toLowerCase());
  
  expect(editor).not.to.be.empty();
});

Then(/^I reset theme$/, function() {
  resetTheme();
});


Then(/^the editor should have font size "(.*?)"$/, function(size) {
  var editor = $(".ace_editor");
  editor.withCss("font-size",size + "px");
  expect(editor).not.to.be.empty();
});


When(/^I click on button "(.*?)"$/, function(text) {
  var btn = $(".btn").withText(text);
  btn.click();
});

When(/^I fill:$/, function(datatable) {
    
    var objs = cucumberutils.asObjects(datatable);
    var inputs;
    objs.forEach(function (obj, i) {
      inputs = $("input,select");
      for (var colName in obj) {
        var fieldInput = inputs.withLabel(colName);
        var val = obj[colName];
        if (fieldInput.is(":radio")) {
          fieldInput.withLabel(val).check();
        } else if (fieldInput.is("select")) {
          fieldInput.select(val);
        } else {
          fieldInput.fill(val);
        }
      }
    });
    
});

When(/^I click on button "(.*?)"$/, function(btnName, option) {
  var treeBar = $("#tree-bar");
  var folder = treeBar.find("li").withText("features");
  folder.find(".tree-label").click()
});


Then(/^I reset theme$/, function() {
  resetTheme();
});


