miniumDeveloper.factory('SnippetsProvider', function() {
    return {
        all: function() {
            return [{
                name: "scenario",
                trigger: "sc",
                content: [
                    "Scenario: ${1:Little description here}",
                    "  Given ${2:something}"
                ].join("\n")
            }, {
                name: "scenario_outline",
                trigger: "sco",
                content: [
                    "Scenario Outline: ${1:Little description here}",
                    "  Given ${2:something}",
                    "  Examples:",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "feature",
                trigger: "feat",
                content: [
                    "Feature: ${1:Little description here}                                                                                                                                                                                                                                                              ",
                    " ",
                    "  Scenario Outline: ${2:Little description here}",
                    "    Given ${3:something}",
                    "    Examples:",
                    "    | ${4:attr1} | ${4:attr2} |"
                ].join("\n")
            }];
        }
    };
})