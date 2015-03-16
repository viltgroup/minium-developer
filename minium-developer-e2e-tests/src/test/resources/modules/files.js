var _ = require("lodash"),
   base = require("base"),
   forms = require("forms");

var files = {
  
  tree : function () {
    return base.find("#tree-bar");
  },
  
  root : function () {
    return files.tree().find("li").first().find("> div > span");
  },
  
  byPath : function(path) {
    var parts = _.filter(path.split("/"));
    
    var root = elem = files.root().withText(parts[0]);
    for (var i = 1; i < parts.length; i++) {
      var part = parts[i];
      elem = root.closest("li").find("> treeitem > ul > li > div > span").withText(part);
      if (root.waitForExistence().then(elem).checkForExistence("immediate")) {
        if (elem.closest("li").is(".tree-collapsed")) elem.click();
      } else {
        break;
      }
      root = elem;
    }
    
    return elem;
  },
  
  checkPath : function(path) {
    return files.byPath(path).checkForExistence("fast");
  },
  
  openFile : function (path) {
    files.byPath(path).click();
  },
  
  delete : function (path) {
    files.byPath(path).contextClick();
    
    var deleteMenuitem = $(base.find("#context-menu2 a").withText("Delete"), base.find("#context-menu2 a").withText("Delete Folder")).visible();
    deleteMenuitem.click();
    
    base.alert().accept();
    
    expect(files.byPath(path)).to.not.exist();
  },
  
  create : function (type, path) {
    var parts = _.filter(path.split("/"));
    
    var parentPath = parts.slice(0, parts.length - 1).join("/");
    var parentElem = files.byPath(parentPath);
    
    if (files.root().waitForExistence().then(parentElem).checkForUnexistence("immediate")) {
      console.log("Creating parent folder", parentPath);
      files.createFolder(parentPath);
      // forces navigation until parentPath is reached
      parentElem = files.byPath(parentPath);
    }
    
    var btnNewFolder = base.find("#context-menu2").find("a").withText("New " + (type === "folder" ? "Folder" : "File"));
    
    parentElem.contextClick();
    btnNewFolder.click();
    
    var nameFld = base.find(":text");
    var submitBtn = base.find(".modal-footer .btn").withText("Update");
    
    nameFld.fill(parts[parts.length - 1]);
    submitBtn.click();
  },
  
  
  createFolder : function (path) {
    return files.create("folder", path);
  },
  
  createFile : function (path) {
    return files.create("file", path);
  }
};

if (typeof module !== 'undefined') module.exports = files;