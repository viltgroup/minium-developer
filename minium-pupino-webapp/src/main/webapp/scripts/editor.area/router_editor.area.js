'use strict';

pupinoApp
    .config(function($stateProvider, $httpProvider, $translateProvider, modalStateProvider, USER_ROLES) {

        $stateProvider
            .state('global.editorarea', {
                url: "/editor/*path?line",
                templateUrl: "views/editor.area/index.html",
                controller: "EditorAreaController",
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('global.multi', {
                url: "/editor-multi",
                templateUrl: "views/editor.area/index.html",
                controller: "EditorAreaMultiTabController",
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })


        modalStateProvider
            .state('global.editorarea.file', {
                abstract: true,
                templateUrl: "views/partials/modal/file.html",
                controller: "FileController"
        });

        modalStateProvider
            .state('global.editorarea.newFile', {
                templateUrl: "views/partials/modal/new-file.html",
                controller: "NewFileController"
            });

        modalStateProvider
            .state('global.editorarea.open', {
                templateUrl: "views/partials/modal/open.file.html",
                controller: "OpenFileController"
            });

        modalStateProvider
            .state('global.editorarea.results', {
                templateUrl: "views/partials/modal/launch.html",
                controller: "LaunchController"
            })



        //configuration to execute the file
        modalStateProvider.state('global.editorarea.configs', {
            templateUrl: "views/partials/modal/configs.html",
            controller: "ConfigsController"
        });
    });
