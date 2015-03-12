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
    
  getFile : function(nav) {
    var parts = nav.split("/");
    
    var treeBar = $("#tree-bar");
    var folders = treeBar.find("li");

    var elem;
    parts.forEach(function (part) {
      elem = folders.find("span").withText(part);
      if (treeBar.then(elem).closest("li").immediately().waitForExistence().is(".tree-collapsed")) {
        elem.click();
      }
    });
    
    return elem;
  },
  
  openFile : function(nav) {
    getFile(nav).click();
  },
  
  numOfTabs: function(){
    var tabs = $("#tabs");
    return tabs.find("li").size();
  },
  
  closeTab: function(tabName){
    var tabName="developer_stepdefs.js";
    var tabs = this.getTabs();
    var tab = tabs.find("li a").withName(tabName);
    var closeBtn = tab.parent().find(".ui-icon-close");
    closeBtn.click();
  },
  
  //insert text in editor
  insert : function(fileName,text){
    var tab = p.goToTab(fileName);
    tab.find("textarea.ace_text-input").sendKeys(text);
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
    var table =  $("table").visible();
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
      btn = $(".btn").withText(button);
      expect(btn).not.to.be.empty();
    });
  },
  
  //succes(green),danger(red),warning(yellow)
  expectNotificationMessages : function(type,text){
    var notification = $(".toast-"+type).withText(text);
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
  
  checkSideBarOrder : function(){
   // var elements = $("#tree-bar").find("treecontrol").children().children();
    var elements = this.getFirstLevelTreeBar();
    var ordered = this.checkElementsOrder(elements);
    return ordered;
  },
  
  checkElementsOrder : function(elements){
    elements = $("#tree-bar").find("treecontrol").children().children().eq(4).children().eq(3).children().children();
    var folderOrderA = [], folderOrderB = [];
    var fileOrderA = [], fileOrderB = [];
    
    var i=0, size=elements.size(), ordered=true;
    while(ordered && i<size){
      var elem = elements.eq(i);
      var name = elem.children().eq(2).text();
      
      if(elem.is(".tree-leaf")){
        fileOrderA.push(name);
        fileOrderB.push(name);
      }else{
        if(elem.is(".tree-collapsed"))
          elem.click();
        folderOrderA.push(name);
        folderOrderB.push(name);
        var elemChildren = elem.children().eq(3).children().children();
        if(elemChildren.length>0)
          ordered = this.checkElementsOrder(elemChildren);
      }
      i++;
    }
    if(ordered){
      folderOrderA.sort();
      fileOrderA.sort();
      i=0; size=folderOrderA.length;
      while(i<size && ordered){
        if(folderOrderA[i]!==folderOrderB[i])
          ordered=false;
        i++;
      }
      i=0; size=fileOrderA.length;
      while(i<size && ordered){
        if(fileOrderA[i]!==fileOrderB[i])
          ordered=false;
        i++;
      }
    }
    return ordered;
    
    /*
    _.each(elements, function (elem) {
      var name = elem.children().eq(2).text();
      
      if(elem.is(".tree-leaf")){
        fileOrderA.push(name);
        fileOrderB.push(name);
      }else{
        if(elem.is(".tree-collapsed"))
          elem.click();
        folderOrderA.push(name);
        folderOrderB.push(name);
        this.checkFolderOrder(elem);
      }
    });
    
    
    folderOrderA.sort();
    fileOrderA.sort();
    var ordered = true, i=0, size=folderOrderA.length;
    while(i<size && ordered){
      if(folderOrderA[i]!==folderOrderB[i])
        ordered=false;
      i++;
    }
    i=0; size=fileOrderA.length;
    while(i<size && ordered){
      if(fileOrderA[i]!==fileOrderB[i])
        ordered=false;
      i++;
    }
    
    expect(ordered).to.be.equal(true);
    return ordered;
    */  
  },
  
  getTreePaneElem : function(title){
    return $(".tree-panel a").withAttr("title",title);
  },
  
  getTreeBar : function(){
    return $("#tree-bar");
  },
  
  getFirstLevelTreeBar : function(){
    var treeBar = this.getTreeBar();
    return treeBar.find("treecontrol").children().children();
  },
  
  getUrl : function(){
   return browser.getCurrentUrl();
  },
  
  getTabs : function(){
    return $("#tabs");
  },
  
};
// export Page  
module.exports = EditorPage;