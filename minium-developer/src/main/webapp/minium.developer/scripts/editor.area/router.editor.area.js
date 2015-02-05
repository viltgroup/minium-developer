'use strict';

miniumDeveloper
    .config(function($stateProvider, $httpProvider, $translateProvider, modalStateProvider, $urlRouterProvider) {

        $stateProvider

        $stateProvider
            .state('global.editorarea', {
                abstract: true,
                url: "/editor/*path",
                views: {
                    'content@': {
                        templateUrl: "minium.developer/views/editor.area/index.html",
                        controller: 'EditorAreaController'
                    }
                }
            })
            .state('global.editorarea.sub', {
                url: '',
                views: {
                    'view1@global.editorarea': {
                        controller: "EditorAreaMultiTabController",
                        templateUrl: 'minium.developer/views/editor.area/partials/editors.html',
                    },
                    'treeNav@global.editorarea': {
                        controller: "TreeNavController",
                        templateUrl: 'minium.developer/views/editor.area/partials/tree-nav.html',
                    }
                }
            });
    
                
        modalStateProvider
            .state('global.editorarea.newFile', {
                templateUrl: "minium.developer/views/files/new-file.html",
                controller: "NewFileController"
            });

        modalStateProvider
            .state('global.editorarea.open', {
                templateUrl: "minium.developer/views/files/open.file.html",
                controller: "OpenFileController"
            });

        modalStateProvider
            .state('global.editorarea.results', {
                templateUrl: "minium.developer/views/editor.area/modal/launch.html",
                controller: "LaunchController"
            })

        //configuration to execute the file
        modalStateProvider.state('global.editorarea.configs', {
            templateUrl: "minium.developer/views/editor.area/modal/configs.html",
            controller: "ConfigsController"
        });

        //register backend
        modalStateProvider.state('global.editorarea.registerBackend', {
            templateUrl: "minium.developer/views/editor.area/modal/register-backend.html",
            controller: "BackendsController"
        });

        //register backend
        modalStateProvider.state('global.editorarea.help', {
            templateUrl: "minium.developer/views/editor.area/modal/help.html"
        });

        //register backend
        modalStateProvider.state('global.editorarea.sub.preferences', {
            templateUrl: 'minium.developer/views/preferences/preferences.html',
            controller: 'PreferencesController'
        });
    });
