var _ = require("lodash"),
    cucumberutils = require("cucumber/utils"),
    editorPage   = require("pages/editorpage");

var p = editorPage;

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

Given(/^I'm at Minium Developer$/, function() {
  browser.get(config.baseUrl);
});

Given(/^I am at modal "(.*?)"$/, function(modal) {
  var toolbar = $("#toolbar");
  var option = toolbar.find("ul li .dropdown-toggle").withText(modal);
  option.click();
  
  var menuOption = toolbar.find(".dropdown-menu span").withText(modal);
  menuOption.click();
});

Then(/^the editor should have theme "(.*?)"$/, function(arg) {
  var editor = $(".ace-"+ arg.toLowerCase());
  
  expect(editor).not.to.be.empty();
});

Then(/^the editor should have font size "(.*?)"$/, function(size) {
  var editor = $(".ace_editor");
  editor.withCss("font-size",size + "px");
  expect(editor).not.to.be.empty();
});

When(/^I fill:$/, function(datatable) {
    
    var objs = cucumberutils.asObjects(datatable);
    var inputs;
    objs.forEach(function (obj, i) {
      inputs = $("input,select");
      for (var colName in obj) {
        var fieldInput = inputs.withLabel(colName);
        var val = obj[colName];
        if (fieldInput.waitForExistence().is(":radio")) {
          fieldInput.withLabel(val).check();
        } else if (fieldInput.waitForExistence().is("select")) {
          fieldInput.select(val);
        } else {
          fieldInput.fill(val);
        }
      }
    });
});

Then(/^I reset theme$/, function() {
  resetTheme();
});






/*TABS*/

Given(/^I am at editor$/, function() {
  var tabs = $(".ui-tabs-panel");
  if (tabs.immediately().checkForUnexistence()) {
    browser.get(config.baseUrl);
  }
  expect(tabs).not.to.be.empty();
});

Given(/^The file "(.*?)" is open$/, function(fileName) {
  var tab = p.getTabs().find("li a").withName(fileName);
  expect(tab).not.to.be.empty();
});

Given(/^I have (\d+) open tabs$/, function(numTabs) {
  expect(p.numOfTabs()).to.be.equal(parseInt(numTabs));
});

Given(/^the file "(.*?)" is close$/, function(fileName) {
  var tab = p.getTabs().find("li a").withName(fileName);
  expect(tab).to.be.empty();
});


Given(/^I have a dirty file "(.*?)"$/, function(tabName) {
  var openTabs = $(".ui-tabs-nav li a");
  var tabText = openTabs.withText(tabName);
  expect(tabText).not.to.be.empty();
});



When(/^I open the file "(.*?)"$/, function(fileName) { 
  p.openFile(fileName);
});

When(/^I close the tab "(.*?)"$/, function(tabName) {
  var tabs = p.getTabs();
  var tab = tabs.find("li a").withName(tabName);
  var closeBtn = tab.closest("li").find(".ui-icon-close");
  closeBtn.click();
});

When(/^I refresh$/, function() { 
  browser.get(config.baseUrl);
});

When(/^I add to "(.*?)" text "(.*?)"$/, function(fileName, text) {
  p.insert(fileName, text);
});

When(/^I go to the tab "(.*?)"$/, function(tabName) {
  p.goToTab(tabName);
});

When(/^I save the file "(.*?)"$/, function(fileName) {
  $(".dropdown-toggle").click();
  $(".dropdown-menu").find("a").withText("Save").click();
});

When(/^I click on button "(.*?)"$/, function(text) {
  var btn = $(".btn").withText(text);
  btn.click();
});

When(/^I close all tabs$/, function() {
  var tabs = p.getTabs();
  var btnsClose = tabs.find(".ui-icon-close");
  var size = btnsClose.size();
  
  for(var i = size-1; i >= 0; i--){
    var btn = btnsClose.eq(i);
    btn.click();
  }
});



Then(/^I should see the tab "(.*?)"$/, function(tabName) {
  var tab = p.getTabs().find("li a").withName(tabName);
  expect(tab).not.to.be.empty();
});

Then(/^I should not see the tab "(.*?)"$/, function(tabName) {
  var tab = p.getTabs().find("li a").withName(tabName);
  expect(tab).to.be.empty();
});

Then(/^I should see (\d+) open tabs$/, function(numTabs) {
  expect(p.numOfTabs()).to.be.equal(parseInt(numTabs));
});

