'use strict';

miniumDeveloper
    .config(function($stateProvider, $httpProvider, $translateProvider, modalStateProvider, $urlRouterProvider) {

        $stateProvider
            .state('global.editorarea', {
                url: "/editor/*path",
                templateUrl: "minium.developer/views/editor.area/index.html",
                controller: "EditorAreaMultiTabController"
            })


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
        modalStateProvider.state('global.editorarea.preferences', {
            templateUrl: 'minium.developer/views/preferences/preferences.html',
            controller: 'PreferencesController'
        });
    });
