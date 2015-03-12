/**
 * Provide Snippets for the step files (example: step.js)
 *
 */
miniumDeveloper.factory('StepSnippetsProvider', function() {

    var KEYWORD = {
        GIVEN: "Given", // optionally you can give the object properties and methods
        WHEN: "When",
        THEN: "Then"
    };

    var createStep = function(keyword) {
        return keyword + "(/^${1:step}'(.*?)'$/, function(${2:arg}) { \n\n });"
    }

    return {
        all: function() {
            return [{
                name: "When",
                trigger: "when",
                content: [
                    createStep(KEYWORD.WHEN)
                ].join("\n")
            }, {
                name: "Given",
                trigger: "given",
                content: [
                    createStep(KEYWORD.GIVEN)
                ].join("\n")
            }, {
                name: "Then",
                trigger: "then",
                content: [
                    createStep(KEYWORD.THEN)
                ].join("\n")
            }];
        }
    };
})