Then(/^I should have a dirty page$/, function() {
  var openTabs = $(".ui-tabs-nav li a");
  var numOpenTabs = openTabs.size();
  var tabText = openTabs.eq(numOpenTabs-1);
  var dirty = tabText.find("span").is(":not(.hide)");
  expect(dirty).to.be.equal(true);
});
 
Then(/^I should see the dirty file named "(.*?)"$/, function(tabName) {
  var openTabs = $(".ui-tabs-nav li a");
  var tabText = openTabs.withText(tabName);
  expect(tabText).not.to.be.empty();
});

Then(/^I should see the buttons for the type "(.*?)"$/, function(type) {
  p.checkVisibleButton(type);
});

Then(/^I should see a notification with text "(.*?)" and with type "(.*?)"$/, function(text,type) {
  p.expectNotificationMessages(type,text);
});

Then(/^There is only one open tab named 'untitled'$/, function() {
  var closed = false;
  var numTabs = p.numOfTabs();
  if(numTabs === 0) closed = true;
  else{
    var tab = p.getTabs().find("li a").withName("untitled");
    if(tab.size() === 1) closed = true;
  }
  expect(closed).to.be.equal(true);
});


/*SIDEBAR*/

Given(/^The side bar is not hiden$/, function() {
  var hiden = $(".full").find(".strech");
  expect(hiden).to.be.empty();
});

Given(/^(?:folder|file) "(.*?)" does not exist$/, function(path) {
  var fileElem = p.getFile(path);
  expect(fileElem).not.to.be.empty();
});

Given(/^Exists a folder \(or file\) "(.*?)"$/, function(nav) {
  var parts = nav.split(">");
    
  var treeBar = p.getTreeBar();
  var folders = treeBar.find("li");
  var exists = false;
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.size()>1 && elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 1){
        if(elem.size()===1)
          exists=true;
      }
  });
  expect(exists).to.be.equal(true);
});



When(/^I create a new folder "(.*?)"$/, function(nav) {
  var parts = nav.split("/");
    
  var treeFolders = p.getTreeBar();
  var folders = treeFolders.find("li");
  
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 2){
        elem.contextClick()
        var btnNewFolder = $("#context-menu2").find("a").withText("New Folder");
        btnNewFolder.click();
        var wind = $(".modal-content");
        wind.find(".ng-invalid-required").fill(parts[parts.length-1]);
        wind.find(".btn-primary").click();
        return true;
      }
  });
});

When(/^I delete the folder "(.*?)"$/, function(nav) {
  var parts = nav.split(">");
    
  var treeFolders = p.getTreeBar();
  var folders = treeFolders.find("li");
  
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 1){
        elem.contextClick()
        var btnNewFolder = $("#context-menu2").find("a").withText("Delete Folder");
        btnNewFolder.click();
        return true;
      }
  });
  $("div").alert().accept();
});

When(/^I click on the collapse button$/, function() {
  $(".fa-minus-square-o").click();
});

When(/^I refresh the navigation bar$/, function() {
  $(".fa-refresh").click();
});

When(/^I create a new file "(.*?)"$/, function(nav) {
  var parts = nav.split(">");
    
  var treeFolders = p.getTreeBar();
  var folders = treeFolders.find("li");
  
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 2){
        elem.contextClick()
        var btnNewFolder = $("#context-menu2").find("a").withText("New File");
        btnNewFolder.click();
        var wind = $(".modal-content");
        wind.find(".ng-invalid-required").fill(parts[parts.length-1]);
        wind.find(".btn-primary").click();
        return true;
      }
  });
});

When(/^I delete the file "(.*?)"$/, function(nav) {
  var parts = nav.split(">");
    
  var treeFolders = p.getTreeBar();
  var folders = treeFolders.find("li");
  
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 1){
        elem.contextClick()
        var btnNewFolder = $("#context-menu2").find("a").withText("Delete");
        btnNewFolder.click();
        return true;
      }
  });
});



Then(/^I see the folders sorted in alphabetical order$/, function() {
  var elems = p.getFirstLevelTreeBar();
  var names = [], namesO = [];
  for(var i = 0; i < elems.size(); i++){
    var elem = elems.eq(i);
    if(elem.is(":not(.tree-leaf)")){
      var n = elem.children().eq(2).text();
      names.push(n);
      namesO.push(n);
    }
  }
  namesO.sort();
  var ordered = true, j=0, size=namesO.length;
  while(j<size && ordered){
    if(namesO[i]!==names[i])
      ordered=false;
    j++;
  }
  expect(ordered).to.be.equal(true);
});

