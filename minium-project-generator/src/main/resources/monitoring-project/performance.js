// Imports
var Long = Packages.java.lang.Long;
var timeUnits = require("minium/timeunits");

var performanceDataJSON;

// Functions
function getPerformanceJSON() {
  if (!performanceDataJSON || (performanceDataJSON && performanceDataJSON.url != browser.getCurrentUrl())) {
    $(":root").waitTime(3, timeUnits.SECONDS);
    performanceDataJSON = JSON.parse(browser.getPerformance());
  }

  return performanceDataJSON;
}

// Module
var performance = {
  getJSON : function() {
    return getPerformanceJSON();
  },
  
  getString : function() {
    return JSON.stringify(getPerformanceJSON());
  },
  
  getPageloadInSeconds : function() { 
    var performanceTiming = getPerformanceJSON().data.timing;
    var loadEventEnd = Long(performanceTiming.loadEventEnd);
    var navigationStart = Long(performanceTiming.navigationStart);
  
    return (loadEventEnd - navigationStart) * 0.001;
  },
  
  getURL : function() {
    return getPerformanceJSON().url;
  },
  
  getPerformanceJSON : function() {
    return getPerformanceJSON().data;
  },
  
  getPerformanceString : function() {
    return JSON.stringify(getPerformanceJSON().data);
  },
  
  getStatusCode : function() {
    return getPerformanceJSON().statusCode;
  },
  
  getStatsJSON : function() {
    return getPerformanceJSON().stats;
  },
  
  getStatsString : function() {
    return JSON.stringify(getPerformanceJSON().stats);
  },
  
  getJSErrorsJSON : function() {
    return getPerformanceJSON().jsErrors;
  },
  
  getJSErrorsString : function() {
    return JSON.stringify(getPerformanceJSON().jsErrors);
  }
};

if (typeof module !== 'undefined') module.exports = performance;