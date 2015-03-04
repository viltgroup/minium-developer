var _ = require("lodash"),
    cucumberutils = require("cucumber/utils");

Given(/^I am at section "(.*?)"$/, function(section) {
   browser.get(config.baseUrl);
   var menu = $(".sidebar-menu li").withText(section);
   menu.click();
});

When(/^I am in toolbar "(.*?)"$/, function(arg1) {
  var toolbar = $("#toolbar");
  var option = toolbar.find("ul li .dropdown-toggle").withText("Preferences");
  var menuOption = toolbar.find(".dropdown-menu span").withText("Preferences");
  var op = $("select").withLabel("Theme");
  var save = $(".btn").withText("Save changes");
  var editor = $(".ace_editor");
  
  option.click();
  menuOption.click();
  op.select("Chrome");
  save.click();
  
  //check for theme in browser
  expect(editor.filter(".ace-monokai")).not.to.be.empty();
});

Given(/^I click on toolbar "(.*?)"$/, function(arg1) {
  
});

Then(/^I should see a notification with "(.*?)" and text "(.*?)"$/, function(type,text) {
  var notification = $(".toast").find("toast-"+type).withText(text);
  expect(notification).not.to.be.empty();
});

Then(/^the editor should have the class "(.*?)"$/, function() {
  
});

When(/^I fill:$/, function(datatable) {
  var objs = cucumberutils.asObjects(datatable);
  objs.forEach(function (obj, i) {
    simBase.find("input");
    for (var colName in obj) {
      var label = simBase.find(".full-group-label").withText(colName);
      var fieldInput = simBase.find("div.full-box").below(label).eq(i).find("input, textarea, option");
      var val = obj[colName];
      if (fieldInput.is(":radio")) {
        check(fieldInput.withLabel(val));
      } else if (fieldInput.is("select")) {
        select(fieldInput, val);
      } else {
        fill(fieldInput, val);
      }
    }
  });
});

When(/^I click on button "(.*?)"$/, function(btnName, option) {
  var treeBar = $("#tree-bar");
  var folder = treeBar.find("li").withText("features");
  folder.find(".tree-label").click();
});

Then(/^I see the folder sorted in alphabetical order$/, function() {
  var treeBar = $("#tree-bar");
  var folders = treeBar.find("li");
  
  _(folders).forEach(function (folder) {
    folder.find(".tree-label").click();
    var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
    folder.find(".tree-label").click();
    expect(link).to.have.size(1);
  });
});