Then(/^I see the files sorted in alphabetical order$/, function() {
  var elems = p.getFirstLevelTreeBar();
  var names = [], namesO = [];
  for(var i = 0; i < elems.size(); i++){
    var elem = elems.eq(i);
    if(elem.is(".tree-leaf")){
      var n = elem.children().eq(2).text();
      names.push(n);
      namesO.push(n);
    }
  }
  namesO.sort();
  var ordered = true, j=0, size=namesO.length;
  while(j<size && ordered){
    if(namesO[i]!==names[i])
      ordered=false;
    j++;
  }
  expect(ordered).to.be.equal(true);
});

Then(/^I should see the folder \(or file\) "(.*?)" in the navigation tree$/, function(nav) {
  var parts = nav.split(">");
    
  var treeBar = p.getTreeBar();
  var folders = treeBar.find("li");
  var exists = false;
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.size()>1 && elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 1){
        if(elem.size()===1)
          exists=true;
      }
  });
  expect(exists).to.be.equal(true);
});

Then(/^I should not see the folder \(or file\) "(.*?)" in the navigation tree$/, function(nav) {
  var parts = nav.split(">");
    
  var treeBar = p.getTreeBar();
  var folders = treeBar.find("li");
  var exists = false;
  _.each(parts, function (part,i) {
      elem = folders.find("span").withText(part);
      if(elem.size()>1 && elem.closest("li").is(".tree-collapsed"))
        elem.click();
      if( i == parts.length - 1){
        if(elem.size()===1)
          exists=true;
      }
  });
  expect(exists).to.be.equal(false);
});

Then(/^The navigation tree bar is colapsed$/, function() {
  var treeFirstLevel = p.getFirstLevelTreeBar();
  var size = treeFirstLevel.size();
  var colapsed = true;
  var i=0;
  while(colapsed && i<size){
    if(treeFirstLevel.eq(i).is(".tree-expanded"))
      if(treeFirstLevel.eq(i).is(":not(.tree-leaf)"))
        colapsed = false;
    i++;
  }
  expect(colapsed).to.be.equal(true);
});



/*RUN*/

When(/^I select the scenario number (\d+) in the feature "(.*?)"$/, function(line, fileName) {
  var tab = p.goToTab(fileName);
  var linesTests = tab.find(".ace_text-layer").find(".ace_keyword").withText("Scenario:").closest("div");
  var test = linesTests.eq(line-1);
  test.click();
});

When(/^I click on toolbar "(.*?)"$/, function(nav) {
  var parts = nav.split(">");
  var btnMenu = $(".dropdown-toggle").withText(parts[0]);
  var btnSubMenu =  $(".ladda-label").withText(parts[1]);
  
  btnMenu.click();
  btnSubMenu.click();
});

When(/^I choose the browser "(.*?)"$/, function(browserName) {
  browserName="Chrome "
  var browsers = $(".modal-content").find("form").withName("newLogForm").find("button");
  var browserBtn = browsers.withText(browserName);
  browserBtn.click();
  $("#createWebDriver").click();
});



Then(/^I can see all the available browsers$/, function() {
  var win = $(".modal-content");
  var browsers = win.find("form").withName("newLogForm");
  expect(browsers).not.to.be.empty();
});
 
Then(/^The folders and files are sorted in alphabetical order$/, function() {
  var ordered = p.checkSideBarOrder();
  expect(ordered).to.be.equal(true);
});

Then(/^I should see a new browser window$/, function() {
  var newWin = browser.root();
  expect(newWin).not.to.be.empty();
});






var writeCode = function(code, selected) {
  var editor = ace.edit($(this).attr("id"));
  var session = editor.getSession();
  var position = editor.getCursorPosition();
  var selection = editor.getSelection(); 
  selection.clearSelection();
  session.insert(position, code);
  if (selected) {
    var Range = ace.require('ace/range').Range;
    var endPosition = editor.getCursorPosition();
    selection.addRange(new Range(
        position.row, 
        position.column,
        endPosition.row,
        endPosition.column
    ));
  } else {
    position = editor.getCursorPosition();
    selection.clearSelection();
    editor.moveCursorToPosition(position);
  }
};

var focus = function() {
  var editor = ace.edit($(this).attr("id"));
  editor.focus();
};


