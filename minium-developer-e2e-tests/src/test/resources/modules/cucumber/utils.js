var _             = require("lodash");

var defaultVars;

function formatDate(date, format) {
  return new java.text.SimpleDateFormat(format || "yyyyMMddHHmmssSSS").format(date);
}

var utils = {
  
  initVars : function(opts) {
    defaultVars = _.assign({
      timestamp : formatDate(new Date())
    }, opts || {});
  },

  evaluate : function(str, vars) {
    if (typeof str !== 'string') return str;

    // templating escape regex (eg. {{timestamp}} )
    _.templateSettings.escape = /\{\{(.*?)\}\}/g;
    vars = _.defaults(vars || {}, defaultVars);
    
    return _.template(str, vars);
  },
  
  asArray : function(datatable) {
    var vals = datatable.asList(java.lang.String);
    var nativeVals = [];

    for (var i = 0; i < vals.size(); i++) {
      nativeVals.push(String(vals.get(i)));
    }
    return nativeVals;
  },

  asObjects : function(datatable) {
    var maps = datatable.asMaps(java.lang.String, java.lang.String);
    var nativeMaps = [];

    for (var i = 0; i < maps.size(); i++) {
      var map = maps.get(i);
      var nativeMap = {};
      for (var iter = map.keySet().iterator(); iter.hasNext();) {
        var prop = String(iter.next());
        nativeMap[prop] = utils.evaluate(String(map.get(prop)));
      }
      nativeMaps.push(nativeMap);
    }
    return nativeMaps;
  },
  
  asObject : function(datatable) {
    var map = datatable.asMap(java.lang.String, java.lang.String);

    var nativeMap = {};
    for (var iter = map.keySet().iterator(); iter.hasNext();) {
      var prop = String(iter.next());
      nativeMap[prop] = utils.evaluate(String(map.get(prop)));
    }

    return nativeMap;
  }
};

// export utils 
module.exports = utils;