var files = require("files");

Given(/^(?:folder|file) "(.*?)" does not exist$/, function(path) {
  var file = files.byPath(path);
  if (file.checkForExistence("fast")) {
    files.delete(path);
  }
});

Given(/^(folder|file) "(.*?)" exists$/, function(type, path) {
  var file = files.byPath(path);
  if (file.checkForUnexistence("fast")) {
    switch (type) {
      case 'folder':
        files.createFolder(path);
        break;
      case 'file':
        files.createFile(path);
        break;
    }
  }
});

When(/^I create folder "(.*?)"$/, function(path) {
  files.createFolder(path);
});

When(/^I create file "(.*?)"$/, function(path) {
  files.createFile(path);
});

When(/^I delete (?:folder|file) "(.*?)"$/, function(path) {
  files.delete(path);
});

Then(/^I should see (?:folder|file) "(.*?)"$/, function(path) {
  expect(files.byPath(path)).to.exist();
});

Then(/^I should not see (?:folder|file) "(.*?)"$/, function(path) {
  expect(files.byPath(path)).to.not.exist();
});