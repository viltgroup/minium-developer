var base = require("base");

var notifications = {
  all : function () {
    return base.find(".toast");
  },
  
  successes : function () {
    return notifications.all().filter(".toast-success");
  },
  
  warnings : function () {
    return notifications.all().filter(".toast-warning");
  }
};

if (typeof module !== 'undefined') module.exports = notifications;