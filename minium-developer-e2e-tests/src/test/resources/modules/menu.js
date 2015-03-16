var _ = require("lodash"),
    base = require("base");

var menu = {
  open : function (path) {
    if (!(path instanceof Array)) {
      path = _.filter(path.split(/\s*>\s*/));
    }
    
    if (path.length > 0) {
        var menuitem = base.find(".nav .dropdown-toggle").withText(path[0]);
        menuitem.click();
    }
    if (path.length > 1) {
      var subMenuitem = base.find("#navbar .dropdown-menu a").withText(path[1]);
      subMenuitem.click();
    }
  }
};

if (typeof module !== 'undefined') module.exports = menu;