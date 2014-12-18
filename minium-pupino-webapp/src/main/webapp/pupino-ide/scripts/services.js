'use strict';

pupinoIDE.factory('launcherService', function($http) {
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
pupinoIDE.factory('FormatService', function($http) {
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

pupinoIDE.factory('StepProvider', function() {
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
pupinoIDE.factory('SnippetsProvider', function() {
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
pupinoIDE.factory('ReportService', function($resource) {
    return $resource('mocks/result.json', {}, {
        getData: {
            method: 'GET',
            isArray: false
        }
    });
})
pupinoIDE.factory('SelectorGadgetService', function($http) {
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
pupinoIDE.factory('EvalService', function($http) {
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
})

pupinoIDE.factory('FeatureFacade', function() {
    /**
     * Constructor
     */
    function FeatureFacade(data) {
        console.debug(data);
        this.feature = data;
        var elements = this.process(data);
    }

    /**
     * Public method, assigned to prototype
     */

    FeatureFacade.prototype.process = function(data) {
        var r = true;
        this.notPassingsteps = jsonPath.eval(data, "$..steps[?(@.status!='PASSED')]");
        this.failingSteps = jsonPath.eval(data, "$..steps[?(@.status=='FAILED')]");
        this.skippedSteps = jsonPath.eval(data, "$..steps[?(@.status=='UNDEFINED')]");
        this.passedSteps = jsonPath.eval(data, "$..steps[?(@.status=='PASSED')]");
        var durations = jsonPath.eval(data, "$..duration");

        var totalDuration = 0;
        $.each(durations, function() {
            totalDuration += this;
        });
        this.totalDuration = totalDuration;

        console.debug(this.notPassingsteps);
    };

    /**
     * Return the constructor function
     */
    return FeatureFacade;
});

/*
Factory to register backends
 */
pupinoIDE.factory('backendFactory', function($http) {
    return {
        register: function(params) {
            return $http.post("/app/rest/backends/register", params);
        }
    };
})