'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cucumby.services', ['ngResource'])
    .value('version', '0.1')
    .factory('FS', function($resource) {
        return $resource("/app/rest/fs", {
            path: "/"
        }, {
            list: {
                method: 'GET',
                params: {
                    action: "list"
                },
                isArray: true
            },
            search: {
                method: 'GET',
                params: {
                    action: "search"
                },
                isArray: true
            }
        });
    })


.factory('launcherService', function($http) {
        return {
            launch: function(params) {
                console.debug(JSON.stringify(params));
                return $http.post("/app/rest/launch", params);
            },
            dotcucumber: function() {
                return $http.get("/app/rest/dry-run", {
                    params: {
                        dotcucumber: true
                    }
                });
            },
            autocomplete: function(autocompleteReq) {
                return $http.post("/app/rest/autocomplete", autocompleteReq);
            },
            stop: function() {
                return $http.post("/app/rest/stop", {});
            }
        };
    })
    .factory('FormatService', function($http) {
        return {
            file: function(path) {
                console.debug(path);
                return $http.post('/app/rest/format', path);
            },
            directory: function(path) {
                console.debug(path);

                return $http.post('/app/rest/format?action=directory', path);
            },
        };
    })

.factory('StepProvider', function() {
        return {
            all: function() {
                return [
                    'I am at section "(.*?)"',
                    'I click "(.*?)"',
                    'I click on navigation "(.*?)"',
                    'I click on operation "(.*?)"',
                    'I click on row with "(.*?)" as "(.*?)"',
                    'I fill "(.*?)" with "(.*?)"',
                    'I fill:',
                    'I filter "(.*?)" with "(.*?)"',
                    'I filter:',
                    'I go to page (\d+)',
                    'I navigate to "(.*?)"',
                    'I see in fields:',
                    'I should see "(.*?)" in the table under column "(.*?)"',
                    'I should see "(.*?)" on the first table row under column "(.*?)"',
                    'I should see (\d+) rows in the table',
                    'I should see a table row with values:',
                    'I should see an error message in "(.*?)"',
                    'I should see values:',
                    'I\'m logged in as (\w+)',
                    'the following companies exist:',
                    'the following customers exist:',
                    'the following machines exist:',
                    'the following operators exist:',
                    'the following stores exist:',
                    'the following terminals exist:',
                    'the following transactions exist:',
                    'there are (\d+) random companies',
                    'there are (\d+) random customers',
                    'there are (\d+) random machines',
                    'there are (\d+) random operators',
                    'there are (\d+) random stores',
                    'there are (\d+) random terminals',
                    'there are (\d+) random transactions'
                ];
            }
        };
    })
    .factory('SnippetsProvider', function() {
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
                }];
            }
        };
    })
    .factory('ReportService', function($resource) {
        return $resource('mocks/result.json', {}, {
            getData: {
                method: 'GET',
                isArray: false
            }
        });
    })
    .factory('SelectorGadgetService', function($http) {
        return {
            activate: function() {
                return $http.post("/app/rest/js/selectorGadget/activate");
            },
            deactivate: function() {
                return $http.post("/app/rest/js/selectorGadget/deactivate");
            },
            cssSelector: function() {
                return $http.post("/app/rest/js/selectorGadget/cssSelector");
            }
        };
    })
    .factory('EvalService', function($http) {
        return {
            eval: function(params) {
                return $http({
                    method: "POST",
                    url: '/app/rest/js/eval',
                    data: params ? $.param(params) : '',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            }
        };
    });
