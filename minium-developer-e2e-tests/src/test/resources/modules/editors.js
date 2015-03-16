var base = require("base"),
    files = require("files");

var editors = {
  
  tabs : function () {
    return base.find(".ui-tabs-anchor");
  },
  
  byPath : function (path) {
    var parts = _.filter(path.split("/"));
    var projName = parts[0];
    path = parts.slice(1).join("/");
    
    expect(files.root()).to.have.text(projName);
    
    var tab = editors.tabs().withAttr("title", path);
    if (base.waitForExistence().then(tab).checkForExistence("immediate")) {
      tab.click();
      return base.find(".ace_editor");
    } else {
      return $();
    }
  }
};

if (typeof module.exports !== 'undefined') module.exports = editors;