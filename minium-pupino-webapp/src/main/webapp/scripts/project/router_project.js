'use strict';

pupinoApp
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.project', {
                url: "/project",
                templateUrl: 'views/projects.html',
                controller: 'ProjectController',
                resolve: {
                    resolvedProject: ['Project', function(Project) {
                        return Project.query().$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
    });
