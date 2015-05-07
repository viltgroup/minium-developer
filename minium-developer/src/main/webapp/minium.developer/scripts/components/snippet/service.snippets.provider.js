/**
 * Provide Cucumber snippets
 *
 */
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
            }, {
                name: "background",
                trigger: "back",
                content: [
                    "Background:",
                    "  Given ${1:something}"
                ].join("\n")
            }, {
                name: "Escenari",
                trigger: "esc",
                content: [
                    "Escenari: ${1:Petita descripció aquí}",
                    "  Donat ${2:algo}",
                    "  Quan ${3:algo}"
                ].join("\n")
            }, {
                name: "Esquema de l'escenari",
                trigger: "sco",
                content: [
                    "Esquema de l'escenari: ${1:Petita descripció aquí}",
                    "  Donat ${2:algo}",
                    "  Examples:",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Funcionalitat",
                trigger: "func",
                content: [
                    "Funcionalitat: ${1:Petita descripció aquí}                                                                                                                                                                                                                                                              ",
                    " ",
                    "  Escenari: ${2:Petita descripció aquí}",
                    "    Donat ${3:algo}"
                ].join("\n")
            },
            {
                name: "estic",
                trigger: "estic",
                content: [
                 "estic a la secció \"${1:seccion}\" "
                ].join("\n")
            },
            {
                name: "afegeixo",
                trigger: "afegeixo",
                content: [
                 "afegeixo ${1:quantidad} regals amb títol \"${2:títol}\" "
                ].join("\n")
            },
            {
                name: "total",
                trigger: "to",
                content: [
                 "el total de punts és ${1:total-punts} "
                ].join("\n")
            }



            ];
        }
    };
})
