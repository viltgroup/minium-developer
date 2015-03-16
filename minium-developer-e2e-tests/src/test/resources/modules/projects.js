var base = require("base"),
    forms = require("forms"),
    menu = require("menu");

var projects = {
  createProject : function (fields) {
    menu.open([ "Project", "Create Project" ]);
    
    forms.submit({
      fields : fields,
      submitBtn: $(".modal-footer .btn").not(":disabled").withText("Create")
    });
  },
  
  checkProject : function (path) {
    menu.open([ "Project", "Open Project" ]);
    forms.fill({ "Project Directory" : path });
    
    var validations = forms.getFldValidations("Project Directory");
    var projExists = validations.withText("Project exists").checkForExistence("fast");
    
    var cancelBtn = base.find(".modal-footer .btn").withText("Cancel");
    cancelBtn.click();
    
    return projExists;
  },
  
  openProject : function (path) {
    menu.open([ "Project", "Open Project" ]);
    forms.fill({ "Project Directory" : path });
    
    var validations = forms.getFldValidations("Project Directory");

    var openBtn = base.find(".modal-footer .btn").withText("Open").not(":disabled");
    if (openBtn.checkForExistence("fast")) {
      openBtn.click();
      return true;
    }
    
    var cancelBtn = base.find(".modal-footer .btn").withText("Cancel");
    cancelBtn.click();
    
    return false;
  }
};

if (typeof module !== 'undefined') module.exports = projects;
