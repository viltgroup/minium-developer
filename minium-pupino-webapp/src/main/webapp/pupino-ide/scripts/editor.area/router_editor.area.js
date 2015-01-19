'use strict';

pupinoIDE
    .config(function($stateProvider, $httpProvider, $translateProvider, modalStateProvider, $urlRouterProvider) {

        $stateProvider
            .state('global.editorarea', {
                url: "/editor/*path",
                templateUrl: "pupino-ide/views/editor.area/index.html",
                controller: "EditorAreaController"
            })
            .state('global.multi', {
                url: "/editor-multi/*path",
                templateUrl: "pupino-ide/views/editor.area/index.html",
                controller: "EditorAreaMultiTabController"
            })

        modalStateProvider
            .state('global.editorarea.newFile', {
                templateUrl: "pupino-ide/views/editor.area/modal/new-file.html",
                controller: "NewFileController"
            });

        modalStateProvider
            .state('global.multi.newFile', {
                templateUrl: "pupino-ide/views/editor.area/modal/new-file.html",
                controller: "NewFileController"
            });

        modalStateProvider
            .state('global.editorarea.open', {
                templateUrl: "pupino-ide/views/editor.area/modal/open.file.html",
                controller: "OpenFileController"
            });

        modalStateProvider
            .state('global.editorarea.results', {
                templateUrl: "pupino-ide/views/editor.area/modal/launch.html",
                controller: "LaunchController"
            })

        //configuration to execute the file
        modalStateProvider.state('global.editorarea.configs', {
            templateUrl: "pupino-ide/views/editor.area/modal/configs.html",
            controller: "ConfigsController"
        });

        //register backend
        modalStateProvider.state('global.editorarea.registerBackend', {
            templateUrl: "pupino-ide/views/editor.area/modal/register-backend.html",
            controller: "BackendsController"
        });

        //register backend
        modalStateProvider.state('global.multi.help', {
            templateUrl: "pupino-ide/views/editor.area/modal/help.html"
        });
    });
