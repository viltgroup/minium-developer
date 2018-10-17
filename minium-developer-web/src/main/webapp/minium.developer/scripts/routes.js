'use strict';

miniumDeveloper
    .config(function($stateProvider, $httpProvider, $translateProvider, modalStateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

        //////////////////////////////////////////////////////////////////
        //
        // Angular encode the url
        // with this features/preferences.features => features%252Fpreferences.features
        // So we need to register a custom type
        // from https://github.com/angular-ui/ui-router/issues/1557
        //
        //////////////////////////////////////////////////////////////////
        function valToString(val) {
            return val != null ? val.toString() : val;
        }

        function regexpMatches(val) { /*jshint validthis:true */
            return this.pattern.test(val);
        }
        $urlMatcherFactoryProvider.type("uriType", {
            encode: valToString,
            decode: valToString,
            is: regexpMatches,
            pattern: /.*/
        });

        $stateProvider
            .state('global.editorarea', {
                abstract: true,
                url: '/editor/{path:uriType}?line',
                views: {
                    'content@': {
                        templateUrl: "minium.developer/views/editor.area/index.html",
                        controller: 'EditorAreaController'
                    },
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('toolbar');
                        $translatePartialLoader.addPart('editor.area');
                        $translatePartialLoader.addPart('project');
                        $translatePartialLoader.addPart('tree.nav');
                        return $translate.refresh();
                    }]

                }
            })
            .state('global.editorarea.sub', {
                url: '',
                views: {
                    'navbar@global.editorarea': {
                        templateUrl: 'minium.developer/views/toolbar/toolbar.html',
                        controller: 'NavbarController'
                    },
                    'view1@global.editorarea': {
                        controller: "EditorAreaMultiTabController",
                        templateUrl: 'minium.developer/views/editor.area/partials/editors.html',
                    },
                    'context-menu@global.editorarea': {
                        controller: "ContextMenuEditorController",
                        templateUrl: 'minium.developer/views/editor.area/partials/editor-context-menu.html',
                    },
                    'treeNav@global.editorarea': {
                        controller: "TreeNavController",
                        templateUrl: 'minium.developer/views/tree.nav/tree-nav.html',
                    },
                    'console@global.editorarea': {
                        controller: "ConsoleController",
                        templateUrl: 'minium.developer/views/console/console.html',
                    }
                }
            });


        modalStateProvider
            .state('global.editorarea.sub.newFile', {
                templateUrl: "minium.developer/views/files/new-file.html",
                controller: "NewFileController"
            });

        modalStateProvider
            .state('global.editorarea.sub.open', {
                templateUrl: "minium.developer/views/files/search.file.html",
                controller: "SearchFileController"
            });

        //register backend
        modalStateProvider.state('global.editorarea.sub.registerBackend', {
            templateUrl: "minium.developer/views/editor.area/modal/register-backend.html",
            controller: "BackendsController"
        });

        //help
        modalStateProvider.state('global.editorarea.sub.help', {
            templateUrl: "minium.developer/views/editor.area/modal/help.html"
        });

        //version
        modalStateProvider.state('global.editorarea.sub.version', {
            templateUrl: "minium.developer/views/version/version.html",
            controller: "VersionController"
        });

        //report
        modalStateProvider.state('global.editorarea.sub.report', {
            templateUrl: "minium.developer/views/editor.area/modal/launch.html"
        });

        //register backend
        modalStateProvider.state('global.editorarea.sub.preferences', {
            templateUrl: 'minium.developer/views/preferences/preferences.html',
            controller: 'PreferencesController'
        });

        //projects
        modalStateProvider.state('global.editorarea.sub.newProject', {
            templateUrl: 'minium.developer/views/project/new.project.html',
            controller: 'ProjectController'
        });

        modalStateProvider.state('global.editorarea.sub.importProject', {
            templateUrl: 'minium.developer/views/project/import.project.html',
            controller: 'ImportProjectController'
        });

        modalStateProvider.state('global.editorarea.sub.dependencies', {
            templateUrl: 'minium.developer/views/project/dependencies.project.html',
            controller: 'DependenciesController'
        });
    })
