var _ = require("lodash"),
    interpolator = require("utils/interpolator");


When(/^I open the files "(.*?)"$/, function(nav) {
   
   var treeBar = $("#tree-bar");
   var folders = treeBar.find("li");
   var parts = nav.split(">");
   /*
   _.each(parts, function (part) {
      var folder = folders.withText(" features")
      var next = folder.find(".tree-label");
      if (checkNotEmpty(next) && next.is(":not(.tree-collapsed)")) {
        click(next);
      }
    });*/
    
   //click on the first folder
   var featureFolder = folders.withText(parts[0]);
   var featureFolderLabel = featureFolder.find(".tree-label");
   featureFolderLabel.click();
   
   
   //open the first file
   fileName = "EditorTabs.feature";
   var file = folders.withText(parts[1]);
   file.click();
   
   //open the second file
   fileName = "test_my_archetype.feature";
   file = folders.withText(parts[2]);
   file.click();
});

When(/^I go to the tab with name '(.*?)'$/, function(tabName) { 
    var tabs = $("#tabs");
    var tab = tabs.find("li a").withName(tabName);
    tab.click();
});


When(/^I check if the url is "(.*?)"$/, function(url) {
  wd.getCurrentUrl();
});


Then(/^I see the folder sorted in alphabetical order$/, function() {
  var treeBar = $("#tree-bar");
  var folders = treeBar.find("li");
  
  _(folders).forEach(function (folder) {
    folder.find(".tree-label").click();
     $(wd).eval("console.debug(arguments[1])", folder);
    var link = links.withAttr("data-href", linkUrl).add(links.withAttr("href", linkUrl));
     folder.find(".tree-label").click();
    expect(link).to.have.size(1);
  });
  
});