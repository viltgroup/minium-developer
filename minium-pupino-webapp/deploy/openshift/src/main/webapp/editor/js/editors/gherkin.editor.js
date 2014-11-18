var GerkinEditor = Class.extend({

  init : function(editor, fileContent) {
    this.aceEditor = aceEditor;
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.setShowPrintMargin(false);
    this.aceEditor.setFontSize(14);
    this.aceEditor.getSession().setTabSize(2);
    this.aceEditor.getSession().setUseSoftTabs(true);
    this.aceEditor.getSession().setMode("ace/mode/gherkin");

    this.setFileContent(fileContent);
  },

  setFileContent : function(fileContent) {
    this.fileContent = fileContent;
    var content = this.fileContent ? this.fileContent.content : "";
    this.aceEditor.setValue(content);
  },

});