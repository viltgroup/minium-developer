var base = require("base"),
    files = require("files");

var AceEditorProxy = function (editorElem) {
  var that = this;
  
  // function names to proxy
  var aceFnNames = [
    "getValue",
    "setValue",
    "selectAll"
  ];
  
  aceFnNames.forEach(function (fnName) {
    // create a proxy function
    that[fnName] = function () {
      console.log("proxy method for", fnName);
      editorElem.apply(function () {
        var args = Array.prototype.slice.call(arguments);
        // get first argument (fnName)
        var fnName = args.shift();
        var editor = ace.edit($(this).attr("id"));
        console.log("Calling", fnName, "with args", args);
        return editor[fnName].apply(editor, args);
      }, [ fnName ].concat(Array.prototype.slice.call(arguments)));
    };
  });
};

var editors = {
  
  tabs : function () {
    return base.find(".ui-tabs-anchor");
  },
  
  currentEditor : function () {
    return new AceEditorProxy(base.find(".ace_editor:visible"));
  },
  
  console : function () {
    var tab = editors.tabs().withText("console*");
    tab.click();
    return editors.currentEditor();
  },
  
  byPath : function (path) {
    var parts = _.filter(path.split("/"));
    var projName = parts[0];
    path = parts.slice(1).join("/");
    
    expect(files.root()).to.have.text(projName);
    
    var tab = editors.tabs().withAttr("title", path);
    if (base.waitForExistence().then(tab).checkForExistence("immediate")) {
      tab.click();
      return editors.currentEditor();
    } else {
      return null;
    }
  }
};

if (typeof module !== 'undefined') module.exports = editors;