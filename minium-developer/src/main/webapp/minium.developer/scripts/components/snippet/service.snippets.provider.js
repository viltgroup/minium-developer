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
                    "Background: ${1:Little description here}",
                    "  Given ${2:something}"
                ].join("\n")
            }, {
                name: "Escenari",
                trigger: "esc",
                content: [
                    "Escenari: ${1:Pequeña descripción aquí}",
                    "  Donat ${2:algo}",
                    "  Quan ${3:algo}"
                ].join("\n")
            }, {
                name: "Esquema de l'escenari",
                trigger: "sco",
                content: [
                    "Esquema de l'escenari: ${1:Pequeña descripción aquí}",
                    "  Donat ${2:algo}",
                    "  Examples:",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Funcionalitat",
                trigger: "func",
                content: [
                    "Funcionalitat: ${1:Pequeña descripción aquí}                                                                                                                                                                                                                                                              ",
                    " ",
                    "  Escenari: ${2:Pequeña descripción aquí}",
                    "    Donat ${3:something}"
                ].join("\n")
            }, {
                name: "estoy",
                trigger: "estoy",
                content: [
                 "estoy en la sección \"${1:Pequeña descripción aquí}\" ",
                 ""
                ].join("\n")
            },
            {
                name: "estoy",
                trigger: "estoy",
                content: [
                 "estoy en la sección \"${1:seccion}\" "
                ].join("\n")
            },
            {
                name: "anado",
                trigger: "ana",
                content: [
                 "añado ${1:cantidad} regalos con título \"${2:titulo}\" "
                ].join("\n")
            },
            {
                name: "total",
                trigger: "to",
                content: [
                 "el total de puntos es ${1:total-puntos} "
                ].join("\n")
            }



            ];
        }
    };
})
