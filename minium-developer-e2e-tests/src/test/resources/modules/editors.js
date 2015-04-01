var base = require("base"),
    files = require("files");

var AceEditorProxy = function (editorElem) {
  this.elem = editorElem;
  
  var that = this;
  
  // function names to proxy
  var aceFnNames = [
    "getValue",
    "setValue",
    "selectAll",
    "moveCursorTo"
  ];
  
  aceFnNames.forEach(function (fnName) {
    // create a proxy function
    that[fnName] = function () {
      editorElem.apply(function () {
        var args = Array.prototype.slice.call(arguments);
        // get first argument (fnName)
        var fnName = args.shift();
        var editor = ace.edit($(this).attr("id"));
        console.log("Calling", fnName, "with args", args);
        var result = editor[fnName].apply(editor, args);
        if (result) {
          try {
            return JSON.stringify(result);
          } catch (e) { 
            // could not convert to JSON, oh well...
          }
        }
      }, [ fnName ].concat(Array.prototype.slice.call(arguments)));
    };
  });
};

AceEditorProxy.prototype.gutterCells = function (filter) {
  var gutterCells = this.elem.find(".ace_gutter-cell");
  return filter ? gutterCells.filter("." + filter) : gutterCells; 
}

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