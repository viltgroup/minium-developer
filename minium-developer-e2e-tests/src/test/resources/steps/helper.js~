var expect = require("expect-webelements");
var _      = require("lodash");
var utils  = require("cucumber/utils");
var Class  = require("class").Class;
var editorPage   = require("pages/EditorPage");

var page = new Page();


//if we got more than one editor we need to select the editor
var tabs = $(wd, "#tabs");
var tab = tabs.find("li a").withName(tabName);
var id = tab.attr("href");
var baseEditor = $(wd,id);
click(tab);

//get content ace editor with base Editor
var aceContentBase  = baseEditor.find(".ace_content").text();

var trim = aceContentBase.trim();


//get all gutters 
var aceGutters = $(wd, ".ace_gutter");

//get all failed ace gutter 
var aceGutterCellFailed = $(wd,".ace_gutter .failed");

//check if a line has a marked (failed or sucess)
//for annotation check for classes ( ace_error, ace_info, ace_warning)
var aceGutters = baseEditor.find(".ace_gutter-cell");
var line = 11;
var aceLine = line - 1;
var gutter = aceGutters.eq(aceLine);

expect(gutter).to.have.attr("class","failed");

browser.get("http://www.google.com/ncr");

searchbox = $(":text").withName("q");
searchbox.highlight();

searchbox.fill("minion");

//searchbox.sendKeys([ Keys.ENTER ]);

wikipediaResult = $("h3 a").withText("Minion - Wikipedia, the free encyclopedia");
wikipediaResult.click();

firstParagraph = $("#mw-content-text p").first();
firstParagraph.highlight();
