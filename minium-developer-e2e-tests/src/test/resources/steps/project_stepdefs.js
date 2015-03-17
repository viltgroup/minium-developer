var _ = require("lodash"),
    interpolator = require("utils/interpolator"),
    projects = require("projects"),
    forms = require("forms"),
    files = require("files");

var tempDir = function () {
  var File = Packages.java.io.File;
  var System = Packages.java.lang.System;
  return String(new File(System.getProperty("java.io.tmpdir")).getCanonicalPath());
};

Given(/^project "(.*?)" exists$/, function(projName) {
  projName = interpolator.evaluate(projName);
  if (!projects.checkProject(tempDir() + "/" + projName)) {
    var fields = {
      "Project type" : "Automator Project",
      "Parent Directory" : tempDir(),
      "Project Name" : projName
    };
    projects.createProject(fields);
  }
});

Given(/^the active project is "(.*?)"$/, function (projName) {
  projName = interpolator.evaluate(projName);
  
  if (files.root().checkForExistence("fast") && files.root().withText(projName).checkForExistence("immediate")) return;
  
  if (!projects.openProject(tempDir() + "/" + projName)) {
    // project does not exist
    var fields = {
      "Project type" : "Automator Project",
      "Parent Directory" : tempDir(),
      "Project Name" : projName
    };
    projects.createProject(fields);
    expect(files.root()).to.have.text(projName);
  }
});

When(/^I (?:try to )?create the following project:$/, function (datatable) {
  var fields = _.merge({ "Parent Directory" : tempDir() }, datatable.rowsHash());
  projects.createProject(interpolator.evaluate(fields));
});

Then(/^the active project should be "(.*?)"$/, function (projName) {
  expect(files.root()).to.have.text(interpolator.evaluate(projName));
});

Then(/^I should see the following files:$/, function(datatable) {
  datatable.raw().forEach(function (row) {
    var path = interpolator.evaluate(row[0]);
    expect(files.byPath(path)).to.exist();
  });
});

Then(/^I should see the following validation messages:$/, function(datatable) {
  datatable.raw().forEach(function (row) {
    var fld = row[0];
    expect(forms.getFldValidations(fld)).to.have.text(row[1]);
  });
});