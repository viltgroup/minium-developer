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

pupinoIDE.factory('StepProvider', function($http) {
    return {
        all: function() {
            return $http.get("/app/rest/snippets");
        }
    };
});

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

pupinoIDE.factory('SnippetsProviderBWC', function() {
    return {
        all: function() {
            return [{
                name: "When I fill:",
                trigger: "fill",
                content: [
                    "When I fill:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Given the following persons exist:",
                trigger: "given",
                content: [
                    "Given the following persons exist:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Then I see in fields:",
                trigger: "fields",
                content: [
                    "Then I see in fields:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Then I should see the error message:",
                trigger: "error",
                content: [
                    "Then I should see the error message:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Then I should see the following sections:",
                trigger: "error",
                content: [
                    "Then I should see the following sections:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }, {
                name: "Then I should not see the following sections:",
                trigger: "error",
                content: [
                    "hen I should not see the following sections:",
                    "  | ${1:attr1} | ${2:attr2} |",
                    "  | ${3:attr1} | ${4:attr2} |"
                ].join("\n")
            }];
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


pupinoIDE.factory('WebDriverFactory', function($http) {
    return {
        create: function(varName, type) {
            return $http.post("/app/rest/webDrivers/" + varName + "/create", {
                type: type
            });
        },
        quit: function(varName) {
            return $http.post("/app/rest/webDrivers/" + varName + "/quit")
        }
    };
});

pupinoIDE.factory('RemoteWebDriverFactory', function($http) {
    return {
        create: function(type, url) {
            return $http.post("/app/rest/webDrivers/" + varName + "/create", {
                type: type,
                remoteUrl: url
            })
        }
    };
});


pupinoIDE.service('FileLoader', function($q, FS) {

    var all = [];

    this.loadFile = function(props, editors) {
        console.debug(props)
            //load the file and create a new editor instance with the file loaded
        var newEditor;
        var result = editors.isOpen(props);

        var deferred = $q.defer();

        if (props === "") {
            //create an empty editor
            newEditor = editors.addInstance("", 1);
            deferred.resolve(newEditor);
        } else if (result.isOpen) {
            var id = result.id;
            //tab is already open
            var tab = "#panel_" + id;
            var index = $('#tabs a[href="' + tab + '"]').parent().index();
            $("#tabs").tabs("option", "active", index);
        } else {
            var path = props.relativeUri || props;
            console.debug(path);
            FS.get({
                path: path
            }, function(fileContent) {
                newEditor = editors.addInstance(fileContent);
                deferred.resolve(newEditor);
            });
        }

        return deferred.promise;

    }

});


pupinoIDE.factory('SessionID', function($http, $q) {
    return {
        sessionId: function() {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.get('app/rest/sessionId')
                .then(function(response) {
                    return response.data;
                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    };
});

// This module creates and append the new elements create for new tabs
pupinoIDE.factory('TabFactory', function($http, $q) {
    var tabFactory = {
        height: '700',
    };

    tabFactory.createTab = function(tabUniqueId, fileProps) {
        var fileName = fileProps.name || "untitled";

        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li id="panel_nav_' + tabUniqueId + '" data-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '" title="' + fileProps.relativeUri + '">' + fileName + ' <span id="save_' + tabUniqueId + '" class="hide">*</span></a> <span class="ui-icon ui-icon-close" ></span></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        console.log('tabIndex: ' + tabIndex);

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // set the size of the panel
        // newTabPanelElement.width('600');
        // newTabPanelElement.height('600');

        // // set the size of the editor
        // newEditorElement.width('1180');
        newEditorElement.height(this.height);
    };

    return tabFactory;

});
