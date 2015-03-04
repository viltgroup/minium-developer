var expect = require("expect-webelements");
var _      = require("lodash");

var EditorPage = {
  
  baseEditor : null,
  
  init : function(tabName){
    var tabs = $("#tabs");
    var tab = tabs.find("li a").withName(tabName);
    var id = tab.attr("href");
    tab.click();
    this.baseEditor = $(id);
  },
  
  content: function(){
    return this.baseEditor.find(".ace_content").text().trim();
  },
  
  getGutters : function(){
    return this.baseEditor.find(".ace_gutter");
  },
  
  getGutterFailed : function(){
    return this.baseEditor.find(".ace_gutter .failed");
  },
  
  getGutterSuccess : function(){
    return this.baseEditor.find(".ace_gutter .success");
  },
  
  getGutterUndefined : function(){
    return this.baseEditor.find(".ace_gutter .undefined");
  },
  
  isMarked : function(line,markType){
    //check if a line has a marked (failed or sucess)
    //for annotation check for classes ( ace_error, ace_info, ace_warning)
    var aceGutters = this.baseEditor.find(".ace_gutter-cell");
    var aceLine = line - 1;
    var gutter = aceGutters.eq(aceLine);
    expect(gutter).to.have.attr("class",markType);
  },
  
  goToTab : function(tabName){
     var tabs = $("#tabs");
     var tab = tabs.find("li a").withName(tabName);
     var id = tab.attr("href");
     tab.click();
     var base = $(id);
     return base;
  },
  
  openFile :function(nav){
    var treeBar = $(wd,"#tree-bar");
    var treeElems = treeBar.find("li .tree-label");
    var parts = nav.split(">");
    var elem;
    _.each(parts, function (part) {
      elem = treeElems.withText(part);
      
      if (checkNotEmpty(elem) && elem.parent().is(":not(.tree-expanded)")) {
        elem.click();
      }
    });
    
  },
  
  numOfTabs: function(){
    var tabs = $("#tabs");
    return tabs.find("li").size();
  },
  
  closeTab: function(tabName){
    var tabs = this.getTabs();
    var tab = tabs.find("li a").withName(tabName);
    var closeBtn = tab.parent().find(".ui-icon-close");
    closeBtn.click();
  },
  
  //insert text in editor
  insert : function(){
   
  },
  
  searchAndOpenFile : function(fileName){
    var searchBtn = $(".fa-search");
    searchBtn.click();
    var searchInput = $("#search-query");
    searchInput.fill(fileName);
    var searchResult = $(".search-results h4").withText(fileName);
    searchResult.click();
  },
  
  //nav = "features > NewFeatue.feature"
  createNewFile : function(nav){
    
    var parts = nav.split(">");
    
    var newFileBtn = this.getTreePaneElem("New file");
    var table =  wd.find("table").visible();
    var rows = table.find("tr").not(":has(th)");
    var elem;
    
    //navigate to the file
    _.each(parts, function (part,i) {
       elem = rows.find("td a").withText(part);
       click(elem);
       
       if( i == parts.length - 1)
          return true;
    });
    
    //create the file [refactor]
    var input = $("input").withAttr("placeholder","File Name");
    
    this.fill(input,parts[parts.length - 1]);
    this.click("Create");
    
  },
  //check if tab is dirty
  isTabIsDirty : function(tabName){
     var tabs = $("#tabs");
     var tab = tabs.find("li a").withName(tabName);
     var result = tab.find(".dirty").is(":not(.hide)");
     return result;
  },
  
  isSameUrl: function(relativeUrl){
    var url = config.host + relativeUrl;
    var webDriverUrl = this.getUrl();
    return (webDriverUrl == url);
  },
  
  // check if the right buttons are displayed
  // when its a feature file dipslayed there will 
  // be visible some buttons
  // when its a js file others will be visible
  checkVisibleButton : function(type){
    var buttons = [];
    switch (type) {
      case 'feature':
        // code
        buttons = ["Run Test","Run All"];
        break;
      case 'js':
        buttons = ["Selector Gadget","Evaluate"];
        break;
      default:
        // code
    }
    var btn;
    _.each(buttons, function (button) {
      btn = wd.find(".btn").withText(button);
      expect(btn).not.to.be.empty();
    });
  },
  
  expectNotificationMessages : function(type,text){
    var notification = $(wd).find(".toast-"+type).withText(text);
    expect(notification).not.to.be.empty();
  },
  
  /*
  * Aux functions
  */
  fill: function(fieldInput,val){
    waitWhileEmpty(fieldInput);
    if (fieldInput.is(":checkbox, :radio")) {
      val = typeof val === "string" ? val === "true" : val;
      if (val) {
        check(fieldInput);
      } else {
        uncheck(fieldInput);
      }
    } else if (fieldInput.is("select")) {
      select(fieldInput, val);
    } else {
      fill(fieldInput, val);
    }
  },

  click : function(text){
    var buttons = $("button, :button, :submit, a");
    var button = buttons.withText(text).add(buttons.withValue(text)).visible();
    button.click();
  },
  //tree anel is on the side bar
  //with icons
  getTreePaneElem : function(title){
    return wd.find(".tree-panel a").withAttr("title",title);
  },
  
  getUrl : function(){
   return browser.getCurrentUrl();
  },
  
  getTabs : function(){
    return $("#tabs");
  },
  
};

var p = EditorPage;
//init page
p.init("Preferences.feature");

p.openFile("features > Preferences.feature");

p.goToTab("Preferences.feature");

p.closeTab("Preferences.feature");

p.content();
p.getGutterFailed();
p.getGutters();

p.searchAndOpenFile("stepdefs.js");

p.isMarked(11,"failed");

// export Page  
module.exports = EditorPage;