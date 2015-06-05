(function() {
    'use strict';

    function StackTraceParser() {
        //configs
        this.location = "http://localhost:8089/#/editor/"
            //add here more patterns to ignore
        this.toIgnorePattern = /(.*)(\.java|Unknown Source|Native Method|WebSocketMessageBrokerStats)/g;
        this.javascriptIgnorePattern = /(.*)(dsl\.js)/g;
    }

    /**
     * Parse a line of the stacktarce depending on his type
     * 
     */
    StackTraceParser.prototype.parseLine = function(stackTraceLine) {
        var stackTraceParsed = "";
        if (isFeatureFile(stackTraceLine)) {
            stackTraceParsed += this.parseFeatureFile(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (isJavascriptFile(stackTraceLine)) {
            stackTraceParsed += this.parseJavascriptFile(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (isCausedBy(stackTraceLine)) {
            stackTraceParsed += this.parseCausedBy(stackTraceLine, this.location);
            return stackTraceParsed;
        }

        if (this.isNotJavaException(stackTraceLine)) {
            stackTraceParsed += stackTraceLine + "\n";
            return stackTraceParsed;
        }

        return stackTraceParsed;
    }

    function isCausedBy(str) {
        var causedByPat = /^Caused by: (.*)/gm;
        return str.match(causedByPat);
    }

    function isFeatureFile(str) {
        return str.match(/(.*)(\.feature)/g);
    }

    function isJavascriptFile(str) {
        return str.match(/(\.js)/g);
    }

    StackTraceParser.prototype.isNotJavaException = function(str) {
        return !str.match(this.toIgnorePattern);
    }


    StackTraceParser.prototype.parseFeatureFile = function(str) {
        var line, link = "";
        var outsideParenthesisPatt = /[^\(\)]+/g
        var matches = outsideParenthesisPatt.exec(str);
        if (matches[0]) {
            line = matches[0];
            var path = extractFileName(str);
            if (path) {
                link = path;
            }
            line += link + "\n";
        }
        return line;
    }


    StackTraceParser.prototype.parseJavascriptFile = function(str) {
        //case internal/dsl.js, we want to ignore it
        if (str.match(this.javascriptIgnorePattern)) {
            return "";
        }
        var line = "",
            link;
        var path = extractFileName(str)
        if (path) {
            link = path;
            line += link + "\n";
        }
        return line;
    }


    StackTraceParser.prototype.parseCausedBy = function(str) {
        return str;
    }

    //////////////////////////////////////////////////////////////////
    // Extract functions
    //////////////////////////////////////////////////////////////////

    /**
     * Extract the file name of a string
     * Example:
     *  content - (/home/raphael/workspace/minium/minium-developer-e2e-tests/src/test/resources/features/Run.feature:6)
     *  and return the relative path - features/Run.feature:6
     */
    function extractFileName(content) {
        var regExp = /\(([^)]+)\)/g;
        //get  the value between the parentheses
        var matches = regExp.exec(content);

        //check if the path has /resources/
        var relativePath = matches[1].indexOf("/resources/") != -1 ? matches[1].split("/resources/")[1] : matches[1];
        
        return relativePath;
    }

    /**
     *
     * Extract file name
     * Example
     * - str = features/Run.feature:6
     * - return 
     *      path - features/Run.feature
     *      lineNo - 6
     */
    function extractLine(str) {
        var lineNo;
        var path;
        try {
            var obj = str.split(':');
            path = obj[0];
            lineNo = parseInt(obj[obj.length - 1]);
        } catch (e) {
            console.debug(str);
        }

        return {
            path: path,
            lineNo: lineNo
        };

    };



    angular.module('minium.stacktrace.parser')
        .service('stackTraceParser', StackTraceParser);
})();
