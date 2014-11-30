'use strict';

pupinoApp
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

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
    });
