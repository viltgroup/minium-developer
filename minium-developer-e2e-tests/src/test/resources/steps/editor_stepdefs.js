var editors = require("editors");

When(/^I move the cursor to line (\d+)?$/, function (line) {
  editors.currentEditor().moveCursorTo(parseInt(line) - 1);
});

Then(/^only lines (\d+\s*(?:,\s*\d+)*) should be marked as passed$/, function (linesStr) {
  var lines = linesStr.split(/\s*,\s*/);
  var gutterCells = editors.currentEditor().gutterCells("passed");
  gutterCells.waitForExistence();
  
  expect(gutterCells).to.have.size(lines.length);
  
  lines.forEach(function (line) {
    expect(gutterCells).to.have.text(line);
  });
});