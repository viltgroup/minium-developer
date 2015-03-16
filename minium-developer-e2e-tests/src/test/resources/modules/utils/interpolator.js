var _ = require("lodash");

var defaultVars;

function formatDate(date, format) {
  return String(new java.text.SimpleDateFormat(format || "yyyyMMddHHmmssSSS").format(date));
}

var interpolator = {
  
  resetDefaults : function(opts) {
    defaultVars = _.assign({
      timestamp : formatDate(new Date())
    }, opts || {});
  },

  evaluate : function(obj, vars) {
    if (obj instanceof Packages.java.lang.String) obj = String(obj);
    
    if (typeof obj === 'string') {
      vars = _.defaults(vars || {}, defaultVars);
      return _.template(obj, vars);
    } else {
      // applies interpolator.evaluate to each value
      return _.mapValues(obj, function (val) {
        return interpolator.evaluate(val);
      });
    }
  }
};

// export utils 
if (typeof module !== 'undefined') module.exports = interpolator;